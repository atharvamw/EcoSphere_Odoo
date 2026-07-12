import pytest
import factory
from django.contrib.auth.models import User
from apps.core.models import Employee, Department, SiteSettings
from apps.gamification.models import Reward

class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User
    
    username = factory.Sequence(lambda n: f'user{n}')
    email = factory.Sequence(lambda n: f'user{n}@example.com')

class DepartmentFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Department
        
    name = factory.Sequence(lambda n: f'Department {n}')

class EmployeeFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Employee
        
    user = factory.SubFactory(UserFactory)
    department = factory.SubFactory(DepartmentFactory)
    xp_total = 0
    points_balance = 0

class RewardFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Reward
        
    name = factory.Sequence(lambda n: f'Reward {n}')
    description = "Test reward"
    point_cost = 100
    stock = 10

class SiteSettingsFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = SiteSettings
        django_get_or_create = ('id',)
        
    id = 1
    weight_environmental = 0.40
    weight_social = 0.30
    weight_governance = 0.30

@pytest.fixture
def employee():
    return EmployeeFactory()

@pytest.fixture
def reward():
    return RewardFactory()
