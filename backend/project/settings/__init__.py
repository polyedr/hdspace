from .base import *  # noqa: F401,F403
import os

print("basedir", BASE_DIR)

if os.environ.get("ENV_NAME") == "Staging":
    SITE_NAME = "app-staging.adevi.io"
    DOMAIN = "app-staging.adevi.io"
    DJOSER = {
        **DJOSER,
        "DOMAIN": DOMAIN,
    }
