-- Database Schema for ACOHST Platform

CREATE TABLE IF NOT EXISTS roles (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'Applicant',
  is_verified INTEGER DEFAULT 0,
  verification_token TEXT,
  reset_token TEXT,
  reset_token_expires DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role) REFERENCES roles(name) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS schools (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  banner_image TEXT,
  dean_name TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS departments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  school_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS programmes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  department_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  degree_type TEXT NOT NULL, -- Diploma, HND, ND, Certificate
  duration_years INTEGER NOT NULL DEFAULT 3,
  requirement_summary TEXT,
  fee_amount REAL NOT NULL DEFAULT 65000,
  description TEXT,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS academic_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL, -- e.g. 2026/2027
  start_date TEXT,
  end_date TEXT,
  is_current INTEGER DEFAULT 0,
  admission_open INTEGER DEFAULT 1,
  application_fee REAL DEFAULT 10000,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  programme_id INTEGER NOT NULL,
  code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  credit_units INTEGER NOT NULL DEFAULT 2,
  level INTEGER NOT NULL DEFAULT 100, -- 100, 200, 300
  semester INTEGER NOT NULL DEFAULT 1, -- 1 or 2
  is_elective INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (programme_id) REFERENCES programmes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS applicants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE NOT NULL,
  application_number TEXT UNIQUE NOT NULL,
  academic_session_id INTEGER NOT NULL,
  first_name TEXT NOT NULL,
  middle_name TEXT,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  gender TEXT,
  date_of_birth TEXT,
  marital_status TEXT,
  nationality TEXT DEFAULT 'Nigerian',
  state_of_origin TEXT,
  lga TEXT,
  address TEXT,
  passport_photo TEXT,
  first_choice_programme_id INTEGER,
  second_choice_programme_id INTEGER,
  ssce_data TEXT, -- JSON string of O level subjects & grades
  status TEXT DEFAULT 'Draft', -- Draft, Submitted, Under Review, Shortlisted, Approved, Admitted, Rejected
  payment_status TEXT DEFAULT 'Pending', -- Pending, Paid
  payment_reference TEXT,
  admin_remarks TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (academic_session_id) REFERENCES academic_sessions(id),
  FOREIGN KEY (first_choice_programme_id) REFERENCES programmes(id),
  FOREIGN KEY (second_choice_programme_id) REFERENCES programmes(id)
);

CREATE TABLE IF NOT EXISTS application_documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  applicant_id INTEGER NOT NULL,
  document_type TEXT NOT NULL, -- SSCE, Birth Certificate, Indigene Cert, Passport, Recommendation
  document_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  status TEXT DEFAULT 'Uploaded', -- Uploaded, Verified, Rejected
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (applicant_id) REFERENCES applicants(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  applicant_id INTEGER,
  student_id INTEGER,
  reference TEXT UNIQUE NOT NULL,
  payment_type TEXT NOT NULL, -- Application Fee, Tuition Fee, Acceptance Fee, Portal Fee
  amount REAL NOT NULL,
  channel TEXT DEFAULT 'Paystack Mock',
  status TEXT DEFAULT 'Pending', -- Pending, Successful, Failed
  paystack_response TEXT,
  paid_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE NOT NULL,
  applicant_id INTEGER UNIQUE,
  matric_number TEXT UNIQUE NOT NULL,
  programme_id INTEGER NOT NULL,
  department_id INTEGER NOT NULL,
  academic_session_id INTEGER NOT NULL,
  level INTEGER DEFAULT 100,
  status TEXT DEFAULT 'Active', -- Active, Graduated, Suspended
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (programme_id) REFERENCES programmes(id),
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE IF NOT EXISTS course_registrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  course_id INTEGER NOT NULL,
  academic_session_id INTEGER NOT NULL,
  semester INTEGER NOT NULL,
  status TEXT DEFAULT 'Approved',
  registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS student_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  course_id INTEGER NOT NULL,
  academic_session_id INTEGER NOT NULL,
  semester INTEGER NOT NULL,
  ca_score REAL DEFAULT 0,
  exam_score REAL DEFAULT 0,
  total_score REAL DEFAULT 0,
  grade TEXT DEFAULT 'F',
  grade_point REAL DEFAULT 0.0,
  is_published INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS news (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  featured_image TEXT,
  author_name TEXT DEFAULT 'ACOHST Media',
  is_published INTEGER DEFAULT 1,
  published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  location TEXT DEFAULT 'Main Campus Auditorium, Kore',
  event_date TEXT NOT NULL,
  event_time TEXT DEFAULT '09:00 AM',
  description TEXT NOT NULL,
  category TEXT DEFAULT 'Academic',
  banner_image TEXT,
  is_published INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gallery (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'Campus Life',
  image_url TEXT NOT NULL,
  caption TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS facilities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'Laboratory',
  description TEXT NOT NULL,
  image_url TEXT,
  features TEXT, -- Comma separated or text
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS management_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT NOT NULL,
  image_url TEXT,
  order_index INTEGER DEFAULT 0,
  email TEXT,
  phone TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS faqs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  order_index INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'New', -- New, In Progress, Resolved
  reply_notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS announcements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  target_audience TEXT DEFAULT 'All', -- All, Applicants, Students, Staff
  content TEXT NOT NULL,
  is_urgent INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS system_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  user_email TEXT,
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  details TEXT,
  ip_address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
