# EcoSphere ESG Platform — API & Backend Documentation

This document serves as the guide for the REST API structure, authentication flows, roles, and the service-layer implementation guidelines.

---

## 1. Authentication & Session Flow
EcoSphere uses **SimpleJWT (JSON Web Token)** for stateless user authentication.
*   **Tokens:** Access Token (expires in 15 minutes), Refresh Token (expires in 7 days).
*   **Cookie Security:** To mitigate Cross-Site Scripting (XSS) risks, tokens are not returned in the JSON payload. Instead, they are set as `httpOnly`, `Secure`, and `SameSite=Strict` cookies by the Django server during the `/api/v1/auth/login/` flow.
*   **Django CSRF protection:** Enabled on state-modifying requests (POST, PUT, PATCH, DELETE) via standard cookie/headers validation.

### Auth Endpoints
*   `POST /api/v1/auth/login/` — Validates credentials, sets JWT cookies.
*   `POST /api/v1/auth/logout/` — Clears JWT cookies, blacklists refresh token.
*   `POST /api/v1/auth/refresh/` — Reads refresh cookie, issues new access token cookie.
*   `GET /api/v1/auth/me/` — Returns the current authenticated employee details.

---

## 2. API Endpoint Directory
All endpoints are nested under `/api/v1/` and follow standard RESTful conventions.

### 2.1 Core Module (`/api/v1/core/`)
*   `GET | POST   /departments/` — List or create organizational departments.
*   `GET | PATCH  /departments/{id}/` — Retrieve or modify department metadata.
*   `GET          /departments/{id}/employees/` — List all employees belonging to a department.
*   `GET | POST   /employees/` — List or create employee profiles.
*   `GET | PATCH  /employees/{id}/` — Retrieve or modify employee profile (XP/Points).
*   `GET | POST   /categories/` — List or create shared ESG categories.

### 2.2 Environmental Module (`/api/v1/environmental/`)
*   `GET | POST   /emission-factors/` — List or create carbon emission factors.
*   `GET | POST   /carbon-transactions/` — List or log carbon emissions (manual entries or auto-ERP events).
*   `GET | PATCH  /goals/` — List or manage sustainability goal targets and progress.

### 2.3 Social Module (`/api/v1/social/`)
*   `GET | POST   /csr-activities/` — List or create CSR volunteering events.
*   `GET | POST   /participations/` — Employee logs participation in an activity (with proof upload).
*   `POST         /participations/{id}/approve/` — Approve log (awards Points/XP, triggers challenge check).
*   `POST         /participations/{id}/reject/` — Reject log.

### 2.4 Governance Module (`/api/v1/governance/`)
*   `GET | POST   /policies/` — List or create policies.
*   `POST         /policies/{id}/acknowledge/` — Employees sign policy acknowledgements.
*   `GET | POST   /audits/` — List or log audits.
*   `GET | POST   /compliance-issues/` — List, manage, or escalate compliance issues.

### 2.5 Gamification Module (`/api/v1/gamification/`)
*   `GET | POST   /challenges/` — List or configure challenges and goals.
*   `POST         /challenges/{id}/participate/` — Join a specific challenge.
*   `GET          /badges/` — List all achievement badges.
*   `GET          /rewards/` — List catalog rewards.
*   `POST         /rewards/{id}/redeem/` — Redeem points for a reward (checks points balance and stock atomically).
*   `GET          /leaderboard/` — Fetch ranking results (`?scope=individual|department`).

### 2.6 Scoring Module (`/api/v1/scoring/`)
*   `GET          /department-scores/` — Get scores for all departments.
*   `GET          /department-scores/{id}/history/` — Fetch timeline of department's historical scores.
*   `GET          /overall-esg-score/` — Get aggregated company-wide score.

---

## 3. Swagger / OpenAPI Integration
API schema generation is integrated out-of-the-box via `drf-spectacular`.
*   **OpenAPI Schema:** Available at `/api/v1/schema/` (YAML/JSON raw schemas).
*   **Swagger Interactive UI:** Available at `/api/v1/docs/` (for visual testing and API exploration).

---

## 4. Service-Layer Design Guidelines

To maintain code quality and separation of concerns:
1.  **Views (HTTP Handlers):** Only handle request extraction, query parameters validation, serialization, and HTTP response envelopes. They must **never** contain business logic.
2.  **Services (Domain Logic):** Located in `services.py` inside each app. These perform the validations, state updates, DB commits, and transactional locks.
3.  **Signals (Event Side-Effects):** Decoupled actions (like sending notifications or updating scores when a participation is approved) must be triggered via custom Django signals rather than written inline inside the service class.

**Example Service Pattern:**
```python
# apps/gamification/services.py
from django.db import transaction
from common.exceptions import InsufficientPointsError, OutOfStockError
from .models import Reward, RewardRedemption

class RewardService:
    @transaction.atomic
    def redeem_reward(self, employee, reward_id):
        # Row-level locking to prevent race conditions in concurrent requests
        reward = Reward.objects.select_for_update().get(id=reward_id)
        
        if employee.points_balance < reward.points_required:
            raise InsufficientPointsError("Insufficient points balance.")
        if reward.stock <= 0:
            raise OutOfStockError("Reward is out of stock.")
            
        # Perform updates
        employee.points_balance -= reward.points_required
        employee.save()
        
        reward.stock -= 1
        reward.save()
        
        redemption = RewardRedemption.objects.create(
            employee=employee,
            reward=reward,
            points_spent=reward.points_required,
            status='pending_fulfillment'
        )
        return redemption

---

## 5. Directory Structure & Local Execution

The backend codebase is structured as a modular monolith:

```
EcoSphere_Odoo/
├── backend/
│   ├── manage.py
│   ├── ecosphere/             # Project configurations (settings, urls, etc.)
│   └── apps/                  # 8 domain-specific apps
│       ├── core/
│       ├── environmental/
│       ├── social/
│       ├── governance/
│       ├── gamification/
│       ├── scoring/
│       ├── notifications/
│       └── reports/
└── tests/                     # Global test folder at the workspace root
```

### Running the Backend

1. **Activate Virtual Environment:**
   ```bash
   .venv\Scripts\activate
   ```
2. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
3. **Run Development Server:**
   ```bash
   python manage.py runserver
   ```
4. Access Interactive Docs (Swagger):
   Open [http://localhost:8000/api/v1/docs/](http://localhost:8000/api/v1/docs/) in your browser.
