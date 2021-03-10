import os
import glob
from apps.accounts.tests.accounts_factory import UserFactory
from apps.projects.tests.projects_factory import ProjectFactory, ProjectIllustrationSetFactory, ProjectImageFactory
from apps.projects.models import Project, ProjectIllustrationSet, ProjectImage
from django.core.files.base import ContentFile
from io import BytesIO
from PIL import Image

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project.settings")
user = UserFactory.create()
project = ProjectFactory.create(user=user)
project_illutration_set = ProjectIllustrationSetFactory.create(project=project)
path = "C:/Users/Nelly li/Desktop/image/*"
all_image = glob.glob(path)
for i in range(len(all_image)):
    image = Image.open(all_image[i])
    buf = BytesIO()
    image.save(buf, 'jpeg')
    buf.seek(0)
    image = buf.read()
    buf.close()
    project_image = ProjectImageFactory.create(illustration_set=project_illutration_set,
                                               image=ContentFile(image, "example.jpg"))

# delete individual instances
# user.delete()
# project.delete()
# project_illutration_set.delete()
# project_image.delete()

# delete all instances within model
# Project.objects.all().delete()
# ProjectIllustrationSet.objects.all().delete()
# ProjectImage.objects.all().delete()
