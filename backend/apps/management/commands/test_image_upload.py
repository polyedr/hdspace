from django.core.management.base import BaseCommand, CommandError
from apps.projects.image_test.image_test import test_image, clear_database, test_image_with_paramatter, \
    test_image_with_paramatter_range


class Command(BaseCommand):

    def add_arguments(self, parser):

        parser.add_argument('--path', type=str)
        parser.add_argument('--illustration_set_number', type=int, nargs="+")
        parser.add_argument('--image_number', type=int, nargs="+")
        parser.add_argument('--image_number_range', nargs="+")
        parser.add_argument('clear_database', nargs="?")

    def handle(self, *args, **options):
        # If looking for path to upload image, type the following
        # python manage.py test_image_upload --path "Your Path"
        if options["path"]:
            test_image(path=options["path"])
        # If looking for clear database, type the following
        # python manage.py test_image_upload clear_database
        elif options["clear_database"]:
            clear_database()
        elif options["illustration_set_number"] and options["image_number"]:
            test_image_with_paramatter(illustartion_set_number=options["illustration_set_number"][0],
                                       image_number=options["image_number"][0])
        elif options["illustration_set_number"] and options["image_number_range"]:
            range = options["image_number_range"][0][1:-1]
            range = range.split(",")
            test_image_with_paramatter_range(illustartion_set_number=options["illustration_set_number"][0],
                                             image_number_low=int(range[0]), image_number_high=int(range[1]))

        # for default path set in image_test.py, type the following
        # python manage.py test_image_upload

        else:
            test_image()
