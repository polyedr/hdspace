"""Minimal replacement for rest_framework_bulk used by projects API."""
import copy
import inspect

from rest_framework import generics, serializers, status, viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.mixins import (
    CreateModelMixin,
    DestroyModelMixin,
    ListModelMixin,
    RetrieveModelMixin,
    UpdateModelMixin,
)
from rest_framework.response import Response
from rest_framework.routers import DefaultRouter, SimpleRouter


class BulkListSerializer(serializers.ListSerializer):
    update_lookup_field = "id"

    def update(self, queryset, all_validated_data):
        id_attr = getattr(self.child.Meta, "update_lookup_field", "id")

        all_validated_data_by_id = {
            item.pop(id_attr): item for item in all_validated_data
        }

        if not all(
            bool(i) and not inspect.isclass(i)
            for i in all_validated_data_by_id.keys()
        ):
            raise ValidationError("Bulk update requires object ids.")

        objects_to_update = queryset.filter(
            **{"{}__in".format(id_attr): list(all_validated_data_by_id.keys())}
        )

        if len(all_validated_data_by_id) != objects_to_update.count():
            raise ValidationError("Could not find all objects to update.")

        updated_objects = []
        for obj in objects_to_update:
            obj_id = getattr(obj, id_attr)
            obj_validated_data = all_validated_data_by_id.get(obj_id)
            updated_objects.append(self.child.update(obj, obj_validated_data))
        return updated_objects

    def create(self, validated_data):
        return [self.child.create(attrs) for attrs in validated_data]


class BulkSerializerMixin:
    def to_internal_value(self, data):
        ret = super().to_internal_value(data)

        id_attr = getattr(self.Meta, "update_lookup_field", "id")
        request_method = getattr(
            getattr(self.context.get("view"), "request", None)
            or self.context.get("request"),
            "method",
            "",
        )

        # DRF strips read-only id; put it back for bulk update matching.
        if (
            isinstance(self.root, BulkListSerializer)
            and id_attr
            and request_method in ("PUT", "PATCH")
            and id_attr in self.fields
            and isinstance(data, dict)
        ):
            id_field = self.fields[id_attr]
            ret[id_attr] = id_field.get_value(data)

        return ret


class BulkModelViewSet(
    CreateModelMixin,
    RetrieveModelMixin,
    UpdateModelMixin,
    DestroyModelMixin,
    ListModelMixin,
    viewsets.GenericViewSet,
):
    def allow_bulk_destroy(self, qs, filtered):
        return filtered

    def bulk_update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        serializer = self.get_serializer(
            self.filter_queryset(self.get_queryset()),
            data=request.data,
            many=True,
            partial=partial,
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    def partial_bulk_update(self, request, *args, **kwargs):
        kwargs["partial"] = True
        return self.bulk_update(request, *args, **kwargs)

    def bulk_destroy(self, request, *args, **kwargs):
        qs = self.filter_queryset(self.get_queryset())
        if not self.allow_bulk_destroy(self.get_queryset(), qs):
            return Response(status=400)
        qs.delete()
        return Response(status=204)

    def destroy(self, request, *args, **kwargs):
        if "ids" in request.query_params or isinstance(request.data, list):
            return self.bulk_destroy(request, *args, **kwargs)
        return super().destroy(request, *args, **kwargs)


class ListBulkCreateUpdateDestroyAPIView(generics.GenericAPIView):
    """
    Compatibility stand-in for rest_framework_bulk.ListBulkCreateUpdateDestroyAPIView.
    Supports list + bulk create/update/destroy on a single URL.
    """

    def get_serializer(self, *args, **kwargs):
        if isinstance(kwargs.get("data"), list):
            kwargs["many"] = True
        return super().get_serializer(*args, **kwargs)

    def get(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def put(self, request, *args, **kwargs):
        return self._bulk_update(request, partial=False)

    def patch(self, request, *args, **kwargs):
        return self._bulk_update(request, partial=True)

    def delete(self, request, *args, **kwargs):
        qs = self.filter_queryset(self.get_queryset())
        if isinstance(request.data, list):
            ids = [item.get("id") for item in request.data if isinstance(item, dict)]
            qs = qs.filter(pk__in=[i for i in ids if i is not None])
        elif "ids" in request.query_params:
            ids = [
                int(x)
                for x in request.query_params.get("ids", "").split(",")
                if x.isdigit()
            ]
            qs = qs.filter(pk__in=ids)
        qs.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def _bulk_update(self, request, partial=False):
        data = request.data
        if not isinstance(data, list):
            data = [data]
        serializer = self.get_serializer(
            self.filter_queryset(self.get_queryset()),
            data=data,
            many=True,
            partial=partial,
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class BulkRouter(DefaultRouter):
    """Map PUT/PATCH/DELETE on the list route to bulk actions."""

    routes = copy.deepcopy(SimpleRouter.routes)
    routes[0].mapping.update(
        {
            "put": "bulk_update",
            "patch": "partial_bulk_update",
            "delete": "bulk_destroy",
        }
    )
