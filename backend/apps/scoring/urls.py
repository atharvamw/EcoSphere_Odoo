from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.scoring.views import DepartmentScoreViewSet

app_name = 'scoring'

router = DefaultRouter()
router.register('scores', DepartmentScoreViewSet, basename='score')

urlpatterns = [
    path('', include(router.urls)),
]
