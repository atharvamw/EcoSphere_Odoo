import uuid
from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

class Category(models.Model):
    TYPE_CHOICES = [
        ('CSR Activity', 'CSR Activity'),
        ('Challenge', 'Challenge'),
    ]
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=100, choices=TYPE_CHOICES)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='active')

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return f"{self.name} ({self.type})"


class Department(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50, unique=True)
    head_employee = models.ForeignKey(
        'Employee',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='headed_departments'
    )
    parent_department = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='sub_departments'
    )
    employee_count = models.IntegerField(default=0)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='active')

    def __str__(self):
        return f"{self.name} ({self.code})"


class EmployeeManager(models.Manager):
    def get_leaderboard_ranking(self):
        """
        Returns employees ordered by their XP total in descending order.
        """
        return self.get_queryset().select_related('department', 'user').order_by('-xp_total')


class Employee(models.Model):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('esg_manager', 'ESG Manager'),
        ('dept_head', 'Department Head'),
        ('employee', 'Employee'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='employee')
    department = models.ForeignKey(
        Department,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='employees'
    )
    xp_total = models.PositiveIntegerField(default=0)
    points_balance = models.PositiveIntegerField(default=0)
    role = models.CharField(max_length=100, choices=ROLE_CHOICES, default='employee')

    objects = EmployeeManager()

    class Meta:
        constraints = [
            models.CheckConstraint(condition=models.Q(xp_total__gte=0), name='xp_must_be_positive'),
            models.CheckConstraint(condition=models.Q(points_balance__gte=0), name='points_must_be_positive')
        ]

    def __str__(self):
        return self.user.username


class SiteSettings(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    auto_emission_calculation_enabled = models.BooleanField(default=True)
    evidence_requirement_enabled = models.BooleanField(default=True)
    badge_auto_award_enabled = models.BooleanField(default=True)
    
    # Weight fields matching PostgreSQL DECIMAL(5, 4)
    environmental_weight = models.DecimalField(max_digits=5, decimal_places=4, default=0.4000)
    social_weight = models.DecimalField(max_digits=5, decimal_places=4, default=0.3000)
    governance_weight = models.DecimalField(max_digits=5, decimal_places=4, default=0.3000)

    @property
    def weight_environmental(self):
        return float(self.environmental_weight) if self.environmental_weight is not None else 0.0

    @weight_environmental.setter
    def weight_environmental(self, value):
        self.environmental_weight = value

    @property
    def weight_social(self):
        return float(self.social_weight) if self.social_weight is not None else 0.0

    @weight_social.setter
    def weight_social(self, value):
        self.social_weight = value

    @property
    def weight_governance(self):
        return float(self.governance_weight) if self.governance_weight is not None else 0.0

    @weight_governance.setter
    def weight_governance(self, value):
        self.governance_weight = value

    class Meta:
        verbose_name_plural = "Site Settings"
        constraints = [
            models.CheckConstraint(
                condition=models.Q(
                    environmental_weight=models.F('environmental_weight')
                ),
                name='dummy_constraint_for_schema'
            )
        ]

    def clean(self):
        total_weight = self.environmental_weight + self.social_weight + self.governance_weight
        if total_weight != 1.0:
            raise ValidationError("The sum of environmental, social, and governance weights must equal 1.0.")

    def save(self, *args, **kwargs):
        self.clean()
        # Enforce singleton pattern (id is fixed to a static UUID)
        self.id = uuid.UUID('00000000-0000-0000-0000-000000000001')
        super().save(*args, **kwargs)

    @classmethod
    def get_settings(cls):
        obj, created = cls.objects.get_or_create(
            id=uuid.UUID('00000000-0000-0000-0000-000000000001'),
            defaults={
                'environmental_weight': 0.4000,
                'social_weight': 0.3000,
                'governance_weight': 0.3000,
            }
        )
        return obj
