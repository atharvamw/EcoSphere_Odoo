# EcoSphere ESG Platform — Testing Guide

This guide establishes the conventions and configurations for testing backend and database components.

---

## 1. Testing Framework: Pytest
We use **pytest** as the primary test runner, integrated with `pytest-django` for database fixtures and transaction support.

### Directory Structure
Testing workspace is configured at the workspace root directory:
```
EcoSphere_Odoo/
├── pytest.ini            # Pytest configuration settings
├── tests/                # Global integration test folder
│   ├── conftest.py       # Global fixtures & configurations
│   ├── test_db_connection.py  # DB verification test
│   └── integration/      # End-to-end API scenario testing
└── backend/
    └── apps/
        └── {app}/
            └── tests/    # Local app unit tests
                ├── test_models.py
                ├── test_services.py
                └── test_views.py
```

---

## 2. Testing Configuration (`pytest.ini`)
The pytest configuration at the root of `EcoSphere_Odoo/` points the runner to our Django project settings:
```ini
[pytest]
DJANGO_SETTINGS_MODULE = ecosphere.settings
pythonpath = backend
python_files = test_*.py
addopts = --cov=backend/apps --cov-report=term-missing --reuse-db
```

---

## 3. Rules & Guidelines for Writing Tests

To maintain quality and safety, every developer must follow these rules:

### 3.1 Unit Testing Rules (Models & Services)
*   **Isolate Side-Effects:** Mock external network operations (e.g. AWS S3 file uploads, emails, or ERP webhook updates) using libraries like `responses` or standard Python `unittest.mock`.
*   **Write Clean Factories:** Use `factory-boy` inside your tests to generate database models instead of raw `Model.objects.create()` statements.
*   **Atomicity Tests:** Always write tests to verify transaction rollbacks on failures (e.g. confirming that if a reward redemption fails due to out-of-stock, points are NOT deducted from the employee profile).

### 3.2 Integration Testing Rules (Views & APIs)
*   **Use Client Helpers:** Test view layers using DRF's `APIClient`.
*   **Verify Cookies:** Ensure login requests correctly set `httpOnly` secure cookies.
*   **Permissions Matrix Enforcement:** Write permissions tests verifying that non-admins get `403 Forbidden` errors when attempting to view another department's scores or edit settings.

---

## 4. How to Run Tests

Ensure you have activated the backend virtual environment first, then:

### Run the Entire Test Suite
```bash
pytest
```

### Run a Specific File
```bash
pytest tests/test_db_connection.py
```

### Run Tests inside a Specific App
```bash
pytest backend/apps/gamification/tests/
```

### Check Coverage Report
```bash
pytest --cov=backend --cov-report=html
# Open htmlcov/index.html in browser
```
Our target code coverage for business-critical modules (`scoring`, `gamification`, `environmental`) is **80% or higher**.
