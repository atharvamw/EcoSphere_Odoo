import uuid
from django.db import models
from apps.core.models import Employee

class ComplianceIssue(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('overdue', 'Overdue'),
        ('resolved', 'Resolved'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
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
