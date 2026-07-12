import uuid
from django.db import models
from apps.core.models import Employee

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
