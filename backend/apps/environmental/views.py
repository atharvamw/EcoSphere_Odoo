from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from apps.environmental.models import (
    Product,
    ProductESGProfile,
    EmissionFactor,
    CarbonTransaction,
    EnvironmentalGoal
)
from apps.environmental.serializers import (
    ProductSerializer,
    ProductESGProfileSerializer,
    EmissionFactorSerializer,
    CarbonTransactionSerializer,
    EnvironmentalGoalSerializer
)

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]


class ProductESGProfileViewSet(viewsets.ModelViewSet):
    queryset = ProductESGProfile.objects.all()
    serializer_class = ProductESGProfileSerializer
    permission_classes = [IsAuthenticated]


class EmissionFactorViewSet(viewsets.ModelViewSet):
    queryset = EmissionFactor.objects.all()
    serializer_class = EmissionFactorSerializer
    permission_classes = [IsAuthenticated]


class CarbonTransactionViewSet(viewsets.ModelViewSet):
    queryset = CarbonTransaction.objects.all()
    serializer_class = CarbonTransactionSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['department', 'transaction_date']


class EnvironmentalGoalViewSet(viewsets.ModelViewSet):
    queryset = EnvironmentalGoal.objects.all()
    serializer_class = EnvironmentalGoalSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['department', 'status']
