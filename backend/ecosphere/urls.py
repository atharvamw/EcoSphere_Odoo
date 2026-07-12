from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # OpenAPI Schema generation and interactive documentation (Swagger & Redoc)
    path('api/v1/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/v1/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/v1/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    # Modular apps routing (URLs will be filled with endpoints in subsequent features)
    path('api/v1/core/', include('apps.core.urls')),
    path('api/v1/environmental/', include('apps.environmental.urls')),
    path('api/v1/social/', include('apps.social.urls')),
    path('api/v1/governance/', include('apps.governance.urls')),
    path('api/v1/gamification/', include('apps.gamification.urls')),
    path('api/v1/scoring/', include('apps.scoring.urls')),
    path('api/v1/notifications/', include('apps.notifications.urls')),
    path('api/v1/reports/', include('apps.reports.urls')),
]
