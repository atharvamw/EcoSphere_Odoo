import pytest
from django.db import connections
from django.db.utils import OperationalError

@pytest.mark.django_db
def test_database_connection():
    """
    Verifies that the Django application can connect to the database.
    Will check connections['default'].
    """
    db_conn = connections['default']
    try:
        db_conn.cursor()
        connected = True
    except OperationalError as e:
        print(f"Database connection error details: {e}")
        connected = False
    
    assert connected, "Database connection failed! Make sure your Docker container is running and .env is configured correctly."
