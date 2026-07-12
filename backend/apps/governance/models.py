import uuid
from django.db import models
from apps.core.models import Employee, Department

class ESGPolicy(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('retired', 'Retired'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    content = models.TextField()
    version = models.CharField(max_length=50)
    effective_date = models.DateField()
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='draft')

    class Meta:
        verbose_name_plural = "ESG Policies"

    def __str__(self):
        return f"{self.title} (v{self.version})"


class PolicyAcknowledgement(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    policy = models.ForeignKey(ESGPolicy, on_delete=models.CASCADE, related_name='acknowledgements')
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='policy_acknowledgements')
    acknowledged_at = models.DateTimeField(auto_now_add=True)
    signature = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['policy', 'employee'],
                name='unique_policy_employee_acknowledgement'
            )
        ]

    def __str__(self):
        return f"{self.employee.user.username} acknowledged {self.policy.title}"


class Audit(models.Model):
    STATUS_CHOICES = [
        ('planned', 'Planned'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    department = models.ForeignKey(
        Department,
        on_delete=models.CASCADE,
        related_name='audits'
    )
    title = models.CharField(max_length=255)
    audit_type = models.CharField(max_length=100) # Internal, External, etc.
    audit_date = models.DateField()
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='planned')
    auditor = models.ForeignKey(
        Employee,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='conducted_audits'
    )
    findings = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"Audit {self.title} - Dept {self.department.name}"


class ComplianceIssue(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('overdue', 'Overdue'),
        ('resolved', 'Resolved'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    audit = models.ForeignKey(
        Audit,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='compliance_issues'
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    due_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')

    # Issue 9 in Critical Business Rules: "Compliance issues — must have Owner + Due Date at creation"
    owner = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='compliance_issues')

    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.title} ({self.status})"
