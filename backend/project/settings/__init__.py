from .base import *
import os

print("basedir", BASE_DIR)

if os.environ.get("ENV_NAME") == 'Staging':
    from .staging import *
