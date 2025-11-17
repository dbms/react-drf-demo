from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth.models import User
from ..serializers.auth_serializers import UserSerializer

class LoginView(TokenObtainPairView):
    """
    POST /api/auth/login/
    Returns:
        - access token in response body
        - refresh token in HttpOnly cookie
    """
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        refresh = response.data.get("refresh")
        access = response.data.get("access")

        # Set refresh token in HttpOnly cookie
        res = Response({"access": access})
        res.set_cookie(
            key="refresh_token",
            value=refresh,
            httponly=True,
            secure=False,  # set True in production (HTTPS)
            samesite="None",
            max_age=7 * 24 * 60 * 60,  # 7 days
        )
        return res

class CookieRefreshView(APIView):
    """
    POST /api/auth/refresh/
    Reads refresh token from HttpOnly cookie and returns new access token
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        refresh = request.COOKIES.get("refresh_token")
        if not refresh:
            return Response({"detail": "Refresh token not provided"}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            token = RefreshToken(refresh)
            access = str(token.access_token)
            return Response({"access": access})
        except Exception:
            return Response({"detail": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    """
    POST /api/auth/logout/
    Blacklists refresh token and deletes cookie
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        refresh = request.COOKIES.get("refresh_token")
        if refresh:
            try:
                token = RefreshToken(refresh)
                token.blacklist()
            except Exception:
                pass
        res = Response({"detail": "Logged out"}, status=status.HTTP_200_OK)
        res.delete_cookie("refresh_token")
        return res

class MeView(APIView):
    """
    GET /api/auth/me/
    Returns authenticated user details
    """
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
