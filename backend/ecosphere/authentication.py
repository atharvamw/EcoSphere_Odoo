from rest_framework_simplejwt.authentication import JWTAuthentication

class CookieJWTAuthentication(JWTAuthentication):
    """
    Custom JWT Authentication class that checks for the access token 
    first in HTTP Authorization headers, and then falls back to a cookie 
    named 'access_token' for browser clients.
    """
    def authenticate(self, request):
        header = self.get_header(request)
        if header is not None:
            raw_token = self.get_raw_token(header)
        else:
            raw_token = request.COOKIES.get('access_token')

        if raw_token is None:
            return None

        try:
            validated_token = self.get_validated_token(raw_token)
            return self.get_user(validated_token), validated_token
        except Exception:
            # Token validation failed
            return None
