import uuid
from django.db import models
from apps.core.models import Department

class DepartmentScore(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    department = models.ForeignKey(
        Department,
        on_delete=models.CASCADE,
        related_name='scores'
    )
    environmental_score = models.DecimalField(max_digits=5, decimal_places=2)
    social_score = models.DecimalField(max_digits=5, decimal_places=2)
    governance_score = models.DecimalField(max_digits=5, decimal_places=2)
    total_score = models.DecimalField(max_digits=5, decimal_places=2)
    period_start = models.DateField()
    period_end = models.DateField()
    calculated_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-calculated_at']
        indexes = [
            models.Index(fields=['department', 'period_start', 'period_end'], name='idx_dept_score_period'),
        ]
        constraints = [
            models.CheckConstraint(
                condition=models.Q(environmental_score__range=(0, 100)),
                name='env_score_range'
            ),
            models.CheckConstraint(
                condition=models.Q(social_score__range=(0, 100)),
                name='social_score_range'
            ),
            models.CheckConstraint(
                condition=models.Q(governance_score__range=(0, 100)),
                name='gov_score_range'
            ),
            models.CheckConstraint(
                condition=models.Q(total_score__range=(0, 100)),
                name='total_score_range'
            )
        ]

    def __str__(self):
        return f"{self.department.name} ESG: {self.total_score} ({self.period_start} to {self.period_end})"
