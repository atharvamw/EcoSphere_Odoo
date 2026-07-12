from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from apps.governance.models import ESGPolicy, PolicyAcknowledgement, Audit, ComplianceIssue
from apps.governance.serializers import (
    ESGPolicySerializer,
    PolicyAcknowledgementSerializer,
    AuditSerializer,
    ComplianceIssueSerializer
)
from rest_framework.decorators import action
from rest_framework.response import Response

class ESGPolicyViewSet(viewsets.ModelViewSet):
    queryset = ESGPolicy.objects.all()
    serializer_class = ESGPolicySerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['post'])
    def acknowledge(self, request, pk=None):
        policy = self.get_object()
        employee = request.user.employee
        
        # Create acknowledgement
        PolicyAcknowledgement.objects.get_or_create(
            policy=policy,
            employee=employee,
            defaults={'status': 'acknowledged'}
        )
        
        # Create audit log
        Audit.objects.create(
            action="Policy Acknowledged",
            module="Governance",
            details=f"Policy {policy.id} acknowledged by {employee.user.username}",
            performed_by=request.user
        )
        
        return Response({'success': True})


class PolicyAcknowledgementViewSet(viewsets.ModelViewSet):
    queryset = PolicyAcknowledgement.objects.all()
    serializer_class = PolicyAcknowledgementSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Auto-associate acknowledgement with logged-in employee profile
        serializer.save(employee=self.request.user.employee)


class AuditViewSet(viewsets.ModelViewSet):
    queryset = Audit.objects.all()
    serializer_class = AuditSerializer
    permission_classes = [IsAuthenticated]


class ComplianceIssueViewSet(viewsets.ModelViewSet):
    queryset = ComplianceIssue.objects.all()
    serializer_class = ComplianceIssueSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['owner', 'status']


class GovernanceDashboardViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def kpis(self, request):
        active_policies = ESGPolicy.objects.filter(status='active').count()
        open_issues = ComplianceIssue.objects.filter(status__in=['open', 'in_progress']).count()
        audit_events = Audit.objects.count()
        # Mock compliance score for now, can be calculated dynamically later
        compliance_score = 95

        return Response({
            "complianceScore": {"value": compliance_score, "trend": "0%"},
            "openIssues": {"value": open_issues, "trend": "+0"},
            "criticalIssues": {"value": 0, "trend": "0"},
            "policiesAcknowledged": {"value": PolicyAcknowledgement.objects.count(), "trend": "+0"}
        })
