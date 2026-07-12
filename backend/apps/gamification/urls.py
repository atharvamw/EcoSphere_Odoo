from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.gamification.views import (
    RewardViewSet,
    RewardRedemptionViewSet,
    GoalDefinitionViewSet,
    ChallengeViewSet,
    GoalViewSet,
    ChallengeParticipationViewSet,
    BadgeViewSet,
    EmployeeBadgeViewSet,
    GamificationDashboardViewSet
)

app_name = 'gamification'

router = DefaultRouter()
router.register('rewards', RewardViewSet, basename='reward')
router.register('redemptions', RewardRedemptionViewSet, basename='redemption')
router.register('goal-definitions', GoalDefinitionViewSet, basename='goal-definition')
router.register('challenges', ChallengeViewSet, basename='challenge')
router.register('goals', GoalViewSet, basename='goal')
router.register('participations', ChallengeParticipationViewSet, basename='participation')
router.register('badges', BadgeViewSet, basename='badge')
router.register('employee-badges', EmployeeBadgeViewSet, basename='employee-badge')
router.register('dashboard', GamificationDashboardViewSet, basename='dashboard')

urlpatterns = [
    path('', include(router.urls)),
]
