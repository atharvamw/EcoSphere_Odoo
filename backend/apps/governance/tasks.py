from celery import shared_task
from django.utils import timezone
from .models import ComplianceIssue

@shared_task
def check_overdue_compliance_issues():
    """
    Periodic task that runs daily (via Celery Beat) to find any open ComplianceIssues
    whose due_date has passed, and marks them as 'overdue'.
    """
    today = timezone.now().date()
    
    # Find issues that are 'open' but due date was before today
    overdue_issues = ComplianceIssue.objects.filter(
        status='open',
        due_date__lt=today
    )
    
    count = overdue_issues.count()
    if count > 0:
        # Update them all in bulk
        overdue_issues.update(status='overdue')
        
        # In a real system, you might also trigger notifications here:
        # for issue in overdue_issues:
        #     send_notification.delay(issue.owner.id, f"Compliance Issue '{issue.title}' is overdue!")
        
        print(f"[Governance] Marked {count} compliance issues as overdue.")
        
    return count
