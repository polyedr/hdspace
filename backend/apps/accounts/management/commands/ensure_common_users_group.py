"""Ensure CommonUsers group exists with core model permissions."""
from django.contrib.auth.models import Group, Permission
from django.core.management.base import BaseCommand


CORE_CODAMES = (
    "view_project",
    "add_project",
    "change_project",
    "delete_project",
    "view_projectscreen",
    "add_projectscreen",
    "change_projectscreen",
    "delete_projectscreen",
    "view_screenscenario",
    "add_screenscenario",
    "change_screenscenario",
    "delete_screenscenario",
    "view_scenarioelement",
    "add_scenarioelement",
    "change_scenarioelement",
    "delete_scenarioelement",
)


class Command(BaseCommand):
    help = "Create CommonUsers group and attach core project permissions"

    def handle(self, *args, **options):
        group, _ = Group.objects.get_or_create(name="CommonUsers")
        perms = Permission.objects.filter(codename__in=CORE_CODAMES)
        group.permissions.set(perms)
        self.stdout.write(
            self.style.SUCCESS(
                f"CommonUsers ready with {group.permissions.count()} permissions"
            )
        )
