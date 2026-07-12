-- EcoSphere ESG Management Platform
-- Initial Schema Definition (PostgreSQL 16)
-- Managed by Shubham (DBA)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. MASTER DATA TABLES
-- ==========================================

-- Department Table
CREATE TABLE IF NOT EXISTS department (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    head_employee_id UUID, -- FK set later to avoid circular dependency
    parent_department_id UUID REFERENCES department(id) ON DELETE SET NULL,
    employee_count INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active'
);

-- Employee Table
CREATE TABLE IF NOT EXISTS employee (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE, -- Links to Django's auth_user id
    department_id UUID REFERENCES department(id) ON DELETE SET NULL,
    xp_total INT DEFAULT 0 CONSTRAINT chk_xp_non_negative CHECK (xp_total >= 0),
    points_balance INT DEFAULT 0 CONSTRAINT chk_points_non_negative CHECK (points_balance >= 0),
    role VARCHAR(100) NOT NULL DEFAULT 'employee'
);

-- Add Circular Foreign Key for Department Head
ALTER TABLE department ADD CONSTRAINT fk_dept_head 
    FOREIGN KEY (head_employee_id) REFERENCES employee(id) ON DELETE SET NULL;

-- Site Settings Table (Global Config)
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auto_emission_calculation_enabled BOOLEAN DEFAULT TRUE,
    evidence_requirement_enabled BOOLEAN DEFAULT TRUE,
    badge_auto_award_enabled BOOLEAN DEFAULT TRUE,
    environmental_weight DECIMAL(5, 4) NOT NULL DEFAULT 0.4000,
    social_weight DECIMAL(5, 4) NOT NULL DEFAULT 0.3000,
    governance_weight DECIMAL(5, 4) NOT NULL DEFAULT 0.3000,
    CONSTRAINT chk_weights_sum CHECK (environmental_weight + social_weight + governance_weight = 1.0)
);

-- Product Table
CREATE TABLE IF NOT EXISTS product (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) NOT NULL UNIQUE,
    sku VARCHAR(100) UNIQUE,
    status VARCHAR(50) DEFAULT 'active'
);

-- Product ESG Profile Table
CREATE TABLE IF NOT EXISTS product_esg_profile (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID UNIQUE REFERENCES product(id) ON DELETE CASCADE,
    carbon_footprint_co2e DECIMAL(12, 4) DEFAULT 0 CONSTRAINT chk_carbon_footprint_non_negative CHECK (carbon_footprint_co2e >= 0),
    recycled_content_pct DECIMAL(5, 2) DEFAULT 0 CONSTRAINT chk_recycled_content_range CHECK (recycled_content_pct BETWEEN 0 AND 100),
    has_biodegradable_packaging BOOLEAN DEFAULT FALSE,
    hazardous_materials_flag BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Emission Factor Table
CREATE TABLE IF NOT EXISTS emission_factor (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    source_type VARCHAR(100) NOT NULL, -- e.g. Purchase, Fleet, Mfg
    factor_value DECIMAL(12, 6) NOT NULL,
    unit VARCHAR(50) NOT NULL, -- e.g. kg CO2e / kWh
    standard_reference VARCHAR(255)
);

-- Category Table (Shared categories)
CREATE TABLE IF NOT EXISTS category (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL, -- 'CSR Activity' or 'Challenge'
    status VARCHAR(50) DEFAULT 'active'
);

-- Goal Definition Table
CREATE TABLE IF NOT EXISTS goal_definition (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    source_model VARCHAR(100) NOT NULL,
    source_field VARCHAR(100) NOT NULL,
    computation VARCHAR(50) NOT NULL, -- count, sum, average
    scope VARCHAR(50) NOT NULL, -- individual, department
    suffix VARCHAR(50) -- e.g. 'activities', 'kg CO2e'
);

-- Badge Table
CREATE TABLE IF NOT EXISTS badge (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    unlock_rule_type VARCHAR(100) NOT NULL, -- e.g., XP, completed-challenge
    unlock_goal_definition_id UUID REFERENCES goal_definition(id) ON DELETE SET NULL,
    unlock_threshold DECIMAL(12, 4) NOT NULL,
    grant_permission VARCHAR(100) DEFAULT 'anyone',
    limitation_number INT, -- e.g., max 3 per month
    icon_path VARCHAR(255)
);

-- Reward Table
CREATE TABLE IF NOT EXISTS reward (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    points_required INT NOT NULL CONSTRAINT chk_points_req_positive CHECK (points_required > 0),
    stock INT DEFAULT 0 CONSTRAINT chk_stock_non_negative CHECK (stock >= 0),
    status VARCHAR(50) DEFAULT 'active'
);

-- ESG Policy Table
CREATE TABLE IF NOT EXISTS esg_policy (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    version VARCHAR(20) NOT NULL,
    effective_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'active'
);


-- ==========================================
-- 2. TRANSACTIONAL DATA TABLES
-- ==========================================

-- Carbon Transaction Table
CREATE TABLE IF NOT EXISTS carbon_transaction (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id UUID REFERENCES department(id) ON DELETE SET NULL,
    emission_factor_id UUID REFERENCES emission_factor(id) ON DELETE SET NULL,
    quantity DECIMAL(12, 4) NOT NULL,
    co2e_amount DECIMAL(12, 4) NOT NULL,
    source_record_type VARCHAR(100), -- Purchase, Fleet, Manufacturing
    source_record_id UUID,
    is_manual_override BOOLEAN DEFAULT FALSE,
    override_reason TEXT,
    transaction_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Environmental Goal Table
CREATE TABLE IF NOT EXISTS environmental_goal (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    department_id UUID REFERENCES department(id) ON DELETE CASCADE,
    target_value DECIMAL(12, 4) NOT NULL,
    current_value DECIMAL(12, 4) DEFAULT 0,
    unit VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'active'
);

-- CSR Activity Table
CREATE TABLE IF NOT EXISTS csr_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    department_id UUID REFERENCES department(id) ON DELETE SET NULL,
    category_id UUID REFERENCES category(id) ON DELETE SET NULL,
    description TEXT,
    activity_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'draft',
    points_value INT DEFAULT 0
);

-- Employee CSR Participation Table
CREATE TABLE IF NOT EXISTS employee_participation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employee(id) ON DELETE CASCADE,
    activity_id UUID REFERENCES csr_activity(id) ON DELETE CASCADE,
    approval_status VARCHAR(50) DEFAULT 'pending',
    points_earned INT DEFAULT 0,
    approved_by_id UUID REFERENCES employee(id) ON DELETE SET NULL,
    approved_at TIMESTAMP,
    proof_file_path VARCHAR(255),
    completion_date DATE
);

-- Challenge Table
CREATE TABLE IF NOT EXISTS challenge (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    category_id UUID REFERENCES category(id) ON DELETE SET NULL,
    department_id UUID REFERENCES department(id) ON DELETE SET NULL,
    description TEXT,
    xp INT NOT NULL DEFAULT 50,
    difficulty VARCHAR(50) DEFAULT 'easy',
    periodicity VARCHAR(50) DEFAULT 'one-time',
    assignment_rule VARCHAR(100) DEFAULT 'all',
    evidence_required BOOLEAN DEFAULT TRUE,
    start_date DATE NOT NULL,
    deadline DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'draft'
);

-- Challenge Goal Configuration
CREATE TABLE IF NOT EXISTS goal (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    goal_definition_id UUID REFERENCES goal_definition(id) ON DELETE CASCADE,
    challenge_id UUID REFERENCES challenge(id) ON DELETE CASCADE,
    condition VARCHAR(50) NOT NULL, -- >=, <=
    target_value DECIMAL(12, 4) NOT NULL,
    current_value DECIMAL(12, 4) DEFAULT 0
);

-- Challenge Participation Table
CREATE TABLE IF NOT EXISTS challenge_participation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    challenge_id UUID REFERENCES challenge(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES employee(id) ON DELETE CASCADE,
    progress DECIMAL(5, 2) DEFAULT 0.00,
    proof_file_path VARCHAR(255),
    approval_status VARCHAR(50) DEFAULT 'pending',
    approved_by_id UUID REFERENCES employee(id) ON DELETE SET NULL,
    xp_awarded INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active'
);

-- Policy Acknowledgement Table
CREATE TABLE IF NOT EXISTS policy_acknowledgement (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    policy_id UUID REFERENCES esg_policy(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES employee(id) ON DELETE CASCADE,
    acknowledged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    signature VARCHAR(255) NOT NULL
);

-- Audit Table
CREATE TABLE IF NOT EXISTS audit (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id UUID REFERENCES department(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    audit_type VARCHAR(100) NOT NULL,
    audit_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'in-progress',
    auditor_id UUID REFERENCES employee(id) ON DELETE SET NULL,
    findings TEXT
);

-- Compliance Issue Table
CREATE TABLE IF NOT EXISTS compliance_issue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    audit_id UUID REFERENCES audit(id) ON DELETE CASCADE,
    owner_employee_id UUID NOT NULL REFERENCES employee(id) ON DELETE CASCADE,
    severity VARCHAR(50) NOT NULL, -- high, medium, low
    description TEXT NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'open',
    resolved_at TIMESTAMP
);

-- Department Score (Point-in-time calculation)
CREATE TABLE IF NOT EXISTS department_score (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id UUID REFERENCES department(id) ON DELETE CASCADE,
    environmental_score DECIMAL(5, 2) DEFAULT 0 CONSTRAINT chk_env_score_range CHECK (environmental_score BETWEEN 0 AND 100),
    social_score DECIMAL(5, 2) DEFAULT 0 CONSTRAINT chk_soc_score_range CHECK (social_score BETWEEN 0 AND 100),
    governance_score DECIMAL(5, 2) DEFAULT 0 CONSTRAINT chk_gov_score_range CHECK (governance_score BETWEEN 0 AND 100),
    total_score DECIMAL(5, 2) DEFAULT 0,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Employee Badge (Earned Achievements)
CREATE TABLE IF NOT EXISTS employee_badge (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employee(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES badge(id) ON DELETE CASCADE,
    awarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    granted_by_id UUID REFERENCES employee(id) ON DELETE SET NULL,
    award_type VARCHAR(50) DEFAULT 'auto' -- auto or manual
);

-- Reward Redemption Table
CREATE TABLE IF NOT EXISTS reward_redemption (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employee(id) ON DELETE CASCADE,
    reward_id UUID REFERENCES reward(id) ON DELETE CASCADE,
    points_spent INT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending_fulfillment',
    redeemed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fulfilled_at TIMESTAMP
);


-- ==========================================
-- 3. INDEXES FOR SPEED AND QUERY OPTIMIZATION
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_carbon_tx_dept_date ON carbon_transaction (department_id, transaction_date);
CREATE INDEX IF NOT EXISTS idx_participation_employee ON employee_participation (employee_id, approval_status);
CREATE INDEX IF NOT EXISTS idx_challenge_status ON challenge (status, deadline);
CREATE INDEX IF NOT EXISTS idx_compliance_due ON compliance_issue (due_date, status);
CREATE INDEX IF NOT EXISTS idx_dept_score_period ON department_score (department_id, period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_employee_badge ON employee_badge (employee_id, badge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_part_employee ON challenge_participation (employee_id, status);
CREATE UNIQUE INDEX IF NOT EXISTS idx_product_esg_profile_product ON product_esg_profile (product_id);
