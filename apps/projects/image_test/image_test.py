import glob
from apps.accounts.tests.accounts_factory import UserFactory
from apps.projects.tests.projects_factory import ProjectFactory, ProjectIllustrationSetFactory, ProjectImageFactory
from apps.projects.models import Project, ProjectIllustrationSet, ProjectImage
from django.core.files.base import ContentFile
from io import BytesIO
from PIL import Image
import random


def test_image(path="C:/Users/Nelly li/Desktop/image/*"):
    user = UserFactory.create()
    project = ProjectFactory.create(user=user)
    project_illutration_set = ProjectIllustrationSetFactory.create(project=project)

    all_image = glob.glob(path)
    for i in range(len(all_image)):
        image = Image.open(all_image[i])
        buf = BytesIO()
        image.save(buf, 'jpeg')
        buf.seek(0)
        image = buf.read()
        buf.close()
        ProjectImageFactory.create(illustration_set=project_illutration_set,
                                   image=ContentFile(image, "example.jpg"))


def clear_database():
    # delete individual instances
    # user.delete()
    # project.delete()
    # project_illutration_set.delete()
    # project_image.delete()

    # delete all instances within model
    Project.objects.all().delete()
    ProjectIllustrationSet.objects.all().delete()
    ProjectImage.objects.all().delete()


def test_image_with_paramatter(illustartion_set_number=5, image_number=9):
    user = UserFactory.create()
    project = ProjectFactory.create(user=user)
    for i in range(illustartion_set_number):
        print("----------------------------------------------------")
        project_illutration_set = ProjectIllustrationSetFactory.create(project=project)
        print(f"Project illustration set id: {project_illutration_set.id}, name: {project_illutration_set.name}")
        for i in range(image_number):
            project_image = ProjectImageFactory.create(illustration_set=project_illutration_set)
            print(f"Project illustration set id: {project_image.id}, name: {project_image.image}")


def test_image_with_paramatter_range(illustartion_set_number=5, image_number_low=5, image_number_high=9):
    user = UserFactory.create()
    project = ProjectFactory.create(user=user)
    for i in range(illustartion_set_number):
        print("----------------------------------------------------")
        project_illutration_set = ProjectIllustrationSetFactory.create(project=project)
        print(f"Project illustration set id: {project_illutration_set.id}, name: {project_illutration_set.name}")
        image_number = random.randint(image_number_low, image_number_high + 1)
        for i in range(image_number):
            project_image = ProjectImageFactory.create(illustration_set=project_illutration_set)
            print(f"Project illustration set id: {project_image.id}, name: {project_image.image}")
