from django.urls import path
from .views.auth_views import LoginView, CookieRefreshView, LogoutView, MeView
from rest_framework_simplejwt.views import TokenObtainPairView


urlpatterns = [
    path("login/", LoginView.as_view(), name="token_obtain_pair"),
    path("refresh/", CookieRefreshView.as_view(), name="token_refresh_cookie"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("me/", MeView.as_view(), name="me"),
]