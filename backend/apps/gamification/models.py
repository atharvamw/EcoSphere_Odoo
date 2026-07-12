import uuid
from django.db import models
from apps.core.models import Employee, Department, Category

class RewardManager(models.Manager):
    def get_available_rewards(self, user_points):
        """
        Returns rewards that are in stock and affordable for the given user points.
        """
        return self.get_queryset().filter(stock__gt=0, point_cost__lte=user_points).order_by('point_cost')


class Reward(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField()
    point_cost = models.PositiveIntegerField()
    stock = models.PositiveIntegerField(default=0)

    objects = RewardManager()

    class Meta:
        constraints = [
            models.CheckConstraint(condition=models.Q(stock__gte=0), name='reward_stock_must_be_positive'),
            models.CheckConstraint(condition=models.Q(point_cost__gte=0), name='reward_cost_must_be_positive')
        ]

    def __str__(self):
        return f"{self.name} ({self.point_cost} pts)"


class RewardRedemption(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='redemptions')
    reward = models.ForeignKey(Reward, on_delete=models.PROTECT, related_name='redemptions')
    redeemed_at = models.DateTimeField(auto_now_add=True)
    points_spent = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.employee.user.username} redeemed {self.reward.name}"


class GoalDefinition(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    source_model = models.CharField(max_length=100) # e.g. CarbonTransaction, EmployeeParticipation
    source_field = models.CharField(max_length=100) # e.g. co2e_amount, status
    computation = models.CharField(max_length=100) # SUM, COUNT, AVERAGE
    scope = models.CharField(max_length=50) # Individual, Departmental
    suffix = models.CharField(max_length=50, null=True, blank=True) # e.g. kg CO2e, participations

    def __str__(self):
        return f"{self.name} ({self.scope} - {self.computation})"


class Challenge(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('archived', 'Archived'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='challenges'
    )
    department = models.ForeignKey(
        Department,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='challenges'
    )
    description = models.TextField()
    xp = models.PositiveIntegerField(default=0)
    difficulty = models.CharField(max_length=50) # Easy, Medium, Hard
    periodicity = models.CharField(max_length=50) # One-time, Weekly, Monthly
    assignment_rule = models.CharField(max_length=255, null=True, blank=True)
    evidence_required = models.BooleanField(default=False)
    start_date = models.DateField()
    deadline = models.DateField()
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='active')

    def __str__(self):
        return self.title


class Goal(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    goal_definition = models.ForeignKey(
        GoalDefinition,
        on_delete=models.CASCADE,
        related_name='goals'
    )
    challenge = models.ForeignKey(
        Challenge,
        on_delete=models.CASCADE,
        related_name='goals'
    )
    condition = models.CharField(max_length=50) # >=, <=, ==
    target_value = models.DecimalField(max_digits=12, decimal_places=4)
    current_value = models.DecimalField(max_digits=12, decimal_places=4, default=0.0000)

    def __str__(self):
        return f"Goal on {self.goal_definition.name} {self.condition} {self.target_value}"


class ChallengeParticipation(models.Model):
    APPROVAL_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    challenge = models.ForeignKey(
        Challenge,
        on_delete=models.CASCADE,
        related_name='participations'
    )
    employee = models.ForeignKey(
        Employee,
        on_delete=models.CASCADE,
        related_name='challenge_participations'
    )
    progress = models.DecimalField(max_digits=5, decimal_places=2, default=0.00) # percentage 0-100
    proof_file_path = models.CharField(max_length=255, null=True, blank=True)
    approval_status = models.CharField(
        max_length=50,
        choices=APPROVAL_STATUS_CHOICES,
        default='pending'
    )
    approved_by = models.ForeignKey(
        Employee,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='approved_challenges'
    )
    xp_awarded = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='active')

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['challenge', 'employee'],
                name='unique_challenge_employee_participation'
            )
        ]

    def __str__(self):
        return f"{self.employee.user.username} in {self.challenge.title} ({self.status})"


class Badge(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField()
    unlock_rule_type = models.CharField(max_length=100) # XP_TOTAL, CSR_COUNT, EMISSION_REDUCTION
    unlock_goal_definition = models.ForeignKey(
        GoalDefinition,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='badges'
    )
    unlock_threshold = models.DecimalField(max_digits=12, decimal_places=4)
    grant_permission = models.CharField(max_length=100, null=True, blank=True)
    limitation_number = models.IntegerField(null=True, blank=True)
    icon_path = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.name


class EmployeeBadge(models.Model):
    AWARD_TYPE_CHOICES = [
        ('auto', 'Auto'),
        ('manual', 'Manual'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.ForeignKey(
        Employee,
        on_delete=models.CASCADE,
        related_name='badges'
    )
    badge = models.ForeignKey(
        Badge,
        on_delete=models.CASCADE,
        related_name='employee_badges'
    )
    awarded_at = models.DateTimeField(auto_now_add=True)
    granted_by = models.ForeignKey(
        Employee,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='granted_badges'
    )
    award_type = models.CharField(
        max_length=50,
        choices=AWARD_TYPE_CHOICES,
        default='auto'
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['employee', 'badge'],
                name='unique_employee_badge'
            )
        ]

    def __str__(self):
        return f"{self.employee.user.username} - {self.badge.name}"
