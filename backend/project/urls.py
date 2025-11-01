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


# drf_yasg
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# drf_yasg SchemaView
from apps.schat.apiviews import CustomObtainPairView
from project.health import health_check, simple_health_check

SchemaView = get_schema_view(
    openapi.Info(
        title="Adevi API",
        default_version="v1",
        description="Test description",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="ivan.ishchukov@gmail.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
)

def trigger_error(request):
    division_by_zero = 1 / 0

urlpatterns = [
    # Health checks
    path("health/", simple_health_check, name="health"),
    path("health/detailed/", health_check, name="health_detailed"),
    # path("oauth/", include("social_django.urls", namespace="social")),
    path("admin/", admin.site.urls),
    path(
        "api/v1/api-auth/", include("rest_framework.urls", namespace="rest_framework")
    ),
    path("api/v1/accounts/", include("apps.accounts.apiurls", namespace="apiaccounts")),
    path("api/v1/projects/", include("apps.projects.apiurls", namespace="apiprojects")),
    path("api/v1/generators/", include("apps.generators.apiurls", namespace="apielementgenerator")),
    path("api/v1/uploadapps/", include("apps.uploadapps.apiurls", namespace="apiuploadapps")),
    path("api/v1/phrases/", include("apps.phrases.apiurls", namespace="apiphrases")),
    path("api/v1/schat/", include("apps.schat.apiurls", namespace="apischat")),
    path("api/v1/activity/", include("apps.activity.apiurls", namespace="apiactivity")),
    path(
        "api/v1/virtualize_simple/",
        include("apps.virtualize_simple.apiurls", namespace="apivirtualize_simple"),
    ),
    # drf_yasg
    path(
        "api/v1/schema/",
        SchemaView.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    # djoser
    path("api/v1/djauth/", include("djoser.urls"), name="djoserauth"),
    path("api/v1/djauth/jwt/create/", CustomObtainPairView.as_view(), name='customtoken'),
    path("api/v1/djauth/", include("djoser.urls.jwt"), name="djoserauthjwt"),
    path("api/v1/djauth/", include("djoser.social.urls"), name="djosersocial"),
    # path("api/v1/convert/", include("lazysignup.urls"), name="lazysignup"),
    path("api/v1/invitations/", include("rest_invitations.urls"), name="invitations"),
    path("api/v1/subscriptions/", include("subscriptions_api.urls"), name="subscriptions"),
    path("api/v1/stripe/", include("drf_stripe.urls"), name="drfstripes"),
    path('api/v1/sentry-debug/', trigger_error),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += [path('silk/', include('silk.urls', namespace='silk'))]


if settings.ENABLE_DEBUG_TOOLBAR:
    import debug_toolbar

    urlpatterns += [path("__debug__/", include(debug_toolbar.urls))]
