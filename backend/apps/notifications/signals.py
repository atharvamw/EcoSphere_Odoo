from django.dispatch import receiver
from apps.social.signals import participation_approved

@receiver(participation_approved)
def notify_on_participation_approved(sender, participation, employee, xp_awarded, points_awarded, **kwargs):
    """
    Listens for participation approvals to queue a notification to the employee.
    """
    # In a real system, we might create a NotificationEvent record here and/or trigger a Celery task
    # e.g., send_push_notification.delay(employee.id, "Your CSR participation was approved!")
    print(f"[Notifications] Queueing notification for {employee.user.username}: Participation approved! Earned {xp_awarded} XP and {points_awarded} Points.")
