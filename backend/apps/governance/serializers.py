from rest_framework import serializers
from apps.governance.models import ESGPolicy, PolicyAcknowledgement, Audit, ComplianceIssue

class ESGPolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = ESGPolicy
        fields = ['id', 'title', 'content', 'version', 'effective_date', 'status']


class PolicyAcknowledgementSerializer(serializers.ModelSerializer):
    class Meta:
        model = PolicyAcknowledgement
        fields = ['id', 'policy', 'employee', 'acknowledged_at', 'signature']
        read_only_fields = ['acknowledged_at']


class AuditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Audit
        fields = ['id', 'department', 'title', 'audit_type', 'audit_date', 'status', 'auditor', 'findings']


class ComplianceIssueSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComplianceIssue
        fields = ['id', 'audit', 'title', 'description', 'due_date', 'status', 'owner', 'created_at', 'resolved_at']
        read_only_fields = ['created_at', 'resolved_at']
