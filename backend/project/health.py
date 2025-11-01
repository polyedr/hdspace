"""
Health check view for monitoring and Docker healthcheck
"""
from django.http import JsonResponse
from django.db import connection
from django.core.cache import cache
import redis
from django.conf import settings


def health_check(request):
    """
    Simple health check endpoint
    Returns 200 OK if everything is working
    """
    status = {
        "status": "ok",
        "database": "unknown",
        "redis": "unknown",
    }
    
    http_status = 200
    
    # Check database connection
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        status["database"] = "connected"
    except Exception as e:
        status["database"] = f"error: {str(e)}"
        http_status = 503
    
    # Check Redis connection
    try:
        cache.set("health_check", "ok", 10)
        if cache.get("health_check") == "ok":
            status["redis"] = "connected"
        else:
            status["redis"] = "error: cache test failed"
            http_status = 503
    except Exception as e:
        status["redis"] = f"error: {str(e)}"
        http_status = 503
    
    return JsonResponse(status, status=http_status)


def simple_health_check(request):
    """
    Simple health check that just returns OK
    For basic Docker healthcheck
    """
    return JsonResponse({"status": "ok"})

