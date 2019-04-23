"""project URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_swagger.views import get_swagger_view
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView)

schema_view = get_swagger_view(title='Adevi API')

urlpatterns = [
    path("", include("apps.projects.urls", namespace="projects")),
    path("", include("apps.virtualize.urls", namespace="virtualize")),
    path("accounts/", include("apps.accounts.urls", namespace="accounts")),
    path("payments/", include("apps.payments.urls", namespace="payments")),
    path("threads/", include("apps.threads.urls", namespace="threads")),
    path("paypal/", include("paypal.standard.ipn.urls")),
    path("oauth/", include('social_django.urls', namespace='social')),
    path('admin/', admin.site.urls),
    path('api/v1/api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path("api/v1/accounts/", include("apps.accounts.apiurls", namespace="apiaccounts")),
    # path("api/v1/projects/", include("apps.projects.apiurls", namespace="apiprojects")),
    path("api/v1/schema/", schema_view),
    path("api/v1/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/v1/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/v1/token/verify/", TokenVerifyView.as_view(), name='token_verify'),
    # path('login/', view=ObtainJWTView.as_view(), name='login'),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


if settings.ENABLE_DEBUG_TOOLBAR:
    import debug_toolbar

    urlpatterns += [
        path("__debug__/", include(debug_toolbar.urls)),
    ]
