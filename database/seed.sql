-- EcoSphere ESG Management Platform
-- Seed Data Configuration (PostgreSQL 16)
-- Managed by Shubham (DBA) & Suraj (Backend)

-- Clean out existing data before seeding (optional, in order of dependency)
TRUNCATE TABLE reward_redemption, employee_badge, department_score, compliance_issue, 
               audit, policy_acknowledgement, challenge_participation, goal, 
               challenge, employee_participation, csr_activity, environmental_goal, 
               carbon_transaction, esg_policy, reward, badge, goal_definition, 
               category, emission_factor, product_esg_profile, product, site_settings, 
               employee, department CASCADE;

-- ==========================================
-- 1. SITE SETTINGS
-- ==========================================
INSERT INTO site_settings (id, auto_emission_calculation_enabled, evidence_requirement_enabled, badge_auto_award_enabled, environmental_weight, social_weight, governance_weight)
VALUES (
    'aa44aa44-bb55-cc66-dd77-ee88ee88ee88',
    TRUE,
    TRUE,
    TRUE,
    0.4000,
    0.3000,
    0.3000
);

-- ==========================================
-- 2. DEPARTMENTS & EMPLOYEES (Base Setup)
-- ==========================================
-- Insert Departments first (without head_employee_id to prevent constraint issues)
INSERT INTO department (id, name, code, parent_department_id, employee_count, status) VALUES
('d1111111-2222-3333-4444-555555555555', 'Corporate HQ', 'CORP', NULL, 3, 'active'),
('d2222222-2222-3333-4444-555555555555', 'Manufacturing', 'MFG', NULL, 150, 'active'),
('d3333333-2222-3333-4444-555555555555', 'Logistics & Fleet', 'LOG', 'd2222222-2222-3333-4444-555555555555', 45, 'active');

-- Insert Employees (with dummy Django user UUIDs)
INSERT INTO employee (id, user_id, department_id, xp_total, points_balance, role) VALUES
('e1111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'd1111111-2222-3333-4444-555555555555', 1000, 300, 'admin'),
('e2222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000002', 'd2222222-2222-3333-4444-555555555555', 450, 150, 'manager'),
('e3333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000003', 'd3333333-2222-3333-4444-555555555555', 150, 50, 'employee'),
('e4444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000004', 'd2222222-2222-3333-4444-555555555555', 50, 20, 'employee');

-- Update Department Head IDs
UPDATE department SET head_employee_id = 'e1111111-1111-1111-1111-111111111111' WHERE code = 'CORP';
UPDATE department SET head_employee_id = 'e2222222-2222-2222-2222-222222222222' WHERE code = 'MFG';
UPDATE department SET head_employee_id = 'e3333333-3333-3333-3333-333333333333' WHERE code = 'LOG';

-- ==========================================
-- 3. PRODUCTS & ESG PROFILES
-- ==========================================
INSERT INTO product (id, name, code, sku, status) VALUES
('p1111111-aaaa-bbbb-cccc-dddddddddddd', 'Eco Carton Packaging 1L', 'PKG-CART-1L', 'SKU-001-CART', 'active'),
('p2222222-aaaa-bbbb-cccc-dddddddddddd', 'Standard Glass Bottle 500ml', 'GLS-BTL-500', 'SKU-002-GLASS', 'active'),
('p3333333-aaaa-bbbb-cccc-dddddddddddd', 'Recycled PET Bottle 1L', 'PET-RECY-1L', 'SKU-003-RPET', 'active');

INSERT INTO product_esg_profile (id, product_id, carbon_footprint_co2e, recycled_content_pct, has_biodegradable_packaging, hazardous_materials_flag) VALUES
('f1111111-aaaa-bbbb-cccc-dddddddddddd', 'p1111111-aaaa-bbbb-cccc-dddddddddddd', 0.1200, 85.00, TRUE, FALSE),
('f2222222-aaaa-bbbb-cccc-dddddddddddd', 'p2222222-aaaa-bbbb-cccc-dddddddddddd', 0.4500, 30.00, FALSE, FALSE),
('f3333333-aaaa-bbbb-cccc-dddddddddddd', 'p3333333-aaaa-bbbb-cccc-dddddddddddd', 0.0800, 100.00, TRUE, FALSE);

-- ==========================================
-- 4. EMISSION FACTORS
-- ==========================================
INSERT INTO emission_factor (id, name, source_type, factor_value, unit, standard_reference) VALUES
('ef111111-1111-1111-1111-111111111111', 'Grid Electricity (Average)', 'Expense', 0.450000, 'kg CO2e / kWh', 'GHG Protocol - Grid 2026'),
('ef222222-2222-2222-2222-222222222222', 'Commercial Fleet Diesel', 'Fleet', 2.680000, 'kg CO2e / liter', 'EPA Fuel Emission Factors 2025'),
('ef333333-3333-3333-3333-333333333333', 'Natural Gas Consumption', 'Manufacturing', 2.030000, 'kg CO2e / m3', 'DEFRA Emission Factors 2026');

-- ==========================================
-- 5. CATEGORIES
-- ==========================================
INSERT INTO category (id, name, type, status) VALUES
('c1111111-1111-1111-1111-111111111111', 'Environmental Volunteering', 'CSR Activity', 'active'),
('c2222222-2222-2222-2222-222222222222', 'Community Outreaches', 'CSR Activity', 'active'),
('c3333333-3333-3333-3333-333333333333', 'Waste Reduction Sprint', 'Challenge', 'active'),
('c4444444-4444-4444-4444-444444444444', 'Eco-Commute Initiatives', 'Challenge', 'active');

-- ==========================================
-- 6. GOAL DEFINITIONS
-- ==========================================
INSERT INTO goal_definition (id, name, source_model, source_field, computation, scope, suffix) VALUES
('gd111111-1111-1111-1111-111111111111', 'CSR Activities Completed', 'employee_participation', 'id', 'count', 'employee', 'activities'),
('gd222222-2222-2222-2222-222222222222', 'Carbon Reduction', 'carbon_transaction', 'co2e_amount', 'sum', 'department', 'kg CO2e'),
('gd333333-3333-3333-3333-333333333333', 'Policy Acknowledgements Filed', 'policy_acknowledgement', 'id', 'count', 'employee', 'acknowledgements');

-- ==========================================
-- 7. REWARDS & BADGES
-- ==========================================
INSERT INTO reward (id, name, description, points_required, stock, status) VALUES
('r1111111-1111-1111-1111-111111111111', 'Eco Bamboo Water Bottle', 'Earthy design bamboo exterior with vacuum insulated stainless steel interior. Sustainable replacement for plastic bottles.', 100, 50, 'active'),
('r2222222-2222-2222-2222-222222222222', 'Tree Plantation Certificate', 'A tree will be planted in your name under the Green Canopy Project. Includes a digital PDF certificate with coordinates.', 50, 999, 'active'),
('r3333333-3333-3333-3333-333333333333', 'Recycled Canvas Tote Bag', 'Extremely durable, lightweight shopping bag made from 100% ocean-bound recycled plastic and canvas.', 80, 0, 'active'); -- Out of stock for testing edge cases

INSERT INTO badge (id, name, description, unlock_rule_type, unlock_goal_definition_id, unlock_threshold, grant_permission, limitation_number, icon_path) VALUES
('b1111111-1111-1111-1111-111111111111', 'Green Starter', 'Awarded automatically on completing your first certified CSR Activity.', 'CSR Activities Completed', 'gd111111-1111-1111-1111-111111111111', 1.0000, 'anyone', NULL, '/static/badges/green_starter.svg'),
('b2222222-2222-2222-2222-222222222222', 'Compliance Champion', 'Awarded automatically when acknowledging 3 separate regulatory governance policies.', 'Policy Acknowledgements Filed', 'gd333333-3333-3333-3333-333333333333', 3.0000, 'anyone', NULL, '/static/badges/compliance_champ.svg');

-- ==========================================
-- 8. ESG POLICIES
-- ==========================================
INSERT INTO esg_policy (id, title, content, version, effective_date, status) VALUES
('pol11111-1111-1111-1111-111111111111', 'Environmental Code of Conduct', 'This policy establishes standards for waste segregation, reduction of single-use plastics, and natural resource conservation across all branch facilities...', 'v1.0', '2026-01-01', 'active'),
('pol22222-2222-2222-2222-222222222222', 'Anti-Bribery and Anti-Corruption Policy', 'Our firm enforces a zero-tolerance policy against corruption and compliance violations. All employees are required to declare business gifts and report violations...', 'v2.1', '2026-03-15', 'active');
