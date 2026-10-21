"""project URL Configuration"""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

from apps.schat.apiviews import CustomObtainPairView
from project.health import health_check, simple_health_check


def trigger_error(request):
    return 1 / 0


urlpatterns = [
    path("health/", simple_health_check, name="health"),
    path("health/detailed/", health_check, name="health_detailed"),
    path("admin/", admin.site.urls),
    path(
        "api/v1/api-auth/",
        include("rest_framework.urls", namespace="rest_framework"),
    ),
    path("api/v1/accounts/", include("apps.accounts.apiurls", namespace="apiaccounts")),
    path("api/v1/projects/", include("apps.projects.apiurls", namespace="apiprojects")),
    path(
        "api/v1/generators/",
        include("apps.generators.apiurls", namespace="apielementgenerator"),
    ),
    path(
        "api/v1/uploadapps/",
        include("apps.uploadapps.apiurls", namespace="apiuploadapps"),
    ),
    path("api/v1/phrases/", include("apps.phrases.apiurls", namespace="apiphrases")),
    path("api/v1/schat/", include("apps.schat.apiurls", namespace="apischat")),
    path("api/v1/activity/", include("apps.activity.apiurls", namespace="apiactivity")),
    path(
        "api/v1/virtualize_simple/",
        include("apps.virtualize_simple.apiurls", namespace="apivirtualize_simple"),
    ),
    path("api/v1/schema/", SpectacularSwaggerView.as_view(url_name="schema"), name="schema-swagger-ui"),
    path("api/v1/schema.yaml", SpectacularAPIView.as_view(), name="schema"),
    path("api/v1/djauth/", include("djoser.urls"), name="djoserauth"),
    path(
        "api/v1/djauth/jwt/create/",
        CustomObtainPairView.as_view(),
        name="customtoken",
    ),
    path("api/v1/djauth/", include("djoser.urls.jwt"), name="djoserauthjwt"),
    path("api/v1/sentry-debug/", trigger_error),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.ENABLE_DEBUG_TOOLBAR:
    import debug_toolbar

    urlpatterns += [path("__debug__/", include(debug_toolbar.urls))]
