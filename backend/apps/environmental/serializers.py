from rest_framework import serializers
from apps.environmental.models import (
    Product,
    ProductESGProfile,
    EmissionFactor,
    CarbonTransaction,
    EnvironmentalGoal
)

class ProductESGProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductESGProfile
        fields = [
            'id', 'product', 'carbon_footprint_co2e', 'recycled_content_pct',
            'has_biodegradable_packaging', 'hazardous_materials_flag',
            'created_at', 'updated_at'
        ]


class ProductSerializer(serializers.ModelSerializer):
    esg_profile = ProductESGProfileSerializer(read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'code', 'sku', 'status', 'esg_profile']


class EmissionFactorSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmissionFactor
        fields = ['id', 'name', 'source_type', 'factor_value', 'unit', 'standard_reference']


class CarbonTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarbonTransaction
        fields = [
            'id', 'department', 'emission_factor', 'quantity', 'co2e_amount',
            'source_record_type', 'source_record_id', 'is_manual_override',
            'override_reason', 'transaction_date', 'created_at'
        ]

    def create(self, validated_data):
        # Auto-compute co2e_amount if not manual override and not specified
        if not validated_data.get('is_manual_override', False):
            factor = validated_data.get('emission_factor')
            quantity = validated_data.get('quantity', 0)
            if factor:
                validated_data['co2e_amount'] = quantity * factor.factor_value
        return super().create(validated_data)


class EnvironmentalGoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnvironmentalGoal
        fields = [
            'id', 'title', 'department', 'target_value', 'current_value',
            'unit', 'start_date', 'end_date', 'status'
        ]
