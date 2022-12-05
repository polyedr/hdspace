from unipath import Path
import environ


__all__ = (
    "PROJECT_DIR",
    "BASE_DIR",
    "ENV",
)

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
PROJECT_DIR = Path(__file__).parent.parent
BASE_DIR = PROJECT_DIR.parent

# Read configuration variables from .env file
ENV = environ.Env()
environ.Env.read_env(".env")
