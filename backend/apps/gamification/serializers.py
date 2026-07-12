from rest_framework import serializers
from apps.gamification.models import (
    Reward,
    RewardRedemption,
    GoalDefinition,
    Challenge,
    Goal,
    ChallengeParticipation,
    Badge,
    EmployeeBadge
)

class RewardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reward
        fields = ['id', 'name', 'description', 'point_cost', 'stock']


class RewardRedemptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = RewardRedemption
        fields = ['id', 'employee', 'reward', 'redeemed_at', 'points_spent']
        read_only_fields = ['redeemed_at', 'points_spent']


class GoalDefinitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = GoalDefinition
        fields = ['id', 'name', 'source_model', 'source_field', 'computation', 'scope', 'suffix']


class GoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Goal
        fields = ['id', 'goal_definition', 'challenge', 'condition', 'target_value', 'current_value']


class ChallengeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Challenge
        fields = [
            'id', 'title', 'category', 'department', 'description',
            'xp', 'difficulty', 'periodicity', 'assignment_rule',
            'evidence_required', 'start_date', 'deadline', 'status'
        ]


class ChallengeParticipationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChallengeParticipation
        fields = [
            'id', 'challenge', 'employee', 'progress', 'proof_file_path',
            'approval_status', 'approved_by', 'xp_awarded', 'status'
        ]
        read_only_fields = ['xp_awarded', 'status', 'approved_by', 'approval_status']


class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = [
            'id', 'name', 'description', 'unlock_rule_type',
            'unlock_goal_definition', 'unlock_threshold',
            'grant_permission', 'limitation_number', 'icon_path'
        ]


class EmployeeBadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeBadge
        fields = ['id', 'employee', 'badge', 'awarded_at', 'granted_by', 'award_type']
        read_only_fields = ['awarded_at']
