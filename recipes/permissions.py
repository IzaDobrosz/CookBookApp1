from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsOwnerOrReadOnly(BasePermission):
    """
      Custom permission to only allow owners of an object to edit or delete it.
    """
    def has_object_permission(self, request, view, obj):
        # Read-only permissions are allowed for any request
        if request.method in SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the object
        return obj.user == request.user    # Only owner can delete/edit comment