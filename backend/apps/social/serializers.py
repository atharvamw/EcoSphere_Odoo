from rest_framework import serializers
from apps.social.models import CSRActivity, EmployeeParticipation

class CSRActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = CSRActivity
        fields = [
            'id', 'title', 'description', 'department',
            'category', 'reward_points', 'reward_xp',
            'activity_date', 'status'
        ]


class EmployeeParticipationSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeParticipation
        fields = [
            'id', 'employee', 'activity', 'status',
            'evidence_file', 'submitted_at', 'approved_at', 'approved_by'
        ]
        read_only_fields = ['status', 'submitted_at', 'approved_at', 'approved_by']
