from django.db import transaction
from django.core.exceptions import ValidationError
from apps.core.models import Employee
from .models import Reward, RewardRedemption

class GamificationService:
    @staticmethod
    @transaction.atomic
    def redeem_reward(employee_id: str, reward_id: str) -> RewardRedemption:
        """
        Redeems a reward for an employee.
        Ensures atomicity to prevent double-spending or race conditions on stock.
        """
        # Lock the employee record for update to prevent race conditions on points_balance
        employee = Employee.objects.select_for_update().get(id=employee_id)
        
        # Lock the reward record to prevent race conditions on stock
        reward = Reward.objects.select_for_update().get(id=reward_id)
        
        if reward.stock <= 0:
            raise ValidationError("This reward is out of stock.")
            
        if employee.points_balance < reward.point_cost:
            raise ValidationError("Insufficient points to redeem this reward.")
            
        # Deduct balances
        employee.points_balance -= reward.point_cost
        employee.save(update_fields=['points_balance'])
        
        reward.stock -= 1
        reward.save(update_fields=['stock'])
        
        # Create redemption record
        redemption = RewardRedemption.objects.create(
            employee=employee,
            reward=reward,
            points_spent=reward.point_cost
        )
        
        # In a real scenario, we might trigger a Django signal here (e.g. reward_redeemed)
        # to queue an email or notification to the employee.
        
        return redemption
