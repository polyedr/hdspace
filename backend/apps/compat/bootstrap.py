"""Register non-DRF compatibility modules under legacy package names.

DRF-based shims live in apps.compat.* and are imported directly by app code
after Django setup, to avoid AppRegistryNotReady.
"""
import sys
import types


def _module(name, **attrs):
    module = types.ModuleType(name)
    for key, value in attrs.items():
        setattr(module, key, value)
    sys.modules[name] = module
    return module


def install():
    def bulk_update(objs, update_fields=None, batch_size=None):
        objs = list(objs)
        if not objs:
            return
        model = objs[0].__class__
        fields = update_fields or [
            f.name
            for f in model._meta.fields
            if not f.primary_key and f.name != "id"
        ]
        model.objects.bulk_update(objs, fields, batch_size=batch_size)

    helper = _module("django_bulk_update.helper", bulk_update=bulk_update)
    root = _module("django_bulk_update")
    root.helper = helper


install()
