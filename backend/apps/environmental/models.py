import uuid
from django.db import models
from apps.core.models import Department

class Product(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=100, unique=True)
    sku = models.CharField(max_length=100, unique=True, null=True, blank=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='active')

    def __str__(self):
        return f"{self.name} ({self.code})"


class ProductESGProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name='esg_profile')
    carbon_footprint_co2e = models.DecimalField(
        max_digits=12,
        decimal_places=4,
        default=0.0000
    )
    recycled_content_pct = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0.00
    )
    has_biodegradable_packaging = models.BooleanField(default=False)
    hazardous_materials_flag = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Product ESG Profiles"
        constraints = [
            models.CheckConstraint(
                condition=models.Q(carbon_footprint_co2e__gte=0),
                name='carbon_footprint_non_negative'
            ),
            models.CheckConstraint(
                condition=models.Q(recycled_content_pct__range=(0, 100)),
                name='recycled_content_range'
            )
        ]

    def __str__(self):
        return f"ESG Profile for {self.product.name}"


class EmissionFactor(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    source_type = models.CharField(max_length=100) # Purchase, Fleet, Mfg
    factor_value = models.DecimalField(max_digits=12, decimal_places=6)
    unit = models.CharField(max_length=50) # e.g. kg CO2e / kWh
    standard_reference = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"{self.name} ({self.factor_value} {self.unit})"


class CarbonTransaction(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    department = models.ForeignKey(
        Department,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='carbon_transactions'
    )
    emission_factor = models.ForeignKey(
        EmissionFactor,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='carbon_transactions'
    )
    quantity = models.DecimalField(max_digits=12, decimal_places=4)
    co2e_amount = models.DecimalField(max_digits=12, decimal_places=4)
    source_record_type = models.CharField(max_length=100, null=True, blank=True) # Purchase, Fleet, Manufacturing
    source_record_id = models.UUIDField(null=True, blank=True)
    is_manual_override = models.BooleanField(default=False)
    override_reason = models.TextField(null=True, blank=True)
    transaction_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['department', 'transaction_date'], name='idx_carbon_tx_dept_date'),
        ]

    def __str__(self):
        return f"Carbon Tx {self.id} - Dept {self.department.name if self.department else 'N/A'}"


class EnvironmentalGoal(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    department = models.ForeignKey(
        Department,
        on_delete=models.CASCADE,
        related_name='environmental_goals'
    )
    target_value = models.DecimalField(max_digits=12, decimal_places=4)
    current_value = models.DecimalField(max_digits=12, decimal_places=4, default=0.0000)
    unit = models.CharField(max_length=50) # e.g. kg CO2e
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='active')

    def __str__(self):
        return f"Goal: {self.title} (Target: {self.target_value})"
