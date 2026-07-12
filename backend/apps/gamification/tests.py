import pytest
import concurrent.futures
from django.db import connection
from django.core.exceptions import ValidationError
from apps.gamification.services import GamificationService
from apps.gamification.models import RewardRedemption

@pytest.mark.django_db(transaction=True)
def test_redeem_reward_success(employee, reward):
    """Test successful redemption updates balances and stock."""
    # Setup balances
    employee.points_balance = 150
    employee.save()
    
    reward.point_cost = 100
    reward.stock = 2
    reward.save()
    
    # Act
    redemption = GamificationService.redeem_reward(employee.id, reward.id)
    
    # Assert
    employee.refresh_from_db()
    reward.refresh_from_db()
    
    assert employee.points_balance == 50
    assert reward.stock == 1
    assert redemption.points_spent == 100

@pytest.mark.django_db
def test_redeem_reward_insufficient_points(employee, reward):
    employee.points_balance = 50
    employee.save()
    reward.point_cost = 100
    reward.stock = 1
    reward.save()
    
    with pytest.raises(ValidationError, match="Insufficient points"):
        GamificationService.redeem_reward(employee.id, reward.id)

@pytest.mark.django_db
def test_redeem_reward_out_of_stock(employee, reward):
    employee.points_balance = 150
    employee.save()
    reward.point_cost = 100
    reward.stock = 0
    reward.save()
    
    with pytest.raises(ValidationError, match="out of stock"):
        GamificationService.redeem_reward(employee.id, reward.id)

@pytest.mark.django_db(transaction=True)
def test_redeem_reward_concurrency(employee, reward):
    """
    Test that concurrent requests to redeem a reward with stock=1
    only allows one to succeed.
    """
    employee.points_balance = 500
    employee.save()
    
    reward.point_cost = 100
    reward.stock = 1
    reward.save()
    
    def attempt_redemption():
        try:
            GamificationService.redeem_reward(employee.id, reward.id)
            return True
        except Exception:
            # Could be ValidationError (out of stock) or OperationalError (DB lock)
            # In SQLite tests, this will likely raise OperationalError for the locked transaction
            return False

    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
        results = list(executor.map(lambda _: attempt_redemption(), range(2)))
    
    # Close connections opened by threads
    connection.close()

    # Only one should have succeeded
    assert results.count(True) == 1
    
    reward.refresh_from_db()
    assert reward.stock == 0
    
    assert RewardRedemption.objects.count() == 1
