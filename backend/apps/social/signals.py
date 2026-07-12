from django.dispatch import Signal

# Declaring custom signals

# Fired when a CSR participation is approved.
# Providing arguments: 'participation', 'employee', 'xp_awarded', 'points_awarded'
participation_approved = Signal()
