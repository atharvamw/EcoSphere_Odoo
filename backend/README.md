# Backend Directory — EcoSphere ESG Platform
**Owner:** Suraj (Backend)

## Core Libraries
*   Django 5.2 LTS + Django REST Framework
*   Celery (Async queues) + Redis
*   SimpleJWT (Authentication)
*   django-guardian (Row-level permissions)

## Getting Started

1.  **Create a Virtual Environment:**
    ```bash
    python -m venv .venv
    # Windows:
    .venv\Scripts\activate
    # macOS/Linux:
    source .venv/bin/activate
    ```

2.  **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Run Development Server:**
    Ensure PostgreSQL (via Docker) is running first, then:
    ```bash
    python manage.py runserver
    ```

4.  **Run Tests:**
    ```bash
    pytest
    ```
