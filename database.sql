-- =============================================================
-- দুর্যোগ সাড়া — Disaster Response Coordination Platform
-- MySQL 8+ Database Schema + Demo Seed Data
-- =============================================================

CREATE DATABASE IF NOT EXISTS disaster_response
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE disaster_response;

-- ----------------------------------------------------------------
-- users
-- ----------------------------------------------------------------
CREATE TABLE users (
  id            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  name          VARCHAR(120)    NOT NULL,
  email         VARCHAR(120)    NOT NULL UNIQUE,
  phone         VARCHAR(20)             DEFAULT NULL,
  password_hash VARCHAR(255)    NOT NULL,
  role          ENUM('citizen','volunteer','admin') NOT NULL DEFAULT 'citizen',
  profile_image VARCHAR(500)            DEFAULT NULL,
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------
-- locations
-- ----------------------------------------------------------------
CREATE TABLE locations (
  id         INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  name       VARCHAR(200)  NOT NULL,
  district   VARCHAR(80)   NOT NULL,
  division   VARCHAR(80)   NOT NULL,
  latitude   DECIMAL(9,6)  NOT NULL,
  longitude  DECIMAL(9,6)  NOT NULL,
  created_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------
-- reports
-- ----------------------------------------------------------------
CREATE TABLE reports (
  id               INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  report_code      VARCHAR(20)     NOT NULL UNIQUE,
  citizen_id       INT UNSIGNED    NOT NULL,
  disaster_type    ENUM('বন্যা','ঘূর্ণিঝড়','নদীভাঙন','জলাবদ্ধতা','ভূমিধস','অন্যান্য') NOT NULL,
  title            VARCHAR(250)    NOT NULL,
  description      TEXT            NOT NULL,
  affected_people  INT UNSIGNED    NOT NULL DEFAULT 0,
  status           ENUM('pending','verified','rejected','in_progress','completed') NOT NULL DEFAULT 'pending',
  severity         ENUM('unassessed','low','medium','high','critical') NOT NULL DEFAULT 'unassessed',
  severity_score   TINYINT UNSIGNED                DEFAULT NULL,
  district         VARCHAR(80)   NOT NULL,
  latitude         DECIMAL(9,6)    NOT NULL,
  longitude        DECIMAL(9,6)    NOT NULL,
  location_name    VARCHAR(200)    NOT NULL,
  created_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_reports_citizen FOREIGN KEY (citizen_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_reports_status   ON reports (status);
CREATE INDEX idx_reports_severity ON reports (severity);
CREATE INDEX idx_reports_citizen  ON reports (citizen_id);

-- ----------------------------------------------------------------
-- report_images
-- ----------------------------------------------------------------
CREATE TABLE report_images (
  id         INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  report_id  INT UNSIGNED  NOT NULL,
  image_url  VARCHAR(500)  NOT NULL,
  created_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_rimages_report FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------
-- tasks
-- ----------------------------------------------------------------
CREATE TABLE tasks (
  id           INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  task_code    VARCHAR(20)    NOT NULL UNIQUE,
  report_id    INT UNSIGNED            DEFAULT NULL,
  title        VARCHAR(250)   NOT NULL,
  description  TEXT           NOT NULL,
  instructions TEXT                    DEFAULT NULL,
  priority     ENUM('low','medium','high','critical') NOT NULL DEFAULT 'medium',
  status       ENUM('assigned','en_route','in_progress','completed') NOT NULL DEFAULT 'assigned',
  progress     TINYINT UNSIGNED NOT NULL DEFAULT 0,
  location_id  INT UNSIGNED            DEFAULT NULL,
  created_by   INT UNSIGNED   NOT NULL,
  created_at   DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_tasks_report    FOREIGN KEY (report_id)   REFERENCES reports(id)    ON DELETE SET NULL,
  CONSTRAINT fk_tasks_location  FOREIGN KEY (location_id) REFERENCES locations(id)  ON DELETE SET NULL,
  CONSTRAINT fk_tasks_creator   FOREIGN KEY (created_by)  REFERENCES users(id)      ON DELETE RESTRICT,
  CONSTRAINT chk_task_progress  CHECK (progress BETWEEN 0 AND 100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_tasks_status   ON tasks (status);
CREATE INDEX idx_tasks_report   ON tasks (report_id);

-- ----------------------------------------------------------------
-- task_assignments
-- ----------------------------------------------------------------
CREATE TABLE task_assignments (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  task_id      INT UNSIGNED NOT NULL,
  volunteer_id INT UNSIGNED NOT NULL,
  assigned_by  INT UNSIGNED NOT NULL,
  assigned_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_task_volunteer (task_id, volunteer_id),
  CONSTRAINT fk_ta_task      FOREIGN KEY (task_id)      REFERENCES tasks(id) ON DELETE CASCADE,
  CONSTRAINT fk_ta_volunteer FOREIGN KEY (volunteer_id) REFERENCES users(id) ON DELETE RESTRICT,
  CONSTRAINT fk_ta_assigner  FOREIGN KEY (assigned_by)  REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------
-- field_issues
-- ----------------------------------------------------------------
CREATE TABLE field_issues (
  id            INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  issue_code    VARCHAR(20)   NOT NULL UNIQUE,
  reported_by   INT UNSIGNED  NOT NULL,
  task_id       INT UNSIGNED          DEFAULT NULL,
  report_id     INT UNSIGNED          DEFAULT NULL,
  issue_type    ENUM('road_blocked','extra_relief','medical','boat_needed','more_volunteers','other') NOT NULL,
  description   TEXT          NOT NULL,
  location_name VARCHAR(200)          DEFAULT NULL,
  latitude      DECIMAL(9,6)          DEFAULT NULL,
  longitude     DECIMAL(9,6)          DEFAULT NULL,
  image_url     VARCHAR(500)          DEFAULT NULL,
  status        ENUM('reported','in_progress','resolved') NOT NULL DEFAULT 'reported',
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_fi_reporter FOREIGN KEY (reported_by) REFERENCES users(id)    ON DELETE RESTRICT,
  CONSTRAINT fk_fi_task     FOREIGN KEY (task_id)     REFERENCES tasks(id)    ON DELETE SET NULL,
  CONSTRAINT fk_fi_report   FOREIGN KEY (report_id)   REFERENCES reports(id)  ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------
-- severity_assessments
-- ----------------------------------------------------------------
CREATE TABLE severity_assessments (
  id                      INT UNSIGNED NOT NULL AUTO_INCREMENT,
  report_id               INT UNSIGNED NOT NULL UNIQUE,
  affected_people_score   TINYINT UNSIGNED NOT NULL,
  damage_score            TINYINT UNSIGNED NOT NULL,
  medical_emergency_score TINYINT UNSIGNED NOT NULL,
  road_access_score       TINYINT UNSIGNED NOT NULL,
  shelter_score           TINYINT UNSIGNED NOT NULL,
  total_score             TINYINT UNSIGNED NOT NULL,
  severity_level          ENUM('low','medium','high','critical') NOT NULL,
  assessed_by             INT UNSIGNED NOT NULL,
  created_at              DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at              DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_sa_report   FOREIGN KEY (report_id)   REFERENCES reports(id) ON DELETE CASCADE,
  CONSTRAINT fk_sa_assessor FOREIGN KEY (assessed_by) REFERENCES users(id)   ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------
-- resources
-- ----------------------------------------------------------------
CREATE TABLE resources (
  id          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  name        VARCHAR(120)  NOT NULL,
  category    ENUM('food','water','medical','other') NOT NULL,
  unit        VARCHAR(40)   NOT NULL,
  description TEXT                  DEFAULT NULL,
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------
-- inventory
-- ----------------------------------------------------------------
CREATE TABLE inventory (
  id          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  resource_id INT UNSIGNED  NOT NULL,
  quantity    INT UNSIGNED  NOT NULL DEFAULT 0,
  depot_name  VARCHAR(200)  NOT NULL,
  location_id INT UNSIGNED          DEFAULT NULL,
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_inv_resource FOREIGN KEY (resource_id) REFERENCES resources(id)  ON DELETE RESTRICT,
  CONSTRAINT fk_inv_location FOREIGN KEY (location_id) REFERENCES locations(id)  ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------
-- inventory_transactions
-- ----------------------------------------------------------------
CREATE TABLE inventory_transactions (
  id               INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  inventory_id     INT UNSIGNED  NOT NULL,
  transaction_type ENUM('addition','allocation','adjustment') NOT NULL,
  quantity         INT           NOT NULL,
  reference_type   VARCHAR(50)           DEFAULT NULL,
  reference_id     INT UNSIGNED          DEFAULT NULL,
  created_by       INT UNSIGNED  NOT NULL,
  created_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_it_inventory FOREIGN KEY (inventory_id) REFERENCES inventory(id) ON DELETE RESTRICT,
  CONSTRAINT fk_it_creator   FOREIGN KEY (created_by)   REFERENCES users(id)     ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------
-- resource_allocations
-- ----------------------------------------------------------------
CREATE TABLE resource_allocations (
  id               INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  allocation_code  VARCHAR(20)   NOT NULL UNIQUE,
  report_id        INT UNSIGNED          DEFAULT NULL,
  resource_id      INT UNSIGNED  NOT NULL,
  quantity         INT UNSIGNED  NOT NULL,
  allocated_by     INT UNSIGNED  NOT NULL,
  status           ENUM('allocated','cancelled') NOT NULL DEFAULT 'allocated',
  created_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_ra_report   FOREIGN KEY (report_id)   REFERENCES reports(id)   ON DELETE SET NULL,
  CONSTRAINT fk_ra_resource FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE RESTRICT,
  CONSTRAINT fk_ra_allocator FOREIGN KEY (allocated_by) REFERENCES users(id)   ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------
-- notifications
-- ----------------------------------------------------------------
CREATE TABLE notifications (
  id             INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  user_id        INT UNSIGNED  NOT NULL,
  title          VARCHAR(200)  NOT NULL,
  message        TEXT          NOT NULL,
  type           ENUM('info','success','warning','alert') NOT NULL DEFAULT 'info',
  reference_type VARCHAR(50)           DEFAULT NULL,
  reference_id   INT UNSIGNED          DEFAULT NULL,
  is_read        TINYINT(1)    NOT NULL DEFAULT 0,
  created_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_notif_user_read ON notifications (user_id, is_read);

-- ================================================================
-- DEMO SEED DATA
-- ================================================================

-- ----------------------------------------------------------------
-- Demo users
-- Passwords are all: demo1234
-- bcrypt hash of "demo1234" (12 rounds)
-- ----------------------------------------------------------------
INSERT INTO users (name, email, phone, password_hash, role) VALUES
('রাকিবুল হাসান',  'citizen@example.com',   '01711-234567', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4NQRJvGmGu', 'citizen'),
('তানজিলা খানম',   'volunteer@example.com', '01812-345678', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4NQRJvGmGu', 'volunteer'),
('ডাঃ শামীম রেজা', 'admin@example.com',     '01611-456789', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4NQRJvGmGu', 'admin'),
('নাসরিন আক্তার',  'nasrin@example.com',    '01911-111222', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4NQRJvGmGu', 'citizen'),
('তানভীর আহমেদ',   'tanvir@example.com',    '01711-333444', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4NQRJvGmGu', 'citizen');

-- ----------------------------------------------------------------
-- Demo locations
-- ----------------------------------------------------------------
INSERT INTO locations (name, district, division, latitude, longitude) VALUES
('সুনামগঞ্জ সদর',             'সুনামগঞ্জ', 'সিলেট',      24.891700, 91.396700),
('কক্সবাজার সমুদ্র সৈকত',    'কক্সবাজার', 'চট্টগ্রাম',  21.427200, 92.005800),
('সিলেট শহর',                 'সিলেট',     'সিলেট',      24.894900, 91.868700),
('রাঙামাটি পার্বত্য এলাকা',  'রাঙামাটি',  'চট্টগ্রাম',  22.635300, 92.167300),
('খুলনা উপকূল',               'খুলনা',     'খুলনা',      22.845600, 89.540300),
('বরিশাল নদী তীর',            'বরিশাল',    'বরিশাল',     22.701000, 90.353500),
('ময়মনসিংহ নদী তীর',         'ময়মনসিংহ', 'ময়মনসিংহ',  24.747100, 90.420300),
('পুরান ঢাকা',                'ঢাকা',      'ঢাকা',       23.710400, 90.407400),
('কুমিল্লা সদর',              'কুমিল্লা',  'চট্টগ্রাম',  23.460700, 91.180900),
('যশোর সদর',                  'যশোর',      'খুলনা',      23.166700, 89.216700);

-- ----------------------------------------------------------------
-- Demo reports
-- ----------------------------------------------------------------
INSERT INTO reports (report_code, citizen_id, disaster_type, title, description, affected_people, status, severity, severity_score, district, latitude, longitude, location_name, created_at) VALUES
('RPT-001', 1, 'বন্যা',       'সুনামগঞ্জে আকস্মিক বন্যা',
 'সুনামগঞ্জ সদরে হাওর এলাকায় ব্যাপক বন্যা। বাড়িঘর তলিয়ে গেছে, মানুষ ছাদে আশ্রয় নিচ্ছে।',
 3200, 'verified',    'high',      78, 'DHAKA', 24.891700, 91.396700, 'সুনামগঞ্জ সদর',            '2026-09-01 10:30:00'),

('RPT-002', 4, 'ঘূর্ণিঝড়',  'কক্সবাজারে ঘূর্ণিঝড়ের প্রভাব',
 'ঘূর্ণিঝড়ের প্রভাবে তীব্র ঝড়বৃষ্টি। মৎস্যজীবীরা সাগরে আটকা পড়েছে।',
 1500, 'pending',     'unassessed', NULL,'DHAKA', 21.427200, 92.005800, 'কক্সবাজার সমুদ্র সৈকত',  '2026-09-01 08:15:00'),

('RPT-003', 5, 'জলাবদ্ধতা', 'সিলেট শহরে জলাবদ্ধতা',
 'সিলেট শহরের নিচু এলাকায় জলাবদ্ধতা। রাস্তা ডুবে যানবাহন চলাচল বন্ধ।',
 850,  'in_progress', 'medium',    45, 'DHAKA', 24.894900, 91.868700, 'সিলেট শহর',                '2026-08-31 18:45:00'),

('RPT-004', 1, 'ভূমিধস',    'রাঙামাটিতে ভূমিধস',
 'পার্বত্য চট্টগ্রামে প্রবল বৃষ্টিতে ভূমিধস। রাস্তা বন্ধ, যোগাযোগ বিচ্ছিন্ন।',
 420,  'verified',    'high',      72,'DHAKA', 22.635300, 92.167300, 'রাঙামাটি পার্বত্য এলাকা', '2026-08-31 14:10:00'),

('RPT-005', 4, 'বন্যা',      'খুলনা উপকূলে বন্যা',
 'সুন্দরবন এলাকায় জোয়ারের পানি বৃদ্ধি। উপকূলীয় এলাকায় বন্যার পানি ঢুকছে।',
 1200, 'completed',   'medium',    50,'DHAKA', 22.845600, 89.540300, 'খুলনা উপকূল',             '2026-08-30 09:00:00'),

('RPT-006', 5, 'নদীভাঙন',   'বরিশালে নদীভাঙন',
 'কীর্তনখোলা নদীর ভাঙন তীব্র হয়েছে। বেশ কয়েকটি বাড়ি নদীতে বিলীন।',
 580,  'pending',     'medium',    42,'DHAKA', 22.701000, 90.353500, 'বরিশাল নদী তীর',          '2026-08-29 11:00:00'),

('RPT-007', 1, 'নদীভাঙন',   'ময়মনসিংহে নদীভাঙন — বসতবাড়ি ক্ষতিগ্রস্ত',
 'ব্রহ্মপুত্র নদের তীরবর্তী এলাকায় ভাঙন তীব্র। অন্তত ৫০টি পরিবার বাস্তুচ্যুত।',
 350,  'verified',    'medium',    40,'DHAKA', 24.747100, 90.420300, 'ময়মনসিংহ নদী তীর',       '2026-08-28 09:30:00'),

('RPT-008', 5, 'জলাবদ্ধতা', 'ঢাকার নিচু এলাকায় দীর্ঘস্থায়ী জলাবদ্ধতা',
 'অতিবৃষ্টির কারণে পুরান ঢাকায় জলাবদ্ধতা। নর্দমার পানি উপচে পড়ছে।',
 1800, 'pending',     'unassessed', NULL,'DHAKA', 23.710400, 90.407400, 'পুরান ঢাকা',             '2026-08-27 15:00:00'),

('RPT-009', 1, 'বন্যা',      'কুমিল্লায় হঠাৎ বন্যা — ফসল নষ্ট',
 'ভারী বর্ষণে কুমিল্লার নিচু এলাকায় হঠাৎ বন্যা। কৃষিজমি ও বসতবাড়ি ক্ষতিগ্রস্ত।',
 780,  'pending',     'low',       22,'DHAKA', 23.460700, 91.180900, 'কুমিল্লা সদর',            '2026-08-26 12:00:00'),

('RPT-010', 4, 'ঘূর্ণিঝড়', 'যশোরে ঘূর্ণিঝড়ের প্রভাবে ক্ষয়ক্ষতি',
 'ঘূর্ণিঝড়ের প্রভাবে যশোর সদরে বহু গাছপালা উপড়ে পড়েছে। বিদ্যুৎ বিচ্ছিন্ন।',
 620,  'rejected',    'low',       18,'DHAKA', 23.166700, 89.216700, 'যশোর সদর',                '2026-08-25 08:00:00');

-- Demo images for RPT-001
INSERT INTO report_images (report_id, image_url) VALUES
(1, 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&h=400&fit=crop&auto=format'),
(1, 'https://images.unsplash.com/photo-1504197832061-98fedba8b900?w=600&h=400&fit=crop&auto=format'),
(3, 'https://images.unsplash.com/photo-1601745256898-d1d6a7f2a7a2?w=600&h=400&fit=crop&auto=format');

-- ----------------------------------------------------------------
-- Demo tasks
-- ----------------------------------------------------------------
INSERT INTO tasks (task_code, report_id, title, description, instructions, priority, status, progress, location_id, created_by, created_at) VALUES
('TASK-001', 1, 'জরুরি উদ্ধার অভিযান — সুনামগঞ্জ',
 'সুনামগঞ্জ সদরে আটকে পড়া পরিবারগুলোকে নৌকায় উদ্ধার করে আশ্রয়কেন্দ্রে নিয়ে যেতে হবে।',
 'নৌকা ব্যবহার করুন এবং লাইফ জ্যাকেট পরিধান নিশ্চিত করুন। উদ্ধারের পর নিকটস্থ আশ্রয়কেন্দ্রে পৌঁছে দিন।',
 'critical', 'assigned',    20, 1, 3, '2026-09-01 09:00:00'),

('TASK-002', 3, 'ত্রাণ বিতরণ — সিলেট',
 'সিলেট শহরের জলাবদ্ধ এলাকায় শুকনো খাবার ও বিশুদ্ধ পানি বিতরণ।',
 'সিলেটের নির্ধারিত ওয়ার্ডে বাড়ি বাড়ি গিয়ে ত্রাণ বিতরণ করুন। প্রবীণ ও শিশুদের অগ্রাধিকার দিন।',
 'high',     'en_route',   10, 3, 3, '2026-09-01 10:30:00'),

('TASK-003', 4, 'রাস্তা পরিষ্কার — রাঙামাটি',
 'ভূমিধসের কারণে বন্ধ রাস্তা পরিষ্কার করে যোগাযোগ পুনরুদ্ধার।',
 'ভারী যন্ত্রপাতি ব্যবহার করুন। সড়ক নিরাপদ না হওয়া পর্যন্ত এলাকা বন্ধ রাখুন।',
 'high',     'in_progress', 55, 4, 3, '2026-09-01 11:00:00'),

('TASK-004', 5, 'আশ্রয়কেন্দ্র পরিচালনা — খুলনা',
 'উপকূলীয় এলাকায় আশ্রয়কেন্দ্র পরিচালনা করে বাস্তুচ্যুত মানুষদের সহায়তা।',
 'আশ্রয়কেন্দ্রে নিবন্ধন, খাবার ও থাকার ব্যবস্থা নিশ্চিত করুন।',
 'medium',   'completed',  100, 5, 3, '2026-08-30 08:00:00'),

('TASK-005', 2, 'জরুরি চিকিৎসা সহায়তা — কক্সবাজার',
 'ঘূর্ণিঝড়ে আহতদের জরুরি চিকিৎসা সহায়তা প্রদান।',
 'কক্সবাজারের আশ্রয়কেন্দ্রে চিকিৎসা সেবা নিশ্চিত করুন। আহতদের তালিকা করুন।',
 'critical', 'assigned',    15, 2, 3, '2026-09-01 08:00:00'),

('TASK-006', 6, 'জরুরি ত্রাণ বিতরণ — বরিশাল',
 'নদীভাঙন ক্ষতিগ্রস্তদের মধ্যে জরুরি ত্রাণ বিতরণ।',
 'বরিশাল নদী তীরবর্তী ক্ষতিগ্রস্ত পরিবারগুলোর মধ্যে খাবার ও পানি বিতরণ করুন।',
 'high',     'en_route',    5, 6, 3, '2026-09-01 09:30:00');

-- Assign volunteer (id=2) to all tasks; admin (id=3) is the assigner
INSERT INTO task_assignments (task_id, volunteer_id, assigned_by) VALUES
(1, 2, 3), (2, 2, 3), (3, 2, 3), (4, 2, 3), (5, 2, 3), (6, 2, 3);

-- ----------------------------------------------------------------
-- Demo field issues
-- ----------------------------------------------------------------
INSERT INTO field_issues (issue_code, reported_by, task_id, report_id, issue_type, description, location_name, latitude, longitude, status, created_at) VALUES
('ISSUE-001', 2, 1, 1, 'road_blocked',
 'ভূমিধসের কারণে সুনামগঞ্জ-সিলেট সংযোগ সড়ক বন্ধ।',
 'সুনামগঞ্জ-সিলেট সড়ক', 24.8700, 91.4100, 'in_progress', '2026-09-01 11:20:00'),

('ISSUE-002', 2, 1, 1, 'boat_needed',
 'হাওর এলাকায় উদ্ধার কাজের জন্য আরও নৌকা প্রয়োজন।',
 'হাওর এলাকা, সুনামগঞ্জ', 24.9000, 91.3800, 'reported', '2026-09-01 09:45:00'),

('ISSUE-003', 2, 5, 2, 'medical',
 'আশ্রয়কেন্দ্রে ডায়রিয়া ও পানিবাহিত রোগের প্রকোপ বাড়ছে। বিশেষজ্ঞ চিকিৎসক প্রয়োজন।',
 'কক্সবাজার আশ্রয়কেন্দ্র', 21.4300, 92.0100, 'reported', '2026-09-01 07:30:00'),

('ISSUE-004', 2, 2, 3, 'extra_relief',
 'বরাদ্দকৃত ত্রাণ শেষ হয়ে গেছে। আরও ৫০০ পরিবারকে সহায়তা দিতে হবে।',
 'সিলেট শহর, ওয়ার্ড ১২', 24.8800, 91.8700, 'in_progress', '2026-08-31 14:00:00'),

('ISSUE-005', 2, 3, 4, 'more_volunteers',
 'রাস্তা পরিষ্কার কাজে আরও কমপক্ষে ১০ জন স্বেচ্ছাসেবক প্রয়োজন।',
 'রাঙামাটি-চট্টগ্রাম সড়ক', 22.6300, 92.1700, 'resolved', '2026-08-31 10:00:00');

-- ----------------------------------------------------------------
-- Demo severity assessments
-- ----------------------------------------------------------------
INSERT INTO severity_assessments (report_id, affected_people_score, damage_score, medical_emergency_score, road_access_score, shelter_score, total_score, severity_level, assessed_by) VALUES
(1, 18, 16, 14, 16, 14, 78, 'high',   3),
(3, 10, 10,  8,  9,  8, 45, 'medium', 3),
(4, 12, 16, 14, 16, 14, 72, 'high',   3),
(5, 12, 12,  8, 10,  8, 50, 'medium', 3),
(6,  8,  9,  8,  9,  8, 42, 'medium', 3),
(7,  8,  8,  6,  9,  9, 40, 'medium', 3),
(9,  6,  4,  4,  4,  4, 22, 'low',    3),
(10, 4,  4,  4,  2,  4, 18, 'low',    3);

-- ----------------------------------------------------------------
-- Demo resources
-- ----------------------------------------------------------------
INSERT INTO resources (name, category, unit, description) VALUES
('বিশুদ্ধ পানি',           'water',   'বোতল',   '500ml বিশুদ্ধ পানির বোতল'),
('খাবার প্যাকেট',          'food',    'প্যাকেট','শুকনো খাবারের প্যাকেট — ২৪ ঘণ্টার জন্য'),
('প্রাথমিক ওষুধ কিট',     'medical', 'কিট',    'মৌলিক ওষুধ ও প্রাথমিক চিকিৎসা সামগ্রী'),
('কম্বল',                  'other',   'পিস',    'মোটা উলের কম্বল'),
('চাল',                    'food',    'কেজি',   'মোটা চাল'),
('ওআরএস স্যালাইন',         'medical', 'প্যাকেট','ওরাল রিহাইড্রেশন সল্ট'),
('ত্রিপল / শেড',           'other',   'পিস',    'জলরোধী সবুজ তারপলিন'),
('পানির ড্রাম',            'water',   'ড্রাম',  '50 লিটার ক্যাপাসিটি পানির ড্রাম'),
('লাইফ জ্যাকেট',          'other',   'পিস',    'উদ্ধার কাজের জন্য লাইফ জ্যাকেট'),
('টর্চ ও ব্যাটারি',        'other',   'সেট',    'হ্যান্ড টর্চ + অতিরিক্ত ব্যাটারি'),
('শিশু খাদ্য',             'food',    'প্যাকেট','শিশুদের জন্য পুষ্টিকর খাদ্য'),
('মশার ওষুধ',              'medical', 'কয়েল',  'মশার কয়েল / স্প্রে');

-- ----------------------------------------------------------------
-- Demo inventory
-- ----------------------------------------------------------------
INSERT INTO inventory (resource_id, quantity, depot_name, location_id) VALUES
(1, 720,  'সুনামগঞ্জ ত্রাণকেন্দ্র',  1),
(2, 450,  'ঢাকা কেন্দ্রীয় গুদাম',   8),
(3, 120,  'চট্টগ্রাম মেডিকেল ডিপো', 4),
(4, 340,  'সিলেট ত্রাণকেন্দ্র',      3),
(5, 1200, 'ময়মনসিংহ গুদাম',          7),
(6, 380,  'কুমিল্লা মেডিকেল ডিপো',  9),
(7,  85,  'খুলনা ত্রাণকেন্দ্র',      5),
(8, 150,  'বরিশাল ডিপো',             6),
(9,  40,  'সুনামগঞ্জ ত্রাণকেন্দ্র',  1),
(10, 60,  'সিলেট ত্রাণকেন্দ্র',      3);

-- ----------------------------------------------------------------
-- Demo resource allocations + inventory transactions
-- ----------------------------------------------------------------
INSERT INTO resource_allocations (allocation_code, report_id, resource_id, quantity, allocated_by, status) VALUES
('ALLOC-001', 1, 1, 200, 3, 'allocated'),
('ALLOC-002', 1, 2, 150, 3, 'allocated'),
('ALLOC-003', 1, 3,  20, 3, 'allocated'),
('ALLOC-004', 3, 2, 100, 3, 'allocated'),
('ALLOC-005', 4, 7,  10, 3, 'allocated');

INSERT INTO inventory_transactions (inventory_id, transaction_type, quantity, reference_type, reference_id, created_by) VALUES
(1, 'addition',   1500, NULL,                 NULL, 3),
(1, 'allocation', -200, 'resource_allocation', 1,   3),
(2, 'addition',   2000, NULL,                 NULL, 3),
(2, 'allocation', -150, 'resource_allocation', 2,   3),
(2, 'allocation', -100, 'resource_allocation', 4,   3),
(3, 'addition',    600, NULL,                 NULL, 3),
(3, 'allocation',  -20, 'resource_allocation', 3,   3),
(7, 'addition',    400, NULL,                 NULL, 3),
(7, 'allocation',  -10, 'resource_allocation', 5,   3);

-- ----------------------------------------------------------------
-- Demo notifications
-- ----------------------------------------------------------------
INSERT INTO notifications (user_id, title, message, type, reference_type, reference_id) VALUES
(3, 'নতুন রিপোর্ট',          'রাকিবুল হাসান নতুন রিপোর্ট দাখিল করেছেন: সুনামগঞ্জে আকস্মিক বন্যা', 'info',    'report', 1),
(1, 'রিপোর্ট যাচাই হয়েছে',  'আপনার রিপোর্ট RPT-001 যাচাই হয়েছে',                                    'success', 'report', 1),
(2, 'নতুন টাস্ক নিয়োগ',     'আপনাকে TASK-001 জরুরি উদ্ধার অভিযান — সুনামগঞ্জ এ নিয়োগ করা হয়েছে', 'success', 'task',   1),
(3, 'মাঠ সমস্যা',            'তানজিলা খানম একটি মাঠ সমস্যা জানিয়েছেন: রাস্তা বন্ধ',                  'alert',   'issue',  1),
(3, 'নতুন রিপোর্ট',          'নাসরিন আক্তার নতুন রিপোর্ট দাখিল করেছেন: কক্সবাজারে ঘূর্ণিঝড়ের প্রভাব', 'info', 'report', 2),
(3, 'রিপোর্ট যাচাই প্রয়োজন','RPT-003 সিলেট শহরে জলাবদ্ধতা — যাচাই বাকি আছে',                         'warning', 'report', 3),
(1, 'রিপোর্ট যাচাই হয়েছে',  'আপনার রিপোর্ট RPT-007 যাচাই হয়েছে',                                    'success', 'report', 7),
(2, 'টাস্ক আপডেট',           'TASK-003 রাস্তা পরিষ্কার কাজ চলছে',                                      'info',    'task',   3);
