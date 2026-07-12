from django.db import transaction
from django.utils import timezone
from django.core.exceptions import ValidationError
from .models import EmployeeParticipation
from apps.core.models import Employee
from .signals import participation_approved

class SocialService:
    @staticmethod
    @transaction.atomic
    def approve_participation(participation_id: str, approver_id: str) -> EmployeeParticipation:
        """
        Approves an employee's CSR participation.
        Grants the activity's configured XP and Points to the employee.
        """
        # Lock the participation record
        participation = EmployeeParticipation.objects.select_for_update().get(id=participation_id)
        
        if participation.status != 'pending':
            raise ValidationError("Only pending participations can be approved.")
            
        # The view layer and CannotSelfApprove permission should prevent this, but double check in service
        if str(participation.employee.id) == approver_id:
            raise ValidationError("You cannot approve your own participation.")
            
        approver = Employee.objects.get(id=approver_id)
        
        # Update participation status
        participation.status = 'approved'
        participation.approved_by = approver
        participation.approved_at = timezone.now()
        participation.save(update_fields=['status', 'approved_by', 'approved_at'])
        
        # Grant rewards (XP and Points)
        employee = participation.employee
        # Lock the employee record for safe currency update
        employee = Employee.objects.select_for_update().get(id=employee.id)
        
        employee.xp_total += participation.activity.reward_xp
        employee.points_balance += participation.activity.reward_points
        employee.save(update_fields=['xp_total', 'points_balance'])
        
        # Fire the decoupled signal for other apps to process (e.g., gamification, notifications)
        participation_approved.send(
            sender=SocialService,
            participation=participation,
            employee=employee,
            xp_awarded=participation.activity.reward_xp,
            points_awarded=participation.activity.reward_points
        )
        
        return participation
