from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.governance.views import (
    ESGPolicyViewSet,
    PolicyAcknowledgementViewSet,
    AuditViewSet,
    ComplianceIssueViewSet,
    GovernanceDashboardViewSet
)

app_name = 'governance'

router = DefaultRouter()
router.register('policies', ESGPolicyViewSet, basename='policy')
router.register('acknowledgements', PolicyAcknowledgementViewSet, basename='acknowledgement')
router.register('audits', AuditViewSet, basename='audit')
router.register('compliance-issues', ComplianceIssueViewSet, basename='compliance-issue')
router.register('dashboard', GovernanceDashboardViewSet, basename='dashboard')

urlpatterns = [
    path('', include(router.urls)),
]
