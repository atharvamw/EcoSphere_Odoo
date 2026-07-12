import uuid
from django.db import models
from apps.core.models import Employee, Department, Category

class CSRActivity(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('archived', 'Archived'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField()
    department = models.ForeignKey(
        Department,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='csr_activities'
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='csr_activities'
    )
    reward_points = models.PositiveIntegerField(default=0)
    reward_xp = models.PositiveIntegerField(default=0)
    activity_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='active')

    class Meta:
        verbose_name_plural = "CSR Activities"

    def __str__(self):
        return self.title


class EmployeeParticipationManager(models.Manager):
    def get_pending_approvals(self, department_id):
        """
        Returns all pending participations for a specific department.
        """
        return self.get_queryset().filter(
            status='pending',
            employee__department_id=department_id
        ).select_related('employee', 'activity')


class EmployeeParticipation(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='csr_participations')
    activity = models.ForeignKey(CSRActivity, on_delete=models.CASCADE, related_name='participations')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    evidence_file = models.FileField(upload_to='csr_evidence/', null=True, blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    approved_by = models.ForeignKey(
        Employee,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='approved_participations'
    )

    objects = EmployeeParticipationManager()

    def __str__(self):
        return f"{self.employee.user.username} - {self.activity.title} ({self.status})"
