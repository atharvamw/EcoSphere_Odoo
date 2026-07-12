from rest_framework import serializers
from django.contrib.auth.models import User
from apps.core.models import Category, Department, Employee, SiteSettings

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'type', 'status']


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = [
            'id', 'name', 'code', 'head_employee',
            'parent_department', 'employee_count', 'status'
        ]


class EmployeeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    department = DepartmentSerializer(read_only=True)

    class Meta:
        model = Employee
        fields = ['id', 'user', 'department', 'xp_total', 'points_balance', 'role']


class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = [
            'id', 'auto_emission_calculation_enabled',
            'evidence_requirement_enabled', 'badge_auto_award_enabled',
            'environmental_weight', 'social_weight', 'governance_weight'
        ]
