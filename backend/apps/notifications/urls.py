from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.notifications.views import NotificationEventViewSet

app_name = 'notifications'

router = DefaultRouter()
router.register('', NotificationEventViewSet, basename='notification')

urlpatterns = [
    path('', include(router.urls)),
]
