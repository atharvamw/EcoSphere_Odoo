# Database Directory — EcoSphere ESG Platform
**Owner:** Shubham (DBA)

## Contents
*   `init.sql` — Initial PostgreSQL schema configuration including relations, database constraints, and custom indexes.
*   `seeds/` — (To be implemented) Mock records for testing.

## Database Spin-up
Run the database using Docker Compose from the root workspace directory:
```bash
docker-compose up postgres
```
This mounts `init.sql` directly into PostgreSQL's initialization entry point `/docker-entrypoint-initdb.d/`, running the schema setup automatically.
