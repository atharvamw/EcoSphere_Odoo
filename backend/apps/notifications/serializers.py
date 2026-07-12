from rest_framework import serializers
from apps.notifications.models import NotificationEvent

class NotificationEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationEvent
        fields = ['id', 'recipient', 'event_type', 'context', 'is_read', 'created_at']
        read_only_fields = ['created_at']
