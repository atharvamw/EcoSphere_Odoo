from django.dispatch import receiver
from apps.social.signals import participation_approved

@receiver(participation_approved)
def check_badge_unlocks_on_participation(sender, participation, employee, xp_awarded, **kwargs):
    """
    Listens for participation approvals to evaluate if the employee has reached
    a new XP threshold for auto-awarding Badges.
    """
    if xp_awarded > 0:
        # Here we would call the BadgeService to evaluate and unlock badges
        # e.g., BadgeService.evaluate_badges_for_employee(employee)
        print(f"[Gamification] Checking badge unlocks for {employee.user.username} after earning {xp_awarded} XP.")
