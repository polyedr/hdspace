from django.conf import settings
from projects.models import Project


class Cart(object):
    def __init__(self, request):
        self.session = request.session
        cart = self.session.get(settings.CART_SESSION_ID)
        if not cart:
            cart = self.session[settings.CART_SESSION_ID] = []
        self.cart = cart

    def add(self, project_id):
        self.cart.append(project_id)
        self.save()

    def save(self):
        self.session[settings.CART_SESSION_ID] = self.cart

    def remove(self, project_id):
        if project_id in self.cart:
            self.cart = self.cart.remove(project_id)
            self.save()

    def get_carts(self):
        return len(self.cart)

    def pay(self):
        project_ids = self.cart
        Project.objects.filter(id__in=project_ids).update(status=Project.STATUS_PAID)

    def get_projects(self):
        return Project.objects.filter(id__in=self.cart)

    def get_total_projects(self):
        return len(self.session[settings.CART_SESSION_ID])
