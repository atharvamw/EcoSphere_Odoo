import uuid
from django.db import models
from apps.core.models import Employee

class NotificationEvent(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    recipient = models.ForeignKey(
        Employee,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    event_type = models.CharField(max_length=100) # compliance_alert, badge_awarded, csr_approved, etc.
    context = models.JSONField(default=dict, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['recipient', 'is_read'], name='idx_notif_recipient_read'),
        ]

    def __str__(self):
        return f"Notification for {self.recipient.user.username} - {self.event_type} (Read: {self.is_read})"
