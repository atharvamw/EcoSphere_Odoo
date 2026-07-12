# EcoSphere — Architecture Document

> **Audience:** AI agents and human developers building EcoSphere.
> **Source of truth for:** system design, data flow, component boundaries, and implementation logic.
> **Companion docs:** `rules.md` (business rules), `gamification.md` (game mechanics), `brand.md` (visual identity), `techstack.md` (exact libraries/versions).

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [High-Level Design (HLD)](#2-high-level-design-hld)
3. [Module Decomposition](#3-module-decomposition)
4. [Low-Level Design (LLD)](#4-low-level-design-lld)
5. [Data Model (Detailed)](#5-data-model-detailed)
6. [System Flows](#6-system-flows)
7. [API Design](#7-api-design)
8. [Authentication & Authorization (RBAC)](#8-authentication--authorization-rbac)
9. [Event-Driven Architecture](#9-event-driven-architecture)
10. [Scoring Engine](#10-scoring-engine)
11. [Notification Pipeline](#11-notification-pipeline)
12. [Report Generation Pipeline](#12-report-generation-pipeline)
13. [File Upload & Evidence System](#13-file-upload--evidence-system)
14. [Deployment Architecture](#14-deployment-architecture)
15. [Error Handling & Resilience](#15-error-handling--resilience)
16. [Security Architecture](#16-security-architecture)

---

## 1. System Overview

EcoSphere is an ESG (Environmental, Social, Governance) Management Platform that integrates sustainability tracking, employee engagement, compliance management, and gamification into a single system.

### 1.1 Architecture Style

**Modular Monolith** — a single Django application with clearly separated internal modules (Django apps), communicating through well-defined service interfaces and Django signals. Not microservices (unnecessary complexity at this scale), not a tangled monolith (modules have explicit boundaries).

### 1.2 System Context

```mermaid
graph TB
    subgraph Users
        ADMIN["Admin"]
        MGR["ESG Manager"]
        HEAD["Department Head"]
        EMP["Employee"]
    end

    subgraph EcoSphere Platform
        REACT["React SPA<br/>(Vite)"]
        DJANGO["Django API<br/>(DRF)"]
        CELERY["Celery Workers"]
    end

    subgraph Data Stores
        PG["PostgreSQL 16"]
        REDIS["Redis 7"]
        S3["Object Storage<br/>(S3 / MinIO)"]
    end

    subgraph External
        SMTP["SMTP / SES<br/>(Email)"]
        ERP["ERP Systems<br/>(Purchase/Fleet/Mfg)"]
    end

    ADMIN & MGR & HEAD & EMP --> REACT
    REACT -->|REST API + JWT| DJANGO
    REACT -->|Polls every 30s| DJANGO
    DJANGO --> PG
    DJANGO --> REDIS
    DJANGO --> S3
    CELERY --> PG
    CELERY --> REDIS
    CELERY --> SMTP
    ERP -.->|Future: webhooks / sync| DJANGO
```

---

## 2. High-Level Design (HLD)

### 2.1 Layered Architecture

```mermaid
graph TB
    subgraph Presentation Layer
        SPA["React SPA (Vite + React Router)"]
    end

    subgraph API Layer
        DRF["Django REST Framework<br/>ViewSets / Serializers / Permissions"]
        POLL["Notification Polling Endpoint<br/>GET /api/notifications/unread/"]
    end

    subgraph Service Layer
        SVC["Service Classes<br/>(Business Logic)"]
        SIG["Django Signals<br/>(Event Dispatch)"]
    end

    subgraph Domain Layer
        MOD["Django Models<br/>(ORM + Constraints)"]
        MGR["Custom Managers<br/>(Query Logic)"]
        VAL["Validators<br/>(Domain Rules)"]
    end

    subgraph Infrastructure Layer
        DB["PostgreSQL"]
        CACHE["Redis Cache"]
        QUEUE["Celery + Redis Broker"]
        STORE["Object Storage (S3)"]
        MAIL["Email Service"]
    end

    SPA --> DRF
    SPA -->|every 30s| POLL
    DRF --> SVC
    POLL --> SVC
    SVC --> SIG
    SVC --> MOD
    SIG --> SVC
    MOD --> MGR
    MOD --> VAL
    MOD --> DB
    SVC --> CACHE
    SVC --> QUEUE
    SVC --> STORE
    QUEUE --> MAIL
```

### 2.2 Key Design Principles

| Principle | How it's applied |
|---|---|
| **Separation of concerns** | Views handle HTTP, Services handle business logic, Models handle data integrity |
| **Server-side truth** | Scores, XP, badge unlocks are computed server-side only — never trust client-submitted values |
| **Append-only audit data** | Department Scores, Badge Awards, Reward Redemptions are immutable historical records |
| **Event-driven side effects** | Badge unlock, notification dispatch, leaderboard update happen via signals — not inline in views |
| **Fail-safe constraints** | Negative balances / stock prevented at DB level (`CHECK` constraints) + application level |
| **Configuration over code** | ESG weights, toggles (evidence, auto-emission, badge auto-award) read from DB settings at runtime |

---

## 3. Module Decomposition

### 3.1 Django Apps

```mermaid
graph LR
    subgraph Core["core"]
        D["Department"]
        E["Employee"]
        CAT["Category"]
        SET["SiteSettings"]
    end

    subgraph Environmental["environmental"]
        EF["EmissionFactor"]
        CT["CarbonTransaction"]
        EG["EnvironmentalGoal"]
        PP["ProductESGProfile"]
    end

    subgraph Social["social"]
        CSR["CSRActivity"]
        EP["EmployeeParticipation"]
    end

    subgraph Governance["governance"]
        POL["ESGPolicy"]
        PA["PolicyAcknowledgement"]
        AUD["Audit"]
        CI["ComplianceIssue"]
    end

    subgraph Gamification["gamification"]
        GD["GoalDefinition"]
        GL["Goal"]
        CH["Challenge"]
        CP["ChallengeParticipation"]
        BA["Badge"]
        EB["EmployeeBadge"]
        RW["Reward"]
        RR["RewardRedemption"]
    end

    subgraph Scoring["scoring"]
        DS["DepartmentScore"]
        SE["ScoringEngine"]
    end

    subgraph Notifications["notifications"]
        NE["NotificationEvent"]
        NP["NotificationPreference"]
        NS["NotificationSender"]
    end

    subgraph Reports["reports"]
        RB["ReportBuilder"]
        EX["Exporters (PDF/Excel/CSV)"]
    end

    Core --> Environmental
    Core --> Social
    Core --> Governance
    Core --> Gamification
    Social --> Gamification
    Environmental --> Scoring
    Social --> Scoring
    Governance --> Scoring
    Gamification --> Scoring
    Core --> Notifications
    Scoring --> Notifications
    Gamification --> Notifications
    Governance --> Notifications
```

### 3.2 Module Responsibilities

| App | Owns | Does NOT own |
|---|---|---|
| `core` | Department hierarchy, Employee profiles, Categories, Site Settings | Business logic for any ESG pillar |
| `environmental` | Emission Factors, Carbon Transactions, Environmental Goals, Product ESG Profiles | Score calculation (→ `scoring`) |
| `social` | CSR Activities, Employee Participation (in CSR), Diversity metrics | Challenge Participation (→ `gamification`) |
| `governance` | ESG Policies, Policy Acknowledgements, Audits, Compliance Issues | Score aggregation (→ `scoring`) |
| `gamification` | Goal Definitions, Goals, Challenges, Challenge Participation, Badges, Rewards, Leaderboards | CSR Activity management (→ `social`) |
| `scoring` | Department Score records, score calculation engine, ESG weight configuration | Raw data collection (→ pillar apps) |
| `notifications` | Notification dispatch, preferences, templates, polling endpoint | Business event detection (→ signals in source apps) |
| `reports` | Report builder, filter logic, PDF/Excel/CSV export | Data queries (uses ORM from pillar apps) |

---

## 4. Low-Level Design (LLD)

### 4.1 Service Layer Pattern

Every Django app follows this internal structure:

```
apps/gamification/
├── __init__.py
├── models.py          # Django models (data layer)
├── managers.py        # Custom QuerySet managers
├── serializers.py     # DRF serializers (API I/O)
├── views.py           # DRF ViewSets (HTTP handling)
├── services.py        # Business logic (the brain)
├── signals.py         # Signal handlers (side effects)
├── permissions.py     # Custom DRF permissions
├── validators.py      # Domain validation rules
├── filters.py         # django-filter FilterSets
├── urls.py            # URL routing
├── admin.py           # Django Admin configuration
├── tasks.py           # Celery async tasks
├── tests/
│   ├── test_models.py
│   ├── test_services.py
│   ├── test_views.py
│   └── test_signals.py
└── migrations/
```

**Rule: Views call Services. Services call Models. Signals call Services. Never skip layers.**

```python
# CORRECT — View → Service → Model
class ChallengeParticipationViewSet(ModelViewSet):
    def perform_update(self, serializer):
        instance = serializer.save()
        if instance.status == 'approved':
            gamification_service.approve_participation(instance)

# WRONG — Business logic in the view
class ChallengeParticipationViewSet(ModelViewSet):
    def perform_update(self, serializer):
        instance = serializer.save()
        if instance.status == 'approved':
            instance.employee.xp_total += instance.challenge.xp  # NO
            instance.employee.save()                               # NO
```

### 4.2 Service Interface Examples

```python
# apps/gamification/services.py

class GamificationService:
    """All gamification business logic lives here."""

    @transaction.atomic
    def approve_participation(self, participation: ChallengeParticipation) -> None:
        """Approve a challenge participation — triggers XP, badge, notification chain."""
        self._validate_approver_is_not_participant(participation)
        self._validate_evidence_if_required(participation)
        participation.status = 'approved'
        participation.xp_awarded = participation.challenge.xp
        participation.save()
        self._award_xp(participation.employee, participation.xp_awarded)
        # Signal fires here → badge check + notification happen as side effects

    @transaction.atomic
    def redeem_reward(self, employee: Employee, reward: Reward) -> RewardRedemption:
        """Redeem a reward — checks balance + stock atomically."""
        reward = Reward.objects.select_for_update().get(pk=reward.pk)
        if employee.points_balance < reward.points_required:
            raise InsufficientPointsError()
        if reward.stock <= 0:
            raise OutOfStockError()
        employee.points_balance -= reward.points_required
        employee.save()
        reward.stock -= 1
        reward.save()
        return RewardRedemption.objects.create(
            employee=employee, reward=reward,
            points_spent=reward.points_required, status='pending_fulfillment'
        )
```

---

## 5. Data Model (Detailed)

### 5.1 Entity Relationship Diagram

```mermaid
erDiagram
    DEPARTMENT ||--o{ EMPLOYEE : employs
    DEPARTMENT ||--o{ CARBON_TRANSACTION : incurs
    DEPARTMENT ||--o{ CSR_ACTIVITY : hosts
    DEPARTMENT ||--o{ AUDIT : is_audited
    DEPARTMENT ||--o{ DEPARTMENT_SCORE : scored_as
    DEPARTMENT ||--o{ CHALLENGE : scoped_to
    DEPARTMENT }o--o| DEPARTMENT : parent_of

    EMPLOYEE ||--o{ EMPLOYEE_PARTICIPATION : logs
    EMPLOYEE ||--o{ CHALLENGE_PARTICIPATION : joins
    EMPLOYEE ||--o{ POLICY_ACKNOWLEDGEMENT : signs
    EMPLOYEE ||--o{ EMPLOYEE_BADGE : earns
    EMPLOYEE ||--o{ REWARD_REDEMPTION : redeems
    EMPLOYEE ||--o{ COMPLIANCE_ISSUE : owns

    CATEGORY ||--o{ CSR_ACTIVITY : classifies
    CATEGORY ||--o{ CHALLENGE : classifies

    EMISSION_FACTOR ||--o{ CARBON_TRANSACTION : rates

    CSR_ACTIVITY ||--o{ EMPLOYEE_PARTICIPATION : tracked_by
    CHALLENGE ||--o{ CHALLENGE_PARTICIPATION : tracked_by
    CHALLENGE ||--o{ GOAL : contains
    GOAL_DEFINITION ||--o{ GOAL : instantiated_as

    AUDIT ||--o{ COMPLIANCE_ISSUE : raises
    ESG_POLICY ||--o{ POLICY_ACKNOWLEDGEMENT : acknowledged_via

    BADGE ||--o{ EMPLOYEE_BADGE : unlocked_as
    REWARD ||--o{ REWARD_REDEMPTION : claimed_as

    DEPARTMENT {
        uuid id PK
        string name
        string code
        uuid head_employee_id FK
        uuid parent_department_id FK
        int employee_count
        string status
    }

    EMPLOYEE {
        uuid id PK
        uuid user_id FK
        uuid department_id FK
        int xp_total
        int points_balance
        string role
    }

    SITE_SETTINGS {
        uuid id PK
        bool auto_emission_calculation_enabled
        bool evidence_requirement_enabled
        bool badge_auto_award_enabled
        decimal environmental_weight
        decimal social_weight
        decimal governance_weight
    }

    EMISSION_FACTOR {
        uuid id PK
        string name
        string source_type
        decimal factor_value
        string unit
        string standard_reference
    }

    CARBON_TRANSACTION {
        uuid id PK
        uuid department_id FK
        uuid emission_factor_id FK
        decimal quantity
        decimal co2e_amount
        string source_record_type
        uuid source_record_id
        bool is_manual_override
        text override_reason
        date transaction_date
        datetime created_at
    }

    ENVIRONMENTAL_GOAL {
        uuid id PK
        string title
        uuid department_id FK
        decimal target_value
        decimal current_value
        string unit
        date start_date
        date end_date
        string status
    }

    CSR_ACTIVITY {
        uuid id PK
        string title
        uuid department_id FK
        uuid category_id FK
        text description
        date activity_date
        string status
        int points_value
    }

    EMPLOYEE_PARTICIPATION {
        uuid id PK
        uuid employee_id FK
        uuid activity_id FK
        string approval_status
        int points_earned
        uuid approved_by_id FK
        datetime approved_at
        string proof_file_path
        date completion_date
    }

    CATEGORY {
        uuid id PK
        string name
        string type
        string status
    }

    GOAL_DEFINITION {
        uuid id PK
        string name
        string source_model
        string source_field
        string computation
        string scope
        string suffix
    }

    GOAL {
        uuid id PK
        uuid goal_definition_id FK
        uuid challenge_id FK
        string condition
        decimal target_value
        decimal current_value
    }

    CHALLENGE {
        uuid id PK
        string title
        uuid category_id FK
        uuid department_id FK
        text description
        int xp
        string difficulty
        string periodicity
        string assignment_rule
        bool evidence_required
        date start_date
        date deadline
        string status
    }

    CHALLENGE_PARTICIPATION {
        uuid id PK
        uuid challenge_id FK
        uuid employee_id FK
        decimal progress
        string proof_file_path
        string approval_status
        uuid approved_by_id FK
        int xp_awarded
        string status
    }

    ESG_POLICY {
        uuid id PK
        string title
        text content
        string version
        date effective_date
        string status
    }

    POLICY_ACKNOWLEDGEMENT {
        uuid id PK
        uuid policy_id FK
        uuid employee_id FK
        datetime acknowledged_at
        string signature
    }

    AUDIT {
        uuid id PK
        uuid department_id FK
        string title
        string audit_type
        date audit_date
        string status
        uuid auditor_id FK
        text findings
    }

    COMPLIANCE_ISSUE {
        uuid id PK
        uuid audit_id FK
        uuid owner_employee_id FK
        string severity
        text description
        date due_date
        string status
        datetime resolved_at
    }

    DEPARTMENT_SCORE {
        uuid id PK
        uuid department_id FK
        decimal environmental_score
        decimal social_score
        decimal governance_score
        decimal total_score
        date period_start
        date period_end
        datetime calculated_at
    }

    BADGE {
        uuid id PK
        string name
        text description
        string unlock_rule_type
        uuid unlock_goal_definition_id FK
        decimal unlock_threshold
        string grant_permission
        int limitation_number
        string icon_path
    }

    EMPLOYEE_BADGE {
        uuid id PK
        uuid employee_id FK
        uuid badge_id FK
        datetime awarded_at
        uuid granted_by_id FK
        string award_type
    }

    REWARD {
        uuid id PK
        string name
        text description
        int points_required
        int stock
        string status
    }

    REWARD_REDEMPTION {
        uuid id PK
        uuid employee_id FK
        uuid reward_id FK
        int points_spent
        string status
        datetime redeemed_at
        datetime fulfilled_at
    }
```

### 5.2 Database Constraints (PostgreSQL Level)

These constraints are enforced at the database level — they cannot be bypassed even by raw SQL or admin scripts:

```sql
-- Employee: no negative XP or Points
ALTER TABLE employee ADD CONSTRAINT chk_xp_non_negative CHECK (xp_total >= 0);
ALTER TABLE employee ADD CONSTRAINT chk_points_non_negative CHECK (points_balance >= 0);

-- Reward: no negative stock
ALTER TABLE reward ADD CONSTRAINT chk_stock_non_negative CHECK (stock >= 0);

-- Compliance Issue: Owner and Due Date are mandatory
ALTER TABLE compliance_issue ADD CONSTRAINT chk_owner_required CHECK (owner_employee_id IS NOT NULL);
ALTER TABLE compliance_issue ADD CONSTRAINT chk_due_date_required CHECK (due_date IS NOT NULL);

-- Department Score: scores are 0-100 range
ALTER TABLE department_score ADD CONSTRAINT chk_env_score_range CHECK (environmental_score BETWEEN 0 AND 100);
ALTER TABLE department_score ADD CONSTRAINT chk_soc_score_range CHECK (social_score BETWEEN 0 AND 100);
ALTER TABLE department_score ADD CONSTRAINT chk_gov_score_range CHECK (governance_score BETWEEN 0 AND 100);

-- ESG weights must sum to 1.0
ALTER TABLE site_settings ADD CONSTRAINT chk_weights_sum
    CHECK (environmental_weight + social_weight + governance_weight = 1.0);
```

### 5.3 Indexing Strategy

```sql
-- High-frequency query patterns that need indexes
CREATE INDEX idx_carbon_tx_dept_date ON carbon_transaction (department_id, transaction_date);
CREATE INDEX idx_participation_employee ON employee_participation (employee_id, approval_status);
CREATE INDEX idx_challenge_status ON challenge (status, deadline);
CREATE INDEX idx_compliance_due ON compliance_issue (due_date, status);
CREATE INDEX idx_dept_score_period ON department_score (department_id, period_start, period_end);
CREATE INDEX idx_employee_badge ON employee_badge (employee_id, badge_id);
CREATE INDEX idx_challenge_part_employee ON challenge_participation (employee_id, status);
```

---

## 6. System Flows

### 6.1 CSR Participation → Approval → Points Award

```mermaid
sequenceDiagram
    participant EMP as Employee
    participant REACT as React SPA
    participant API as Django API
    participant SVC as SocialService
    participant DB as PostgreSQL
    participant SIG as Signals
    participant GAM as GamificationService
    participant NOT as NotificationService

    EMP->>REACT: Submit CSR participation + proof file
    REACT->>API: POST /api/social/participations/ (multipart)
    API->>SVC: create_participation(data, file)
    SVC->>DB: Save EmployeeParticipation (status=pending)
    SVC->>DB: Upload proof to S3
    API-->>REACT: 201 Created

    Note over API: Later — Department Head reviews

    API->>SVC: approve_participation(participation_id, approver)
    SVC->>SVC: Validate approver ≠ participant
    SVC->>SVC: Check evidence_requirement (Settings)
    SVC->>DB: Update status=approved, points_earned=X
    SVC->>DB: Employee.points_balance += points_earned
    SVC->>SIG: post_save → participation_approved signal

    SIG->>GAM: Check if any Challenge Goals now satisfied
    GAM->>DB: Evaluate Goal Definitions against employee metrics
    SIG->>NOT: Queue notification (CSR approved)
    NOT->>DB: Save NotificationEvent record (unread)

    Note over REACT: Next poll cycle (≤30s)
    REACT->>API: GET /api/notifications/unread/
    API-->>REACT: New notification data
    REACT->>EMP: Toast: "CSR Activity approved!"
```

### 6.2 Challenge Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Draft: CSR team creates
    Draft --> Active: Publish
    Draft --> Archived: Cancel

    Active --> UnderReview: Deadline reached OR manual close
    Active --> Archived: Cancel

    UnderReview --> Completed: All participations reviewed
    UnderReview --> Archived: Cancel

    Completed --> [*]: Immutable record

    Archived --> [*]: No rewards distributed

    state Active {
        [*] --> Tracking
        Tracking --> GoalsMet: All goals satisfied
        Tracking --> Tracking: Progress updates
    }

    state Completed {
        [*] --> DistributeXP
        DistributeXP --> AwardBadges
        AwardBadges --> UpdateLeaderboard
        UpdateLeaderboard --> UpdateScores
    }
```

### 6.3 Badge Auto-Award Event Chain

```mermaid
sequenceDiagram
    participant TRIGGER as Triggering Event
    participant SIG as Django Signal
    participant BADGE_SVC as BadgeService
    participant DB as PostgreSQL
    participant NOT as NotificationService

    TRIGGER->>SIG: XP awarded / Challenge completed
    SIG->>BADGE_SVC: evaluate_badges(employee)
    BADGE_SVC->>DB: Fetch all Badges with auto-unlock rules
    BADGE_SVC->>DB: Fetch employee's current metrics (XP, challenge count)

    loop For each unearned Badge
        BADGE_SVC->>BADGE_SVC: Check unlock_rule vs employee metrics
        alt Rule satisfied
            BADGE_SVC->>DB: Create EmployeeBadge record
            BADGE_SVC->>SIG: badge_awarded signal
            SIG->>NOT: Queue notification (Badge unlocked)
            NOT->>DB: Save NotificationEvent (unread)
        end
    end

    Note over DB: Employee sees 🎖 on next poll (≤30s)
```

### 6.4 Reward Redemption (Atomic)

```mermaid
sequenceDiagram
    participant EMP as Employee
    participant API as Django API
    participant SVC as GamificationService
    participant DB as PostgreSQL (with row lock)
    participant NOT as NotificationService

    EMP->>API: POST /api/gamification/rewards/5/redeem/
    API->>SVC: redeem_reward(employee, reward_id)

    Note over SVC,DB: transaction.atomic() + select_for_update()

    SVC->>DB: SELECT reward FOR UPDATE (row lock)
    SVC->>SVC: Check points_balance ≥ points_required
    SVC->>SVC: Check stock > 0

    alt Insufficient points or stock
        SVC-->>API: Raise error (400)
        API-->>EMP: Error response
    else Valid
        SVC->>DB: employee.points_balance -= points_required
        SVC->>DB: reward.stock -= 1
        SVC->>DB: Create RewardRedemption (status=pending_fulfillment)
        SVC->>NOT: Notify employee + admin
        SVC-->>API: Return redemption record
        API-->>EMP: 201 Created
    end
```

### 6.5 Carbon Auto-Calculation Flow

```mermaid
sequenceDiagram
    participant ERP as ERP Record (Purchase/Fleet/Mfg)
    participant SIG as Django Signal
    participant ENV_SVC as EnvironmentalService
    participant SETTINGS as SiteSettings
    participant DB as PostgreSQL

    ERP->>SIG: post_save signal (new purchase/expense created)
    SIG->>SETTINGS: Check auto_emission_calculation_enabled
    
    alt Auto-calculation ON
        SIG->>ENV_SVC: calculate_emission(erp_record)
        ENV_SVC->>DB: Find matching EmissionFactor
        ENV_SVC->>ENV_SVC: co2e = quantity × factor_value
        ENV_SVC->>DB: Create CarbonTransaction (auto-generated)
    else Auto-calculation OFF
        Note over SIG: Do nothing — manual entry required
    end
```

### 6.6 Score Calculation Pipeline

```mermaid
graph TD
    A["Trigger: Celery periodic task<br/>OR manual recalculate"] --> B["For each Department"]
    B --> C["Calculate Environmental Score"]
    B --> D["Calculate Social Score"]
    B --> E["Calculate Governance Score"]

    C --> C1["Sum carbon reductions vs goals"]
    C --> C2["Count active environmental goals met"]
    C --> C3["Normalize to 0-100"]

    D --> D1["Count approved CSR participations"]
    D --> D2["Diversity metrics"]
    D --> D3["Training completion rates"]
    D --> D4["Normalize to 0-100"]

    E --> E1["Policy acknowledgement rate"]
    E --> E2["Audit compliance rate"]
    E --> E3["Open compliance issues (penalty)"]
    E --> E4["Normalize to 0-100"]

    C3 --> F["Read ESG weights from SiteSettings"]
    D4 --> F
    E4 --> F

    F --> G["Total = E×w_e + S×w_s + G×w_g"]
    G --> H["INSERT DepartmentScore<br/>(append-only, never UPDATE)"]
    H --> I["Recalculate Overall ESG Score<br/>(weighted avg of all departments)"]
```

### 6.7 Compliance Issue Escalation

```mermaid
sequenceDiagram
    participant CRON as Celery Beat (daily)
    participant TASK as check_overdue_issues task
    participant DB as PostgreSQL
    participant NOT as NotificationService
    participant MAIL as Email Service

    CRON->>TASK: Trigger daily at 09:00
    TASK->>DB: SELECT * FROM compliance_issue WHERE due_date < today AND status = 'open'

    loop For each overdue issue
        TASK->>DB: Update issue.is_overdue = true
        TASK->>NOT: Create notification for issue owner
        TASK->>NOT: Create notification for ESG Manager
        TASK->>NOT: Create notification for Department Head
        NOT->>DB: Save NotificationEvent records (unread)
        NOT->>MAIL: Send email alerts (via Celery)
    end

    Note over DB: Users see alerts on next poll (≤30s) + email
```

---

## 7. API Design

### 7.1 URL Structure

All API endpoints follow REST conventions with resource-based, plural noun URLs:

```
/api/v1/
├── auth/
│   ├── login/                    POST
│   ├── logout/                   POST
│   ├── refresh/                  POST
│   └── me/                       GET, PATCH
│
├── core/
│   ├── departments/              GET, POST
│   ├── departments/{id}/         GET, PUT, PATCH, DELETE
│   ├── departments/{id}/employees/   GET
│   ├── employees/                GET, POST
│   ├── employees/{id}/           GET, PUT, PATCH
│   ├── categories/               GET, POST
│   ├── categories/{id}/          GET, PUT, PATCH, DELETE
│   └── settings/                 GET, PUT (admin only)
│
├── environmental/
│   ├── emission-factors/         GET, POST
│   ├── emission-factors/{id}/    GET, PUT, PATCH, DELETE
│   ├── carbon-transactions/      GET, POST
│   ├── carbon-transactions/{id}/ GET, PUT, PATCH
│   ├── goals/                    GET, POST
│   └── goals/{id}/               GET, PUT, PATCH
│
├── social/
│   ├── csr-activities/           GET, POST
│   ├── csr-activities/{id}/      GET, PUT, PATCH
│   ├── participations/           GET, POST
│   ├── participations/{id}/      GET, PATCH
│   ├── participations/{id}/approve/   POST
│   ├── participations/{id}/reject/    POST
│   └── participations/{id}/evidence/  POST (file upload)
│
├── governance/
│   ├── policies/                 GET, POST
│   ├── policies/{id}/            GET, PUT, PATCH
│   ├── acknowledgements/         GET, POST
│   ├── audits/                   GET, POST
│   ├── audits/{id}/              GET, PUT, PATCH
│   ├── compliance-issues/        GET, POST
│   └── compliance-issues/{id}/   GET, PUT, PATCH
│
├── gamification/
│   ├── goal-definitions/         GET, POST
│   ├── challenges/               GET, POST
│   ├── challenges/{id}/          GET, PUT, PATCH
│   ├── challenges/{id}/participate/   POST
│   ├── challenge-participations/ GET
│   ├── challenge-participations/{id}/approve/  POST
│   ├── badges/                   GET, POST
│   ├── badges/{id}/              GET, PUT, PATCH
│   ├── badges/{id}/grant/        POST (manual grant)
│   ├── my-badges/                GET
│   ├── rewards/                  GET, POST
│   ├── rewards/{id}/             GET, PUT, PATCH
│   ├── rewards/{id}/redeem/      POST
│   ├── my-redemptions/           GET
│   └── leaderboard/              GET (?scope=individual|department&period=all|current)
│
├── scoring/
│   ├── department-scores/        GET
│   ├── department-scores/{dept_id}/history/  GET
│   └── overall-esg-score/        GET
│
├── notifications/
│   ├── my-notifications/         GET
│   ├── my-notifications/{id}/read/   POST
│   └── preferences/              GET, PUT
│
└── reports/
    ├── environmental/            GET (?format=json|pdf|excel|csv)
    ├── social/                   GET
    ├── governance/               GET
    ├── esg-summary/              GET
    └── custom/                   POST (filter spec → export)
```

### 7.2 Standard Response Envelope

```json
{
  "status": "success",
  "data": { ... },
  "meta": {
    "page": 1,
    "page_size": 25,
    "total_count": 142,
    "total_pages": 6
  }
}
```

Error responses:
```json
{
  "status": "error",
  "code": "INSUFFICIENT_POINTS",
  "message": "You need 150 points but only have 80.",
  "details": {
    "required": 150,
    "available": 80
  }
}
```

### 7.3 Filtering & Pagination

All list endpoints support:
- **Pagination:** `?page=1&page_size=25` (cursor-based for leaderboard)
- **Filtering:** `?department=uuid&status=active&date_from=2026-01-01&date_to=2026-06-30`
- **Ordering:** `?ordering=-created_at,name`
- **Search:** `?search=carbon` (full-text on relevant fields)

---

## 8. Authentication & Authorization (RBAC)

### 8.1 Auth Flow

```mermaid
sequenceDiagram
    participant USER as User
    participant REACT as React SPA
    participant API as Django API
    participant JWT as JWT Service
    participant DB as PostgreSQL

    USER->>REACT: Enter email + password
    REACT->>API: POST /api/v1/auth/login/
    API->>DB: Validate credentials
    API->>JWT: Generate access + refresh tokens
    API-->>REACT: Set httpOnly cookies (access + refresh)
    REACT->>REACT: Redirect to dashboard

    Note over REACT,API: Subsequent requests

    REACT->>API: GET /api/v1/gamification/challenges/ (cookie attached)
    API->>JWT: Validate access token from cookie
    API->>DB: Check user permissions
    API-->>REACT: 200 + data

    Note over REACT,API: Token refresh

    REACT->>API: POST /api/v1/auth/refresh/ (refresh cookie)
    API->>JWT: Validate refresh, issue new access
    API-->>REACT: New access token cookie
```

### 8.2 Role Permission Matrix

| Resource | Admin | ESG Manager | Department Head | Employee |
|---|---|---|---|---|
| **Departments** | CRUD | Read | Read (own) | Read (own) |
| **Employees** | CRUD | Read | Read (own dept) | Read (self) |
| **Site Settings** | CRUD | Read | — | — |
| **Emission Factors** | CRUD | CRUD | Read | Read |
| **Carbon Transactions** | CRUD | CRUD | Read (own dept) | Read (own dept) |
| **CSR Activities** | CRUD | CRUD | CRUD (own dept) | Read |
| **Employee Participation** | CRUD | Approve/Reject | Approve/Reject (own dept) | Create (self), Read (self) |
| **Challenges** | CRUD | CRUD | Read | Read, Participate |
| **Challenge Participation** | CRUD | Approve/Reject | Approve/Reject (own dept) | Create (self), Read (self) |
| **Policies** | CRUD | CRUD | Read | Read, Acknowledge |
| **Audits** | CRUD | CRUD | Read (own dept) | — |
| **Compliance Issues** | CRUD | CRUD | Read/Update (own dept) | Read/Update (if owner) |
| **Badges** | CRUD | CRUD | Read | Read (own) |
| **Badge Grant (manual)** | Grant any | Grant (per allowance) | Grant (per allowance) | — |
| **Rewards** | CRUD | CRUD | Read | Read, Redeem |
| **Reports** | All | All | Own dept filter | Own data |
| **Leaderboard** | All | All | All | All (read-only) |

### 8.3 Anti-Gaming Permission Rules

```python
# Enforced in permissions.py — these are non-negotiable
class CannotSelfApprove(BasePermission):
    """No employee can approve their own CSR or Challenge participation."""
    def has_object_permission(self, request, view, obj):
        if view.action in ('approve', 'reject'):
            return request.user.employee != obj.employee
        return True

class CannotExceedBadgeLimit(BasePermission):
    """Manual badge grants respect the Badge's limitation_number per period."""
    ...
```

---

## 9. Event-Driven Architecture

### 9.1 Signal Registry

All side effects are triggered via Django signals. This keeps the primary action clean and makes the system auditable.

| Signal | Sender | Handlers | Side Effects |
|---|---|---|---|
| `participation_approved` | `SocialService` | GamificationService, NotificationService, ScoringService | Check challenge goals, send notification, queue score recalc |
| `challenge_completed` | `GamificationService` | BadgeService, NotificationService, ScoringService | Award XP, check badges, send notification, update leaderboard |
| `xp_awarded` | `GamificationService` | BadgeService | Evaluate auto-unlock badge rules |
| `badge_awarded` | `BadgeService` | NotificationService | Send badge unlock notification |
| `reward_redeemed` | `GamificationService` | NotificationService | Send confirmation to employee + admin |
| `compliance_issue_created` | `GovernanceService` | NotificationService | Notify owner + ESG manager |
| `compliance_issue_overdue` | `CeleryTask` | NotificationService | Escalation notifications |
| `carbon_transaction_created` | `EnvironmentalService` | ScoringService | Queue environmental score recalc |
| `policy_acknowledged` | `GovernanceService` | GamificationService, ScoringService | Check policy-related goals, update governance score |
| `score_calculated` | `ScoringService` | NotificationService | Notify if score dropped significantly |

### 9.2 Signal Implementation Pattern

```python
# apps/gamification/signals.py

from django.dispatch import Signal, receiver

# Custom signals
xp_awarded = Signal()        # args: employee, amount, source
badge_awarded = Signal()     # args: employee, badge, award_type
challenge_completed = Signal()  # args: participation

@receiver(xp_awarded)
def check_badge_unlock_on_xp(sender, employee, amount, **kwargs):
    """When XP is awarded, check if any badges should auto-unlock."""
    from .services import badge_service
    if SiteSettings.get().badge_auto_award_enabled:
        badge_service.evaluate_badges(employee)

@receiver(badge_awarded)
def notify_badge_unlock(sender, employee, badge, **kwargs):
    """When a badge is awarded, send notification."""
    from apps.notifications.services import notification_service
    notification_service.send(
        recipient=employee,
        event_type='badge_unlocked',
        context={'badge_name': badge.name}
    )
```

---

## 10. Scoring Engine

### 10.1 Score Calculation Logic

```python
# apps/scoring/engine.py

class ScoringEngine:
    """
    Calculates Department Scores as point-in-time records.
    NEVER updates existing scores — always appends new records.
    """

    def calculate_department_score(self, department, period_start, period_end):
        settings = SiteSettings.get()

        env_score = self._calc_environmental(department, period_start, period_end)
        soc_score = self._calc_social(department, period_start, period_end)
        gov_score = self._calc_governance(department, period_start, period_end)

        total = (
            env_score * settings.environmental_weight +
            soc_score * settings.social_weight +
            gov_score * settings.governance_weight
        )

        # APPEND — never update
        return DepartmentScore.objects.create(
            department=department,
            environmental_score=env_score,
            social_score=soc_score,
            governance_score=gov_score,
            total_score=total,
            period_start=period_start,
            period_end=period_end,
            calculated_at=timezone.now(),
        )

    def calculate_overall_esg(self, period_start, period_end):
        """Weighted average of all Department Total Scores."""
        latest_scores = DepartmentScore.objects.filter(
            period_start=period_start, period_end=period_end
        ).values('department').annotate(
            latest=Max('calculated_at')
        )
        # ... aggregate into overall score
```

### 10.2 Sub-Score Calculation Components

| Sub-Score | Inputs | Formula |
|---|---|---|
| **Environmental** | Carbon Transactions (reductions), Environmental Goal progress, Product ESG profiles | `(goals_met / total_goals) × 40 + (emission_reduction_pct) × 40 + (products_with_profile_pct) × 20` — normalized to 0-100 |
| **Social** | Approved CSR participations, diversity metrics, training completion | `(participation_rate) × 40 + (diversity_index) × 30 + (training_completion_pct) × 30` — normalized to 0-100 |
| **Governance** | Policy acknowledgement rate, audit pass rate, open compliance issues | `(ack_rate) × 35 + (audit_pass_rate) × 35 - (overdue_issues_penalty) × 30` — clamped to 0-100 |

---

## 11. Notification Pipeline

### 11.1 Architecture

```mermaid
graph LR
    subgraph Event Sources
        S1["participation_approved"]
        S2["badge_awarded"]
        S3["compliance_issue_created"]
        S4["challenge_available"]
        S5["reward_redeemed"]
        S6["compliance_overdue"]
    end

    subgraph NotificationService
        ROUTE["Router<br/>(event_type → delivery)"]
        PREF["Preference Check<br/>(user settings)"]
    end

    subgraph Delivery
        INAPP["In-App<br/>(DB record → polled by frontend)"]
        EMAIL["Email<br/>(Celery async task)"]
    end

    subgraph Storage
        DB["NotificationEvent<br/>(PostgreSQL)"]
    end

    S1 & S2 & S3 & S4 & S5 & S6 --> ROUTE
    ROUTE --> PREF
    PREF --> INAPP
    PREF --> EMAIL
    ROUTE --> DB
    INAPP --> DB
```

> **Polling model:** The frontend polls `GET /api/notifications/unread/` every 30 seconds via TanStack Query's `refetchInterval`. This replaces WebSocket with zero infrastructure overhead — no Daphne, no Django Channels, no persistent connections. Notifications are stored in PostgreSQL and served as normal REST responses.

### 11.2 Notification Types (Minimum — Floor, Not Ceiling)

| Event | Recipients | In-App | Email |
|---|---|---|---|
| New Compliance Issue | Issue owner, ESG Manager | ✅ | ✅ |
| CSR Participation Approved/Rejected | Participating employee | ✅ | ✅ |
| Challenge Participation Approved/Rejected | Participating employee | ✅ | ✅ |
| Policy Acknowledgement Reminder | Employees who haven't acknowledged | ✅ | ✅ |
| Badge Unlocked | Awarded employee | ✅ | ✅ |
| New Challenge Available | Employees matching assignment rule | ✅ | Optional |
| Reward Redeemed | Employee + fulfillment admin | ✅ | ✅ |
| Compliance Issue Overdue | Issue owner, Dept Head, ESG Manager | ✅ | ✅ |
| Reward Stock Low | ESG Manager, Admin | ✅ | ✅ |

---

## 12. Report Generation Pipeline

### 12.1 Flow

```mermaid
graph TD
    A["User selects report type + filters"] --> B["React sends filter spec to API"]
    B --> C{"Format?"}
    C -->|JSON| D["DRF serializes queryset → JSON response"]
    C -->|PDF| E["Celery task: WeasyPrint renders HTML template → PDF"]
    C -->|Excel| F["Celery task: openpyxl builds workbook → .xlsx"]
    C -->|CSV| G["StreamingHttpResponse → .csv"]

    E --> H["Upload to S3 → return signed URL"]
    F --> H
    G --> I["Direct download stream"]
    H --> J["Notify user: report ready (WebSocket)"]
    D --> K["React renders in-app table/charts"]
```

### 12.2 Filter Specification

All reports accept a standardized filter object:

```json
{
  "report_type": "environmental",
  "format": "pdf",
  "filters": {
    "department_ids": ["uuid1", "uuid2"],
    "date_range": { "start": "2026-01-01", "end": "2026-06-30" },
    "module": "environmental",
    "employee_ids": [],
    "challenge_ids": [],
    "category_ids": []
  }
}
```

---

## 13. File Upload & Evidence System

### 13.1 Upload Flow

```mermaid
sequenceDiagram
    participant USER as User
    participant REACT as React SPA
    participant API as Django API
    participant S3 as Object Storage (S3/MinIO)
    participant DB as PostgreSQL

    USER->>REACT: Attach proof file (image/PDF)
    REACT->>API: POST /api/.../evidence/ (multipart/form-data)
    API->>API: Validate file type, size (max 10MB)
    API->>S3: Upload to /evidence/{model}/{record_id}/{filename}
    S3-->>API: Return storage path
    API->>DB: Save file path on participation record
    API-->>REACT: 200 OK + file metadata
```

### 13.2 Rules

- Accepted types: `image/jpeg`, `image/png`, `application/pdf` (configurable)
- Max size: 10 MB per file
- Storage path: `evidence/{model_type}/{record_id}/{uuid}_{filename}`
- Files are never stored in the database — only the path reference
- Download: signed URLs with expiry (for security)

---

## 14. Deployment Architecture

### 14.1 Production Setup

```mermaid
graph TB
    subgraph CDN / Static
        NGINX["Nginx / Caddy"]
        STATIC["React Build<br/>(static files)"]
    end

    subgraph Application
        GUNICORN["Gunicorn<br/>(WSGI - REST API)"]
        CELERY_W["Celery Workers<br/>(async tasks)"]
        CELERY_B["Celery Beat<br/>(scheduled tasks)"]
    end

    subgraph Data
        PG["PostgreSQL 16<br/>(primary DB)"]
        REDIS["Redis 7<br/>(cache + broker)"]
        S3["S3 / MinIO<br/>(file storage)"]
    end

    NGINX --> STATIC
    NGINX -->|/api/*| GUNICORN
    NGINX -->|/admin/*| GUNICORN
    GUNICORN --> PG
    GUNICORN --> REDIS
    CELERY_W --> PG
    CELERY_W --> REDIS
    CELERY_W --> S3
    CELERY_B --> REDIS
```

> **Single app server:** With polling instead of WebSocket, Gunicorn is the only application server. No Daphne, no ASGI, no WebSocket upstream — simpler deployment, fewer failure points.

### 14.2 Development Setup

```
# Single command to start everything (docker-compose)
docker-compose up

Services:
  - django:    localhost:8000  (runserver with hot reload)
  - react:     localhost:5173  (vite dev server with HMR)
  - postgres:  localhost:5432
  - redis:     localhost:6379
  - celery:    (worker process)
  - minio:     localhost:9000  (S3-compatible for local dev)
```

---

## 15. Error Handling & Resilience

### 15.1 Error Hierarchy

```python
# common/exceptions.py

class EcoSphereError(Exception):
    """Base exception for all EcoSphere business errors."""
    status_code = 400

class InsufficientPointsError(EcoSphereError):
    code = "INSUFFICIENT_POINTS"

class OutOfStockError(EcoSphereError):
    code = "OUT_OF_STOCK"

class SelfApprovalError(EcoSphereError):
    code = "SELF_APPROVAL_NOT_ALLOWED"
    status_code = 403

class EvidenceRequiredError(EcoSphereError):
    code = "EVIDENCE_REQUIRED"

class InvalidStateTransitionError(EcoSphereError):
    code = "INVALID_STATE_TRANSITION"
```

### 15.2 Retry Strategy (Celery Tasks)

| Task Type | Retry | Max Retries | Backoff |
|---|---|---|---|
| Email notification | Yes | 3 | Exponential (30s, 60s, 120s) |
| Report generation | Yes | 2 | Fixed (60s) |
| Score recalculation | Yes | 3 | Exponential |
| Compliance check | No | — | Runs again next scheduled cycle |

---

## 16. Security Architecture

### 16.1 Security Measures

| Layer | Measure |
|---|---|
| **Transport** | HTTPS everywhere (TLS 1.3) |
| **Auth** | JWT in httpOnly, Secure, SameSite=Strict cookies |
| **CSRF** | Django CSRF middleware + SameSite cookies |
| **CORS** | Whitelist only the React SPA origin |
| **Input** | DRF serializer validation + Django model validation + DB constraints |
| **SQL Injection** | Django ORM (parameterized queries) — no raw SQL |
| **File Upload** | Type validation, size limits, virus scanning (optional), private S3 bucket |
| **Rate Limiting** | django-ratelimit on auth endpoints (5 attempts/minute) |
| **Secrets** | Environment variables via `.env` — never in code |
| **Audit Log** | All state changes logged with actor, timestamp, before/after values |

---

## Appendix: Key Decisions Log

| Decision | Chosen | Rationale |
|---|---|---|
| Architecture style | Modular monolith | Single team, shared DB, internal app — microservices add complexity with no benefit |
| API style | REST | Simpler than GraphQL for this domain shape; CRUD-heavy with well-defined resources |
| Auth mechanism | JWT in httpOnly cookies | More secure than localStorage tokens; works with SSR if ever needed |
| Score storage | Append-only | ESG compliance requires historical auditability — can't overwrite past scores |
| Side-effect pattern | Django signals | Decouples business events from their consequences; easy to test independently |
| File storage | S3-compatible object storage | Files don't belong in the database; S3 is cheap, scalable, and CDN-friendly |
| Task queue | Celery + Redis | Proven, mature, handles both async tasks and periodic scheduling |
| Real-time notifications | Polling (30s interval) | No WebSocket needed — internal dashboard, no sub-second urgency. Eliminates Daphne/Channels/ASGI complexity. TanStack Query `refetchInterval` handles it in one line |
