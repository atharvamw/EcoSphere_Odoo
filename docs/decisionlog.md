# EcoSphere — Technical Decision Log

This document records the significant architectural and technical decisions made during the design and implementation of the EcoSphere ESG Management Platform. It serves as a historical record and context provider for both human developers and AI agents.

---

## Logged Decisions

- [DEC-001: Backend Framework Choice (Django + DRF)](#dec-001-backend-framework-choice-django--drf)
- [DEC-002: Frontend Framework Choice (Vite + React SPA)](#dec-002-frontend-framework-choice-vite--react-spa)
- [DEC-003: Database Selection (PostgreSQL 16)](#dec-003-database-selection-postgresql-16)
- [DEC-004: UI Component Architecture (shadcn/ui + Radix)](#dec-004-ui-component-architecture-shadcnui--radix)
- [DEC-005: Async Tasks & Job Scheduling (Celery + Redis)](#dec-005-async-tasks--job-scheduling-celery--redis)
- [DEC-006: Real-time Communication (HTTP Polling over WebSockets)](#dec-006-real-time-communication-http-polling-over-websockets)

---

### DEC-001: Backend Framework Choice (Django + DRF)

* **Status:** Approved
* **Date:** 2026-07-12
* **Context:** The backend needs to serve a data-heavy ERP-style database schema with complex business rules, role-based access control, file storage integration, and automatic administrative dashboards.
* **Decision:** Selected **Django 5.2 LTS + Django REST Framework (DRF)**.
* **Rationale:** Django provides a robust, mature, built-in ORM with migration management, built-in admin interface (for quick master data management), authentication, and granular permission architectures out of the box. Building these from scratch using FastAPI or Express would require extensive boilerplate, slowing development.

---

### DEC-002: Frontend Framework Choice (Vite + React SPA)

* **Status:** Approved
* **Date:** 2026-07-12
* **Context:** The user interface is an authenticated dashboard. Search engine optimization (SEO) and server-side rendering (SSR) are not required.
* **Decision:** Selected **Vite 6 + React 19 (Single Page Application)**.
* **Rationale:** A pure client-side SPA simplifies deployment (it compiles to static files and can be hosted on a CDN or directly behind Nginx) and eliminates the overhead of managing a frontend Node.js server (which Meta-frameworks like Next.js would require). Vite offers extremely fast hot-module replacement (HMR) for development.

---

### DEC-003: Database Selection (PostgreSQL 16)

* **Status:** Approved
* **Date:** 2026-07-12
* **Context:** The application is heavily relational (e.g., department hierarchies, master/transactional split, audits to compliance issues). Business requirements dictate that score balances and reward stocks must never drop below zero.
* **Decision:** Selected **PostgreSQL 16**.
* **Rationale:** PostgreSQL supports native database-level `CHECK` constraints to enforce non-negative balances (preventing race conditions at the storage tier) and atomic row-locking (`SELECT ... FOR UPDATE`), which is critical for concurrent reward redemptions.

---

### DEC-004: UI Component Architecture (shadcn/ui + Radix)

* **Status:** Approved
* **Date:** 2026-07-12
* **Context:** EcoSphere requires a highly customized brand identity (Fraunces serif typography, ledger aesthetic, customized neutral and module color schemes) that does not match standard corporate SaaS UI packages.
* **Decision:** Selected **shadcn/ui (Radix Primitives + Tailwind CSS)**.
* **Rationale:** Unlike rigid UI libraries (like Material UI or Ant Design) which introduce proprietary design patterns and make color/style overrides difficult, shadcn/ui provides unstyled, accessible, copy-paste components that developers completely own. This allows styling components to match EcoSphere's specific brand guidelines without CSS conflicts.

---

### DEC-005: Async Tasks & Job Scheduling (Celery + Redis)

* **Status:** Approved
* **Date:** 2026-07-12
* **Context:** Heavy workloads (such as generating large PDF/Excel reports, sending notification emails, recalculating scores, and running daily checks for overdue compliance issues) must be executed asynchronously to keep the main web request thread fast.
* **Decision:** Selected **Celery 5.4 + Redis (Broker/Backend) + django-celery-beat**.
* **Rationale:** Celery is the standard Python distributed task queue. Allying it with `django-celery-beat` allows scheduling dynamic, database-backed periodic jobs directly within the Django ecosystem, which is necessary for automated compliance tracking and daily calculations.

---

### DEC-006: Real-time Communication (HTTP Polling over WebSockets)

* **Status:** Approved
* **Date:** 2026-07-12
* **Context:** The UI needs to display in-app notifications (e.g., badge unlocks, approvals, compliance issues). However, none of these notifications require sub-second real-time delivery (unlike chat apps).
* **Decision:** Selected **HTTP Polling (30s interval via TanStack Query) over WebSockets**.
* **Rationale:** WebSockets (via Django Channels + Daphne ASGI server) introduce significant infrastructure complexity: persistent open TCP connections, connection authentication state-sharing, sticky sessions, and Daphne configuration. Polling standard DRF endpoints every 30 seconds requires zero extra infrastructure, is stateless, scales easily, and has negligible resource impact at enterprise user scale.
