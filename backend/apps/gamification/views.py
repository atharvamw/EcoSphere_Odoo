from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import ValidationError

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
from apps.gamification.serializers import (
    RewardSerializer,
    RewardRedemptionSerializer,
    GoalDefinitionSerializer,
    ChallengeSerializer,
    GoalSerializer,
    ChallengeParticipationSerializer,
    BadgeSerializer,
    EmployeeBadgeSerializer
)
from apps.gamification.services import GamificationService

class RewardViewSet(viewsets.ModelViewSet):
    queryset = Reward.objects.all()
    serializer_class = RewardSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['post'])
    def redeem(self, request, pk=None):
        try:
            reward = self.get_object()
            employee = request.user.employee

            # Execute transactional reward redemption using service layer logic
            redemption = GamificationService.redeem_reward(
                employee_id=str(employee.id),
                reward_id=str(reward.id)
            )

            serializer = RewardRedemptionSerializer(redemption)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except AttributeError:
            return Response(
                {"detail": "User is not associated with an Employee profile."},
                status=status.HTTP_400_BAD_REQUEST
            )


class RewardRedemptionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = RewardRedemption.objects.all()
    serializer_class = RewardRedemptionSerializer
    permission_classes = [IsAuthenticated]


class GoalDefinitionViewSet(viewsets.ModelViewSet):
    queryset = GoalDefinition.objects.all()
    serializer_class = GoalDefinitionSerializer
    permission_classes = [IsAuthenticated]


class ChallengeViewSet(viewsets.ModelViewSet):
    queryset = Challenge.objects.all()
    serializer_class = ChallengeSerializer
    permission_classes = [IsAuthenticated]


class GoalViewSet(viewsets.ModelViewSet):
    queryset = Goal.objects.all()
    serializer_class = GoalSerializer
    permission_classes = [IsAuthenticated]


class ChallengeParticipationViewSet(viewsets.ModelViewSet):
    queryset = ChallengeParticipation.objects.all()
    serializer_class = ChallengeParticipationSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(employee=self.request.user.employee)


class BadgeViewSet(viewsets.ModelViewSet):
    queryset = Badge.objects.all()
    serializer_class = BadgeSerializer
    permission_classes = [IsAuthenticated]


class EmployeeBadgeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = EmployeeBadge.objects.all()
    serializer_class = EmployeeBadgeSerializer
    permission_classes = [IsAuthenticated]
