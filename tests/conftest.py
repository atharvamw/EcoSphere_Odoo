import pytest

@pytest.fixture(scope='session')
def django_db_setup(django_db_blocker):
    """
    Custom setup for Django database tests.
    We can unblock the database block here to run migrations or seed data if needed.
    """
    with django_db_blocker.unblock():
        pass
