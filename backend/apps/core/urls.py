from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.core.views import (
    CategoryViewSet,
    DepartmentViewSet,
    EmployeeViewSet,
    SiteSettingsViewSet,
    ProfileView,
    LeaderboardView,
)

app_name = 'core'

router = DefaultRouter()
router.register('categories', CategoryViewSet, basename='category')
router.register('departments', DepartmentViewSet, basename='department')
router.register('employees', EmployeeViewSet, basename='employee')
router.register('settings', SiteSettingsViewSet, basename='settings')

urlpatterns = [
    path('profile/', ProfileView.as_view(), name='profile'),
    path('leaderboard/', LeaderboardView.as_view(), name='leaderboard'),
    path('', include(router.urls)),
]
