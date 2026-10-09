const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const db = require('./db');

function seedDatabase() {
  console.log('🌱 Starting ACOHST Database Initialization and Seeding...');

  // Read and execute schema
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
  db.exec(schemaSql);
  console.log('✅ Schema tables verified/created successfully.');

  // Roles
  const roles = [
    { id: 'role_superadmin', name: 'Super Admin', description: 'Full system control & root operations' },
    { id: 'role_admin', name: 'Administrator', description: 'General administration and user management' },
    { id: 'role_admission', name: 'Admission Officer', description: 'Manages applications, reviews, and admissions' },
    { id: 'role_academic', name: 'Academic Officer', description: 'Manages schools, courses, registrations, and results' },
    { id: 'role_finance', name: 'Finance Officer', description: 'Manages application and student fee transactions' },
    { id: 'role_cms', name: 'Content Manager', description: 'Manages news, events, gallery, and website content' },
    { id: 'role_student', name: 'Student', description: 'Enrolled college student portal access' },
    { id: 'role_applicant', name: 'Applicant', description: 'Prospective student admission portal access' }
  ];

  const insertRole = db.prepare('INSERT OR IGNORE INTO roles (id, name, description) VALUES (?, ?, ?)');
  roles.forEach(r => insertRole.run(r.id, r.name, r.description));

  // Default Users
  const passwordHash = bcrypt.hashSync('ACOHSTPass2026!', 10);
  const users = [
    { email: 'admin@acohst.edu.ng', password_hash: passwordHash, first_name: 'Dr. Abubakar', last_name: 'Sadiq', phone: '+234 803 123 4567', role: 'Super Admin', is_verified: 1 },
    { email: 'admissions@acohst.edu.ng', password_hash: passwordHash, first_name: 'Hajiya Amina', last_name: 'Bello', phone: '+234 802 987 6543', role: 'Admission Officer', is_verified: 1 },
    { email: 'academic@acohst.edu.ng', password_hash: passwordHash, first_name: 'Prof. Usman', last_name: 'Kore', phone: '+234 805 444 3322', role: 'Academic Officer', is_verified: 1 },
    { email: 'finance@acohst.edu.ng', password_hash: passwordHash, first_name: 'Malam Ibrahim', last_name: 'Garba', phone: '+234 806 777 8899', role: 'Finance Officer', is_verified: 1 },
    { email: 'cms@acohst.edu.ng', password_hash: passwordHash, first_name: 'Zainab', last_name: 'Kabir', phone: '+234 809 111 2233', role: 'Content Manager', is_verified: 1 },
    { email: 'student@acohst.edu.ng', password_hash: passwordHash, first_name: 'Mustapha', last_name: 'Aliyu', phone: '+234 812 345 6789', role: 'Student', is_verified: 1 },
    { email: 'applicant@acohst.edu.ng', password_hash: passwordHash, first_name: 'Fatima', last_name: 'Muhammad', phone: '+234 813 987 6543', role: 'Applicant', is_verified: 1 },
  ];

  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (email, password_hash, first_name, last_name, phone, role, is_verified)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  users.forEach(u => insertUser.run(u.email, u.password_hash, u.first_name, u.last_name, u.phone, u.role, u.is_verified));

  // Academic Sessions
  const insertSession = db.prepare(`
    INSERT OR IGNORE INTO academic_sessions (name, start_date, end_date, is_current, admission_open, application_fee)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  insertSession.run('2026/2027', '2026-09-01', '2027-07-31', 1, 1, 10000);

  // Temporarily disable foreign keys to cleanly reset academic structures
  db.pragma('foreign_keys = OFF');
  db.prepare('DELETE FROM student_results').run();
  db.prepare('DELETE FROM course_registrations').run();
  db.prepare('DELETE FROM students').run();
  db.prepare('DELETE FROM applicants').run();
  db.prepare('DELETE FROM courses').run();
  db.prepare('DELETE FROM programmes').run();
  db.prepare('DELETE FROM departments').run();
  db.prepare('DELETE FROM schools').run();

  // Schools (4 Schools corresponding to the 4 Courses Offered)
  const insertSchool = db.prepare(`
    INSERT INTO schools (id, name, code, description, icon, dean_name)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  insertSchool.run(1, 'School of Community Health Sciences', 'SCHS', 'Dedicated to training front-line primary health care practitioners, community health extension workers, and preventive care specialists.', 'Stethoscope', 'Dr. Salisu Abdullahi');
  insertSchool.run(2, 'School of Pharmacy Health Sciences', 'SPHS', 'Focusing on pharmaceutical care, pharmacology, drug dispensing, quality control, and essential medicine management.', 'Pill', 'Pharm. Kabir Bello');
  insertSchool.run(3, 'School of Medical Laboratory Science', 'SMLS', 'Equipping diagnostic specialists with skills in clinical microbiology, hematology, chemical pathology, and histopathology.', 'Microscope', 'Dr. Maryam Umar');
  insertSchool.run(4, 'School of Public Health Sciences', 'SPH', 'Training leaders in disease surveillance, epidemic control, community sanitation, environmental hygiene, and public health management.', 'ShieldCheck', 'Dr. Fatima Shehu');

  // Departments
  const insertDept = db.prepare(`
    INSERT INTO departments (id, school_id, name, code, description)
    VALUES (?, ?, ?, ?, ?)
  `);
  insertDept.run(1, 1, 'Department of Community Health', 'DCH', 'Primary health care education and community health extension service.');
  insertDept.run(2, 2, 'Department of Pharmacy Technician Studies', 'DPTS', 'Pharmaceutical technology, compounding, and medicine dispensing.');
  insertDept.run(3, 3, 'Department of Medical Laboratory Science', 'DMLS', 'Clinical laboratory diagnostic skills and bench science.');
  insertDept.run(4, 4, 'Department of Public Health', 'DPH', 'Epidemiology, public sanitation, disease prevention, and community health inspection.');

  // Programmes (The 4 COURSES OFFERED)
  const insertProg = db.prepare(`
    INSERT INTO programmes (id, department_id, name, code, degree_type, duration_years, requirement_summary, fee_amount, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertProg.run(1, 1, 'Community Health Extension Workers (CHEW)', 'CHEW', 'Diploma', 3, '5 O-Level credits (WAEC, NECO, or GCE) in English Language, Mathematics, Biology, Chemistry, and Physics.', 120000, 'Comprehensive 3-year professional diploma training students for clinical primary health care delivery, preventive medicine, maternal-child healthcare, and emergency first aid.');
  insertProg.run(2, 2, 'Pharmacy Technician (PT)', 'PT', 'Diploma', 3, '5 O-Level credits (WAEC, NECO, or GCE) in English Language, Mathematics, Biology, Chemistry, and Physics.', 140000, '3-year professional diploma programme focusing on drug formulation, pharmacology basics, inventory management, dispensing ethics, and prescription dispensing in hospitals and pharmacies.');
  insertProg.run(3, 3, 'Medical Laboratory Technician (MLT)', 'MLT', 'Diploma', 3, '5 O-Level credits (WAEC, NECO, or GCE) in English Language, Mathematics, Chemistry, Biology, and Physics.', 120000, '3-year professional diploma training medical laboratory technicians in diagnostic testing, blood transfusion services, clinical biochemistry, and microscopy.');
  insertProg.run(4, 4, 'Public Health Technician (PHT)', 'PHT', 'Diploma', 2, '5 O-Level credits (WAEC, NECO, or GCE) in English Language, Mathematics, Biology, Chemistry, and Physics.', 110000, '2-year professional diploma equipping students with essential skills in epidemiology, disease surveillance, community sanitation, environmental hygiene, and public health education.');

  // Courses
  const insertCourse = db.prepare(`
    INSERT INTO courses (programme_id, code, title, credit_units, level, semester)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  // Courses for CHEW
  insertCourse.run(1, 'CHEW 101', 'Anatomy and Physiology I', 3, 100, 1);
  insertCourse.run(1, 'CHEW 103', 'Introduction to Community Health Care', 2, 100, 1);
  insertCourse.run(1, 'CHEW 105', 'First Aid and Emergency Care', 2, 100, 1);
  insertCourse.run(1, 'CHEW 102', 'Anatomy and Physiology II', 3, 100, 2);
  insertCourse.run(1, 'CHEW 104', 'Maternal and Child Health I', 3, 100, 2);

  // Courses for PT
  insertCourse.run(2, 'PT 101', 'Introduction to Pharmacology', 3, 100, 1);
  insertCourse.run(2, 'PT 103', 'Pharmaceutical Calculations & Chemistry', 3, 100, 1);
  insertCourse.run(2, 'PT 105', 'Dispensing Principles & Practice', 2, 100, 1);
  insertCourse.run(2, 'PT 102', 'Pharmacotherapy & Drug Formulation', 3, 100, 2);
  insertCourse.run(2, 'PT 104', 'Hospital & Clinical Pharmacy Practice', 2, 100, 2);

  // Courses for MLT
  insertCourse.run(3, 'MLT 101', 'Clinical Chemistry I', 3, 100, 1);
  insertCourse.run(3, 'MLT 103', 'Medical Microbiology Basics', 3, 100, 1);
  insertCourse.run(3, 'MLT 105', 'Introduction to Medical Laboratory Science', 2, 100, 1);
  insertCourse.run(3, 'MLT 102', 'Hematology & Blood Transfusion I', 3, 100, 2);
  insertCourse.run(3, 'MLT 104', 'Parasitology and Histology', 3, 100, 2);

  // Courses for PHT
  insertCourse.run(4, 'PHT 101', 'Principles of Public Health', 3, 100, 1);
  insertCourse.run(4, 'PHT 103', 'Epidemiology & Disease Surveillance', 3, 100, 1);
  insertCourse.run(4, 'PHT 105', 'Environmental Hygiene & Sanitation', 2, 100, 1);
  insertCourse.run(4, 'PHT 102', 'Public Health Education & Mobilization', 3, 100, 2);
  insertCourse.run(4, 'PHT 104', 'Water Quality & Waste Management', 2, 100, 2);

  // Management Profiles
  const insertMgmt = db.prepare(`
    INSERT OR IGNORE INTO management_profiles (name, title, role, bio, image_url, order_index, email, phone)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertMgmt.run('Dr. Salisu Kore Abdullahi', 'Provost', 'Chief Executive Officer', 'A seasoned medical educator and public health consultant with over 25 years of leadership in health science institutions across Nigeria. Dedicated to raising world-class healthcare professionals at ACOHST.', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400', 1, 'provost@acohst.edu.ng', '+234 803 000 1122');
  insertMgmt.run('Alh. Garba Muhammad Kore', 'Registrar', 'Head of Administration', 'Distinguished administrator with extensive experience in university and health college registrarial services, student affairs, and academic governance.', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400', 2, 'registrar@acohst.edu.ng', '+234 803 000 3344');
  insertMgmt.run('Hajiya Hauwa Usman', 'Bursar', 'Head of Finance', 'Chartered accountant with expertise in public sector accounting, institutional financial strategy, student revenue management, and fiscal compliance.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400', 3, 'bursar@acohst.edu.ng', '+234 803 000 5566');
  insertMgmt.run('Malam Yakubu Bello', 'College Librarian', 'Head of Library Services', 'Experienced health librarian committed to providing physical and digital resource access to support student learning and research innovation.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400', 4, 'librarian@acohst.edu.ng', '+234 803 000 7788');

  // Facilities
  const insertFacility = db.prepare(`
    INSERT OR IGNORE INTO facilities (name, category, description, image_url, features)
    VALUES (?, ?, ?, ?, ?)
  `);
  insertFacility.run('Advanced Diagnostic & Clinical Laboratory', 'Diagnostic Lab', 'State-of-the-art medical testing facility equipped with modern microscopes, automated chemistry analyzers, spectrophotometers, and biosafety cabinets for hands-on student training.', 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=600', 'Automated Analyzers, Microtomes, Biosafety Cabinets, Centrifuges');
  insertFacility.run('Community Health Demonstration Clinic', 'Clinical Training', 'A fully functional outpatient clinical simulation center where students practice maternal care, immunizations, vital signs monitoring, and triage.', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600', 'Simulation Patient Beds, Triage Station, Vaccine Cold Chain, Emergency First Aid Unit');
  insertFacility.run('Model Pharmacy & Dispensing Lab', 'Pharmaceutical Center', 'Model community pharmacy setup featuring real drug storage units, prescription processing software, compounding benches, and patient counseling bays.', 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&q=80&w=600', 'Compounding Benches, Digital Balance, Prescription Software, Storage Racks');
  insertFacility.run('E-Library & Digital Resource Center', 'Learning Commons', 'Quiet and collaborative academic reading spaces connected to high-speed internet with access to over 50,000 international medical journals and e-books.', 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=600', '100+ Computer Terminals, High Speed Fiber Wi-Fi, Printing & Scanning Services, HINARI Journal Access');
  insertFacility.run('Modern ICT & Computer Laboratory', 'Technology Center', 'Dedicated computer lab for CBT examinations, health data management practice, electronic medical records training, and digital literacy classes.', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600', 'Air-conditioned Suite, Smart Interactive Projectors, High-speed LAN, Uninterrupted Power Supply (UPS)');

  // News
  const insertNews = db.prepare(`
    INSERT OR IGNORE INTO news (title, slug, summary, content, category, featured_image, author_name)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  insertNews.run(
    'ACOHST Announces 2026/2027 Admission for Accredited Health Programmes',
    'acohst-announces-2026-2027-admission-accredited-health-programmes',
    'Applications are invited from qualified candidates for admission into Diploma programmes in Health Sciences for the 2026/2027 academic session.',
    'Management of Al-Madinatu College of Health Science and Technology (ACOHST), Kore, announces the sale of Admission Forms for the 2026/2027 academic session.\n\nAccredited Courses Offered:\n1. Community Health Extension Workers (CHEW) - Diploma (Session Fee: ₦120,000 + Dept. fee ₦10,000 = Total: ₦130,000)\n2. Pharmacy Technician (PT) - Diploma (Session Fee: ₦140,000 + Dept. fee ₦10,000 = Total: ₦150,000)\n3. Medical Laboratory Technician (MLT) - Diploma (Session Fee: ₦120,000 + Dept. fee ₦10,000 = Total: ₦130,000)\n4. Public Health Technician (PHT) - Diploma (Session Fee: ₦110,000 + Dept. fee ₦10,000 = Total: ₦120,000)\n\nHOW TO APPLY:\nAnyone interested in obtaining the Admission Form for the 2026/2027 Academic session should visit Al-Madinatu College of Health Science and Technology Kore Campus.\n\nCandidates are advised to bring relevant academic credentials and passport photographs.',
    'Admissions',
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600',
    'ACOHST Admission Bureau'
  );

  insertNews.run(
    'College Board Approves Upgraded Medical Diagnostic Equipment for Clinical Labs',
    'college-board-approves-upgraded-medical-diagnostic-equipment',
    'The Governing Council of ACOHST has approved the procurement of modern diagnostic instruments to enhance practical clinical exposure for students.',
    'In line with ACOHST commitment to providing world-class health education, the Governing Board has delivered a new suite of modern laboratory diagnostic tools to the Medical Laboratory Science and Pharmacy departments.\n\nSpeaking during the commissioning, the Provost emphasized that practical competency remains the cornerstone of health science training at Kore.',
    'Academics',
    '/image/image 11.jpg',
    'ACOHST Media Unit'
  );

  // Events
  const insertEvent = db.prepare(`
    INSERT OR IGNORE INTO events (title, slug, location, event_date, event_time, description, category, banner_image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertEvent.run(
    '2026/2027 Matriculation & Oath-Taking Ceremony',
    '2026-2027-matriculation-ceremony',
    'ACOHST Main Auditorium, Kore',
    '2026-10-15',
    '10:00 AM',
    'Official matriculation ceremony and professional oath-taking for newly admitted students across all health science schools.',
    'Ceremony',
    'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=600'
  );

  insertEvent.run(
    'Annual Community Health Outreach & Free Medical Screening',
    'annual-community-health-outreach-2026',
    'Kore Primary Healthcare Center & Surrounding Villages',
    '2026-11-20',
    '08:30 AM',
    'A joint community health drive organized by the School of Community Health Sciences offering free blood pressure checks, diabetes screening, health education, and maternal care advice.',
    'Community Outreach',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600'
  );

  // Gallery
  const insertGallery = db.prepare(`
    INSERT OR IGNORE INTO gallery (title, category, image_url, caption)
    VALUES (?, ?, ?, ?)
  `);
  insertGallery.run('Students Conducting Clinical Hematology Experiment', 'Laboratory', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=600', 'Medical Laboratory Technician students operating automated diagnostic equipment');
  insertGallery.run('ACOHST Main Academic Block & Admin Complex', 'Campus', 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=600', 'Modern architectural facilities at Kore campus');
  insertGallery.run('Community Health Practical Field Training', 'Field Work', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600', 'CHEW students delivering immunizations during rural outreach');
  insertGallery.run('Students in Modern E-Library Resource Room', 'Library', 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=600', 'Students researching health science papers online');

  // FAQs
  db.prepare('DELETE FROM faqs').run();
  const insertFAQ = db.prepare(`
    INSERT INTO faqs (question, answer, category, order_index)
    VALUES (?, ?, ?, ?)
  `);
  insertFAQ.run('What courses are offered at ACOHST?', 'ACOHST offers 4 accredited programmes: 1) Community Health Extension Workers (CHEW), 2) Pharmacy Technician (PT), 3) Medical Laboratory Technician (MLT), and 4) Public Health Technician (PHT).', 'Academics', 1);
  insertFAQ.run('How do I apply for the 2026/2027 Admission?', 'Anyone interested in obtaining the Admission Form for the 2026/2027 Academic session should visit Al-Madinatu College of Health Science and Technology Kore Campus. Admission forms are obtained directly from the Admissions Office on campus.', 'Admissions', 2);
  insertFAQ.run('What are the general admission entry requirements?', 'General Entry Requirements: 5 O-Level credits (WAEC, NECO, or GCE) in English Language, Mathematics, Biology, Chemistry, and Physics.', 'Admissions', 3);
  insertFAQ.run('Are ACOHST health programmes fully accredited?', 'Yes, all programmes offered at Al-Madinatu College of Health Science and Technology, Kore, are recognized and regulated by respective national professional boards and councils.', 'General', 4);
  insertFAQ.run('Is hostel accommodation available on campus?', 'Yes, ACOHST provides comfortable, secure, and well-equipped male and female student hostels with 24/7 security and electricity within the college premises.', 'Campus Life', 5);

  // System Settings
  const insertSetting = db.prepare(`
    INSERT OR REPLACE INTO system_settings (key, value, description)
    VALUES (?, ?, ?)
  `);
  insertSetting.run('college_name', 'Al-Madinatu College of Health Science and Technology, Kore', 'Full institutional name');
  insertSetting.run('college_short_name', 'ACOHST', 'Acronym name');
  insertSetting.run('college_email', 'info@acohst.edu.ng', 'Primary institutional email');
  insertSetting.run('college_phone', '+234 803 123 4567', 'Primary contact telephone');
  insertSetting.run('college_address', 'Kore Campus, Kano-Hadejia Expressway, Kano State, Nigeria', 'Physical campus address');
  insertSetting.run('admission_session', '2026/2027', 'Active admission session name');
  insertSetting.run('application_fee', '10000', 'Application fee in NGN');
  insertSetting.run('payment_gateway_mode', 'Test Mode', 'Paystack Gateway status (Test Mode / Live Mode)');

  // Seed sample applicant application & demo student record
  // 1) Applicant record for Fatima Muhammad (user_id = 7)
  const insertApplicant = db.prepare(`
    INSERT OR IGNORE INTO applicants (
      user_id, application_number, academic_session_id, first_name, middle_name, last_name,
      email, phone, gender, date_of_birth, marital_status, nationality, state_of_origin, lga, address,
      first_choice_programme_id, second_choice_programme_id, ssce_data, status, payment_status, payment_reference
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const ssceSample = JSON.stringify({
    examType: 'WAEC',
    examYear: '2025',
    indexNumber: '4250918234',
    subjects: [
      { subject: 'English Language', grade: 'B3' },
      { subject: 'Mathematics', grade: 'A1' },
      { subject: 'Biology', grade: 'B2' },
      { subject: 'Chemistry', grade: 'B3' },
      { subject: 'Physics', grade: 'C4' }
    ]
  });

  insertApplicant.run(
    7, 'ACOHST/2026/APP/1001', 1, 'Fatima', 'Amina', 'Muhammad',
    'applicant@acohst.edu.ng', '+234 813 987 6543', 'Female', '2004-05-14', 'Single', 'Nigerian', 'Kano', 'Kore', 'No 14 Hospital Road, Kore',
    1, 3, ssceSample, 'Submitted', 'Paid', 'PAY-ACOHST-MOCK-991203'
  );

  // 2) Student record for Mustapha Aliyu (user_id = 6)
  const insertStudent = db.prepare(`
    INSERT OR IGNORE INTO students (
      user_id, matric_number, programme_id, department_id, academic_session_id, level, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  insertStudent.run(6, 'ACOHST/2026/CHEW/014', 1, 1, 1, 100, 'Active');

  // Add course registrations for student #1
  const insertReg = db.prepare(`
    INSERT OR IGNORE INTO course_registrations (student_id, course_id, academic_session_id, semester, status)
    VALUES (?, ?, ?, ?, ?)
  `);
  insertReg.run(1, 1, 1, 1, 'Approved');
  insertReg.run(1, 2, 1, 1, 'Approved');
  insertReg.run(1, 3, 1, 1, 'Approved');

  // Add sample results for student #1
  const insertResult = db.prepare(`
    INSERT OR IGNORE INTO student_results (student_id, course_id, academic_session_id, semester, ca_score, exam_score, total_score, grade, grade_point)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertResult.run(1, 1, 1, 1, 28, 56, 84, 'A', 4.0);
  insertResult.run(1, 2, 1, 1, 25, 48, 73, 'B', 3.5);
  insertResult.run(1, 3, 1, 1, 26, 52, 78, 'A', 4.0);

  db.pragma('foreign_keys = ON');
  console.log('✅ ACOHST Seeding Completed Successfully!');
}

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
