"""
Django settings for HDSpace (Django 5.2 controlled big bang).
"""

import os
from datetime import timedelta

import sentry_sdk
from celery.schedules import crontab
from sentry_sdk.integrations.django import DjangoIntegration

from .base_old import *  # noqa: F401,F403

# Non-DRF legacy shims (django_bulk_update). DRF shims are imported in-app.
import apps.compat.bootstrap  # noqa: F401
from apps.compat.schat import schat_client  # noqa: F401

SECRET_KEY = ENV.str("SECRET_KEY", "Keep it secret!")
SILENCED_SYSTEM_CHECKS = ["auth.W004"]

DEBUG = ENV.bool("DEBUG", True)
ENABLE_DEBUG_TOOLBAR = DEBUG and ENV.bool("ENABLE_DEBUG_TOOLBAR", False)

ALLOWED_HOSTS = ENV.list("ALLOWED_HOSTS", default=["localhost", "127.0.0.1", "0.0.0.0"])
INTERNAL_IPS = ENV.list("INTERNAL_IPS", default=["127.0.0.1"])

DEFAULT_AUTO_FIELD = "django.db.models.AutoField"

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.sites",
    "rest_framework",
    "rest_framework.authtoken",
    "djoser",
    "drf_spectacular",
    "corsheaders",
    "simple_history",
    "anymail",
    "guardian",
    "django_filters",
    "taggit",
    "model_clone",
    "sesame",
]

EXTERNAL_APPS = []  # social auth disabled in first cutover

PROJECT_APPS = [
    "apps.utils",
    "apps.accounts",
    "apps.projects",
    "apps.uploadapps",
    "apps.phrases",
    "apps.generators",
    "apps.virtualize_emulation",
    "apps.virtualize_simple",
    "apps.schat",
    "apps.activity",
]

INSTALLED_APPS.extend(EXTERNAL_APPS + PROJECT_APPS)

SITE_ID = 1

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "sesame.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "simple_history.middleware.HistoryRequestMiddleware",
]

SESAME_TOKEN_NAME = "adevi"
SESAME_ONE_TIME = False

CORS_ALLOW_ALL_ORIGINS = True

REST_FRAMEWORK = {
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.CursorPagination",
    "PAGE_SIZE": 100,
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",
    ],
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",
        "rest_framework.authentication.BasicAuthentication",
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.TokenAuthentication",
    ],
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
}

if ENABLE_DEBUG_TOOLBAR:
    INSTALLED_APPS.append("debug_toolbar")
    MIDDLEWARE.append("debug_toolbar.middleware.DebugToolbarMiddleware")
    DEBUG_TOOLBAR_CONFIG = {
        "RESULTS_CACHE_SIZE": 50,
        "SHOW_TOOLBAR_CALLBACK": lambda request: DEBUG,
    }

ROOT_URLCONF = "project.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [PROJECT_DIR.child("templates")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ]
        },
    }
]

WSGI_APPLICATION = "project.wsgi.application"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("DB_NAME", "adevi_db"),
        "USER": os.getenv("DB_USER", "adevi_user"),
        "PASSWORD": os.getenv("DB_PASSWORD"),
        "HOST": os.getenv("DB_HOST", "127.0.0.1"),
        "PORT": os.getenv("DB_PORT", "5432"),
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

AUTH_USER_MODEL = "accounts.User"

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

STATIC_URL = "/static/"
STATICFILES_DIRS = [BASE_DIR.child("static")]
STATIC_ROOT = BASE_DIR.child("collectstatic")
STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}

MEDIA_ROOT = BASE_DIR.child("media")
MEDIA_URL = "/media/"

REDIS_URL = "redis://{REDIS_HOST}:{REDIS_PORT}/{REDIS_PATH}".format(
    REDIS_HOST=ENV.str("REDIS_HOST", "127.0.0.1"),
    REDIS_PORT=ENV.str("REDIS_PORT", "6379"),
    REDIS_PATH="0",
)

CELERY_BROKER_URL = REDIS_URL
CELERY_RESULT_BACKEND = REDIS_URL
CELERY_BEAT_SCHEDULE = {}

EMAIL_BASE_TEMPLATE = "email/base.html"
DOWNLOAD_BASE_TEMPLATE = "base_download.html"
EMAIL_HOST = ENV.str("EMAIL_HOST", "localhost")
EMAIL_PORT = ENV.int("EMAIL_PORT", 1025)
EMAIL_BACKEND = ENV.str(
    "EMAIL_BACKEND", "django.core.mail.backends.console.EmailBackend"
)
DEFAULT_FROM_EMAIL = ENV.str("DEFAULT_FROM_EMAIL", "noreply@adevi.local")

ANYMAIL = {}

SITE_NAME = ENV.str("SITE_NAME", "localhost")
BASE_URL = ENV.str("BASE_URL", "http://localhost:18000")
LOGIN_REDIRECT_URL = "/"
DOMAIN = ENV.str("DOMAIN", "localhost")
STAGING_URL = ENV.str("STAGING_URL", BASE_URL)

AUTHENTICATION_BACKENDS = (
    "guardian.backends.ObjectPermissionBackend",
    "django.contrib.auth.backends.ModelBackend",
    "sesame.backends.ModelBackend",
)

CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "default-cache",
    }
}

USER_ONLINE_TIMEOUT = 180
USER_LASTSEEN_TIMEOUT = 60 * 60 * 24 * 7

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=12),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "ROTATE_REFRESH_TOKENS": False,
    "BLACKLIST_AFTER_ROTATION": False,
    "ALGORITHM": "HS256",
    "SIGNING_KEY": SECRET_KEY,
    "AUTH_HEADER_TYPES": ("Bearer",),
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
}

white_list = [
    "http://localhost:8080/projects",
]

STREAM_API_KEY = ENV.str("STREAM_API_KEY", "")
STREAM_API_SECRET = ENV.str("STREAM_API_SECRET", "")

DJOSER = {
    "USERNAME_CHANGED_EMAIL_CONFIRMATION": False,
    "PASSWORD_CHANGED_EMAIL_CONFIRMATION": False,
    "PASSWORD_RESET_CONFIRM_URL": "password/reset/confirm/{uid}/{token}",
    "USERNAME_RESET_CONFIRM_URL": "username/reset/confirm/{uid}/{token}",
    "DOMAIN": DOMAIN,
    "ACTIVATION_URL": "activate/{uid}/{token}",
    "SEND_ACTIVATION_EMAIL": False,
    "SERIALIZERS": {
        "activation": "apps.accounts.serializers.MyActivationSerializer",
    },
    "SOCIAL_AUTH_ALLOWED_REDIRECT_URIS": white_list,
}

SPECTACULAR_SETTINGS = {
    "TITLE": "HDSpace / Adevi API",
    "DESCRIPTION": "Core editor API after controlled big bang",
    "VERSION": "2.0.0",
}

SENTRY_DSN = ENV.str("SENTRY_DSN", default="")
if SENTRY_DSN:
    sentry_sdk.init(
        dsn=SENTRY_DSN,
        integrations=[DjangoIntegration()],
        traces_sample_rate=0.1,
        send_default_pii=False,
    )
