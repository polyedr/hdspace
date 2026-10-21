from django.contrib.auth.models import Group
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Profile, User


# every time a user is created.
# check what their roles are and assign then to the corresponding group
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
        # First cutover: grant core model permissions without email-activation step.
        try:
            group = Group.objects.get(name="CommonUsers")
            instance.groups.add(group)
        except Group.DoesNotExist:
            pass


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    if hasattr(instance, "profile"):
        instance.profile.save()
