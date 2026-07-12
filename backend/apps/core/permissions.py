from rest_framework.permissions import BasePermission

class CannotSelfApprove(BasePermission):
    """No employee can approve their own CSR or Challenge participation."""
    
    def has_object_permission(self, request, view, obj):
        # We only check this rule for approval or rejection actions
        if getattr(view, 'action', None) in ('approve', 'reject'):
            
            # Check if the user has an associated employee profile
            if hasattr(request.user, 'employee') and hasattr(obj, 'employee'):
                # Ensure the approver is not the participant themselves
                return request.user.employee != obj.employee
                
        # For other actions or if we can't determine the employee, default to True 
        # (and let other permission classes handle access control)
        return True

class CannotExceedBadgeLimit(BasePermission):
    """Manual badge grants respect the Badge's limitation_number per period."""
    
    def has_object_permission(self, request, view, obj):
        # Placeholder for actual logic, which would require checking the 
        # employee's granted badges in the current period vs the badge's limitation_number.
        return True
