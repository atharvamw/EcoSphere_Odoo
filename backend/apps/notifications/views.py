from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.notifications.models import NotificationEvent
from apps.notifications.serializers import NotificationEventSerializer

class NotificationEventViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationEventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only return notifications recipient is the logged-in employee profile
        try:
            employee = self.request.user.employee
            return NotificationEvent.objects.filter(recipient=employee)
        except AttributeError:
            return NotificationEvent.objects.none()

    @action(detail=False, methods=['get'])
    def unread(self, request):
        try:
            employee = request.user.employee
            unread_count = NotificationEvent.objects.filter(recipient=employee, is_read=False).count()
            return Response({"unread_count": unread_count}, status=status.HTTP_200_OK)
        except AttributeError:
            return Response(
                {"detail": "User is not associated with an Employee profile."},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['post'])
    def read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save(update_fields=['is_read'])
        serializer = self.get_serializer(notification)
        return Response(serializer.data, status=status.HTTP_200_OK)
