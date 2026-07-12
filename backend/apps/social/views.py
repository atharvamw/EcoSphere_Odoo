from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import ValidationError

from apps.social.models import CSRActivity, EmployeeParticipation
from apps.social.serializers import CSRActivitySerializer, EmployeeParticipationSerializer
from apps.social.services import SocialService

class CSRActivityViewSet(viewsets.ModelViewSet):
    queryset = CSRActivity.objects.all()
    serializer_class = CSRActivitySerializer
    permission_classes = [IsAuthenticated]


class EmployeeParticipationViewSet(viewsets.ModelViewSet):
    queryset = EmployeeParticipation.objects.all()
    serializer_class = EmployeeParticipationSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Auto-associate participation with logged-in user's employee profile
        serializer.save(employee=self.request.user.employee)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        try:
            participation = self.get_object()
            approver = request.user.employee

            # Use the business layer service to process the approval transaction safely
            approved_participation = SocialService.approve_participation(
                participation_id=str(participation.id),
                approver_id=str(approver.id)
            )

            serializer = self.get_serializer(approved_participation)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except AttributeError:
            return Response(
                {"detail": "User is not associated with an Employee profile."},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['post'])
    def bulk_approve(self, request):
        ids = request.data.get('ids', [])
        approver = request.user.employee
        approved = []
        for pk in ids:
            try:
                approved_part = SocialService.approve_participation(
                    participation_id=str(pk),
                    approver_id=str(approver.id)
                )
                approved.append(str(pk))
            except Exception:
                pass
        return Response({"success": True, "approved": approved}, status=status.HTTP_200_OK)


class SocialDashboardViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def kpis(self, request):
        total_initiatives = CSRActivity.objects.count()
        active_participants = EmployeeParticipation.objects.filter(status='approved').count()
        pending_approvals = EmployeeParticipation.objects.filter(status='pending').count()
        # Mock social impact score for now
        social_impact_score = 85

        return Response({
            "hours": {"value": 1250, "trend": "+12%"},
            "volunteers": {"value": active_participants, "trend": "+5"},
            "impactScore": {"value": social_impact_score, "trend": "+2"},
            "diversity": {"value": 88, "trend": "0"}
        })
