import os
# your imports, e.g. Django models
from apps.accounts.tests.accounts_factory import UserFactory
from apps.projects.tests.projects_factory import ProjectFactory, ProjectIllustrationSetFactory, ProjectImageFactory
from apps.projects.models import Project, ProjectIllustrationSet, ProjectImage

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project.settings")


user = UserFactory.create()
project = ProjectFactory.create(user=user)
project_illutration_set = ProjectIllustrationSetFactory.create(project=project)
desktop = os.path.join(os.path.join(os.environ['USERPROFILE']), 'Desktop')
file_path = desktop + "\image\AxOPDhGenf0.jpg"
project_image = ProjectImageFactory.create(illustration_set=project_illutration_set, image=file_path)

# delete individual instances
# user.delete()
# project.delete()
# project_illutration_set.delete()
# project_image.delete()

# delete all instances within model
# Project.objects.all().delete()
# ProjectIllustrationSet.objects.all().delete()
ProjectImage.objects.all().delete()
# project_image = ProjectImageFactory.create(project_illutration_set = project_illutration_set, image = )
