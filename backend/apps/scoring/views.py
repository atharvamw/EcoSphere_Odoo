from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from apps.scoring.models import DepartmentScore
from apps.scoring.serializers import DepartmentScoreSerializer

class DepartmentScoreViewSet(viewsets.ModelViewSet):
    queryset = DepartmentScore.objects.all()
    serializer_class = DepartmentScoreSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['department', 'period_start', 'period_end']
