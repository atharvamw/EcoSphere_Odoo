from django.conf import settings
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

def set_jwt_cookies(response, access_token, refresh_token=None):
    cookie_settings = {
        'httponly': settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
        'samesite': settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
        'secure': settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
        'path': settings.SIMPLE_JWT['AUTH_COOKIE_PATH'],
        'domain': settings.SIMPLE_JWT['AUTH_COOKIE_DOMAIN'],
    }
    
    response.set_cookie(
        key=settings.SIMPLE_JWT['AUTH_COOKIE'],
        value=access_token,
        max_age=int(settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds()),
        **cookie_settings
    )
    
    if refresh_token:
        response.set_cookie(
            key=settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
            value=refresh_token,
            max_age=int(settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds()),
            **cookie_settings
        )

class CookieTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            access_token = response.data.get('access')
            refresh_token = response.data.get('refresh')
            set_jwt_cookies(response, access_token, refresh_token)
        return response

class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        # The default TokenRefreshView expects the refresh token in the request body.
        # We need to copy it from the cookie if it's not in the body.
        mutable_data = request.data.copy() if hasattr(request.data, 'copy') else request.data
        if 'refresh' not in mutable_data:
            mutable_data['refresh'] = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
            
        # We need to temporarily set request._full_data or similar because request.data is immutable in DRF,
        # but creating a new request object or passing it differently might be complex.
        # The easiest way is to modify the request POST dictionary if it's a standard request,
        # or just let the serializer handle the mutable_data.
        # Actually, DRF's TokenRefreshView instantiates the serializer with data=request.data.
        # We can override the view to pass our mutable_data.
        
        serializer = self.get_serializer(data=mutable_data)
        try:
            serializer.is_valid(raise_exception=True)
        except Exception:
            return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)
            
        response = Response(serializer.validated_data, status=status.HTTP_200_OK)
        
        if response.status_code == 200:
            access_token = response.data.get('access')
            refresh_token = response.data.get('refresh')
            set_jwt_cookies(response, access_token, refresh_token)
        return response
        
class LogoutView(APIView):
    def post(self, request, *args, **kwargs):
        response = Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)
        cookie_settings = {
            'httponly': settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
            'samesite': settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
            'secure': settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
            'path': settings.SIMPLE_JWT['AUTH_COOKIE_PATH'],
            'domain': settings.SIMPLE_JWT['AUTH_COOKIE_DOMAIN'],
        }
        response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE'], **cookie_settings)
        response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'], **cookie_settings)
        return response
