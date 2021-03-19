from django.core.management.base import BaseCommand
from apps.projects.element_restore.element_restore import restore_element, clear_database


class Command(BaseCommand):
    def add_arguments(self, parser):

        parser.add_argument('clear_database', nargs="?")
        parser.add_argument('--path', type=str)

    def handle(self, *args, **options):
        # If looking for path to restore eleemnt, type the following
        # python manage.py test_element_restore --path "Your Path"

        if options['path']:
            restore_element(path=options['path'])
        # If looking for clear database, type the following
        # python manage.py test_element_restore clear_database

        elif options['clear_database']:
            clear_database()
        # for default path set in element_restore.py, type the following
        # python manage.py test_element_restore

        else:
            restore_element()
