from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.social.views import CSRActivityViewSet, EmployeeParticipationViewSet

app_name = 'social'

router = DefaultRouter()
router.register('activities', CSRActivityViewSet, basename='activity')
router.register('participations', EmployeeParticipationViewSet, basename='participation')

urlpatterns = [
    path('', include(router.urls)),
]
