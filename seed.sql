-- Create Tables
CREATE TABLE IF NOT EXISTS featured_projects (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  case_study_url TEXT NOT NULL,
  prototype_url TEXT NOT NULL,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS design_gallery (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  year_label TEXT NOT NULL,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert Data for featured_projects
INSERT INTO featured_projects (slug, title, description, case_study_url, prototype_url, image_url, display_order, is_active, updated_at)
VALUES 
('lead-multimedia-designer', 'Lead Multimedia Designer', 'At Future Shift Labs and Yashoda AI, I deliver 20+ multi-channel assets per month and long-form whitepapers, ebooks, and reports with system-driven typography and layout precision.', 'https://abirmahanta.super.site', 'https://www.linkedin.com/in/itsmeabirmohanta', 'https://framerusercontent.com/images/qNPfgAxAvktkGOMgx3GR7ScCczU.png', 1, TRUE, NOW()),
('edu-revolution-portal', 'EDU Revolution Portal', 'Lead Developer and UI/UX Designer for an LPU achievement platform serving 50,000+ users, built with clear information hierarchy and a full visual identity system.', 'https://abirmahanta.super.site', 'https://www.linkedin.com/in/itsmeabirmohanta', 'https://framerusercontent.com/images/m3zQy5JHqbpLMbZJjWK4DeF6Kc8.png', 2, TRUE, NOW()),
('cpu-simulator', 'CPU Simulator', 'Designed and built an interactive 8-bit CPU learning platform with guided and advanced modes, real-time visual instruction flow, and educational onboarding.', 'https://cpusimulator.tech', 'https://cpusimulator.tech', 'https://framerusercontent.com/images/PlRys5HhpspLYIcVyyWwuSQiQo4.png', 3, TRUE, NOW()),
('freelance-design-practice', 'Freelance Design Practice', 'Delivered design solutions for 150+ clients across branding, whitepapers, paid ads, social campaigns, and presentation systems with print-ready and digital-first output standards.', 'mailto:abirmediagroup@gmail.com', 'https://abirmahanta.super.site', 'https://framerusercontent.com/images/guQ9V5qFnrkrzEI9XQ1DztYdCCc.png', 4, TRUE, NOW())
ON CONFLICT (slug) DO UPDATE SET 
  title = EXCLUDED.title, description = EXCLUDED.description, case_study_url = EXCLUDED.case_study_url, prototype_url = EXCLUDED.prototype_url, image_url = EXCLUDED.image_url, display_order = EXCLUDED.display_order, is_active = TRUE, updated_at = NOW();

-- Insert Data for design_gallery
INSERT INTO design_gallery (slug, title, year_label, image_url, display_order, is_active, updated_at)
VALUES
('flipkart-axis-credit-card-store', 'Flipkart-Axis Credit Card Store', '2020', 'https://framerusercontent.com/images/dl7MLlrL1Ps7e3TQ9jBVmm6Xcc.png?scale-down-to=512', 1, TRUE, NOW()),
('insurance-marketplace-on-flipkart', 'End-to-End Insurance Marketplace on Flipkart', '2021', 'https://framerusercontent.com/images/8LOLCvqoOQ4waqH6VPqWNQcFs.png?scale-down-to=512', 2, TRUE, NOW()),
('one-stop-credit-shop-on-flipkart', 'One-Stop Credit Shop on Flipkart', '2021', 'https://framerusercontent.com/images/CSW2F9YojQ5a8yZgqFq21irP2WY.png?scale-down-to=512', 3, TRUE, NOW()),
('motor-insurance-simplified-for-flipkart', 'Motor Insurance Simplified for Flipkart', '2020', 'https://framerusercontent.com/images/e2kwTmq40715rIVYKOkWj0dHvUE.png?scale-down-to=512', 4, TRUE, NOW()),
('lead-management-system-oyo-workspaces', 'Lead Management System for OYO Workspaces', '2020', 'https://framerusercontent.com/images/F5OiEyhxnc4SknEatc1Ks27zt2M.png?scale-down-to=512', 5, TRUE, NOW()),
('credit-based-upi-buy-now-pay-later', 'Credit-Based UPI: Buy Now, Pay Later on Flipkart', '2020', 'https://framerusercontent.com/images/GhnurbPFS7Gr3CqW5XIceVeY.png?scale-down-to=512', 6, TRUE, NOW()),
('complaint-management-system-oyo', 'Complaint Management System for OYO', '2019', 'https://framerusercontent.com/images/ReOxGXBb7FRiMVBh8sGnXi454o.png?scale-down-to=512', 7, TRUE, NOW()),
('cleartrip-desktop-homepage-refresh', 'Cleartrip''s Desktop Homepage Refresh', '2022', 'https://framerusercontent.com/images/m3zQy5JHqbpLMbZJjWK4DeF6Kc8.png?scale-down-to=512', 8, TRUE, NOW()),
('cleartrip-home-and-accounts', 'Cleartrip Home and Accounts', '2021', 'https://framerusercontent.com/images/guQ9V5qFnrkrzEI9XQ1DztYdCCc.png?scale-down-to=512', 9, TRUE, NOW()),
('flight-listing-page-cleartrip', 'Flight Listing Page Exploration for Cleartrip', '2023', 'https://framerusercontent.com/images/PlRys5HhpspLYIcVyyWwuSQiQo4.png?scale-down-to=512', 10, TRUE, NOW()),
('upcoming-bookings-cleartrip', 'Upcoming Bookings on Cleartrip', '2023', 'https://framerusercontent.com/images/xgAIcSxNaRlNcgYssYNB000kEnA.png?scale-down-to=512', 11, TRUE, NOW()),
('airline-fare-families-cleartrip', 'Introducing Airline Fare Families on Cleartrip', '2023', 'https://framerusercontent.com/images/f7XxQn2y493zwpVxv1cgHlKp4.png?scale-down-to=512', 12, TRUE, NOW())
ON CONFLICT (slug) DO UPDATE SET 
  title = EXCLUDED.title, year_label = EXCLUDED.year_label, image_url = EXCLUDED.image_url, display_order = EXCLUDED.display_order, is_active = TRUE, updated_at = NOW();
