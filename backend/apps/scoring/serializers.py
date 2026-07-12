from rest_framework import serializers
from apps.scoring.models import DepartmentScore

class DepartmentScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = DepartmentScore
        fields = [
            'id', 'department', 'environmental_score', 'social_score',
            'governance_score', 'total_score', 'period_start', 'period_end', 'calculated_at'
        ]
