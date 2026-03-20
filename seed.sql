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
('yashoda-ai-quiz-platform', 'YASHODA AI Quiz Platform', 'Developed an interactive quiz platform to support AI literacy programs, featuring structured assessments and user-friendly navigation. Designed to engage learners while enabling scalable evaluation of participant understanding.', 'https://quiz.yashoda.live/', 'https://quiz.yashoda.live/', '/featured_projects/1.jpeg', 1, TRUE, NOW()),
('investment-dashboard', 'Investment Dashboard', 'Built a data-driven investment dashboard that visualizes financial insights through an intuitive interface. Integrated key metrics and structured layouts to help users track and interpret investment performance effectively.', 'https://investmentdashboard.abirmahanta.site/', 'https://investmentdashboard.abirmahanta.site/', '/featured_projects/2.jpeg', 2, TRUE, NOW()),
('dr-anand-shukla-portfolio-website', 'Dr. Anand Shukla Portfolio Website', 'Designed and developed a professional portfolio website showcasing academic, professional, and thought leadership work. Focused on clean UI, structured content hierarchy, and credibility-driven presentation.', 'https://dranandshukla.netlify.app/', 'https://dranandshukla.netlify.app/', '/featured_projects/3.jpeg', 3, TRUE, NOW()),
('cpu-simulator', 'CPU Simulator', 'Developed an interactive web-based CPU simulator that visualizes core computer architecture concepts such as instruction execution and memory operations. Designed to simplify complex low-level processes for learners through an intuitive UI and real-time simulation.', 'https://cpusimulator.tech/', 'https://cpusimulator.tech/', '/featured_projects/4.jpeg', 4, TRUE, NOW()),
('abhaya-indane-website', 'Abhaya Indane Website', 'Built a responsive business website for an LPG distribution service, focusing on accessibility, clear service communication, and streamlined user navigation. Optimized for local users with essential information, contact flows, and trust-building design elements.', 'https://abhayaindane.co.in/', 'https://abhayaindane.co.in/', '/featured_projects/5.jpeg', 5, TRUE, NOW()),
('yashoda-ai-certificate-platform', 'YASHODA AI Certificate Platform', 'Created a dynamic certificate generation platform that automates personalized certificate issuance at scale. Implemented user input handling and real-time rendering to support large-scale digital literacy initiatives.', 'https://certificate.yashoda.live/', 'https://certificate.yashoda.live/', '/featured_projects/6.jpeg', 6, TRUE, NOW())
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
