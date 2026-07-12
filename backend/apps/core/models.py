import uuid
from django.db import models
from django.contrib.auth.models import User

class Department(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    parent_department = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='sub_departments')
    
    def __str__(self):
        return self.name

class EmployeeManager(models.Manager):
    def get_leaderboard_ranking(self):
        """
        Returns employees ordered by their XP total in descending order.
        This wraps the relational query to fetch leaderboard ranks.
        """
        return self.get_queryset().select_related('department', 'user').order_by('-xp_total')

class Employee(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='employee')
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, related_name='employees')
    
    # Currency fields with DB constraints
    xp_total = models.PositiveIntegerField(default=0)
    points_balance = models.PositiveIntegerField(default=0)
    
    objects = EmployeeManager()
    
    class Meta:
        constraints = [
            models.CheckConstraint(condition=models.Q(xp_total__gte=0), name='xp_must_be_positive'),
            models.CheckConstraint(condition=models.Q(points_balance__gte=0), name='points_must_be_positive')
        ]
        
    def __str__(self):
        return self.user.username
