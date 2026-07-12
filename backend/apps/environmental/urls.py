from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.environmental.views import (
    ProductViewSet,
    ProductESGProfileViewSet,
    EmissionFactorViewSet,
    CarbonTransactionViewSet,
    EnvironmentalGoalViewSet
)

app_name = 'environmental'

router = DefaultRouter()
router.register('products', ProductViewSet, basename='product')
router.register('profiles', ProductESGProfileViewSet, basename='profile')
router.register('factors', EmissionFactorViewSet, basename='factor')
router.register('transactions', CarbonTransactionViewSet, basename='transaction')
router.register('goals', EnvironmentalGoalViewSet, basename='goal')

urlpatterns = [
    path('', include(router.urls)),
]
