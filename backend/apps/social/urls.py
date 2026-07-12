from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.social.views import CSRActivityViewSet, EmployeeParticipationViewSet, SocialDashboardViewSet

app_name = 'social'

router = DefaultRouter()
router.register('activities', CSRActivityViewSet, basename='activity')
router.register('participations', EmployeeParticipationViewSet, basename='participation')
router.register('dashboard', SocialDashboardViewSet, basename='dashboard')

urlpatterns = [
    path('', include(router.urls)),
]
