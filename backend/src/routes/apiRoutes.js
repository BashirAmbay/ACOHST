const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

const authController = require('../controllers/authController');
const applicantController = require('../controllers/applicantController');
const admissionController = require('../controllers/admissionController');
const studentController = require('../controllers/studentController');
const academicController = require('../controllers/academicController');
const financeController = require('../controllers/financeController');
const cmsController = require('../controllers/cmsController');
const adminController = require('../controllers/adminController');
const contactController = require('../controllers/contactController');

// Authentication Routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/profile', authenticateToken, authController.getCurrentProfile);

// Applicant Portal Routes
router.get('/applicant/profile', authenticateToken, requireRole('Applicant', 'Student'), applicantController.getApplicantProfile);
router.put('/applicant/save', authenticateToken, requireRole('Applicant'), applicantController.saveApplication);
router.post('/applicant/upload-doc', authenticateToken, requireRole('Applicant'), upload.single('file'), applicantController.uploadDocument);
router.post('/applicant/submit', authenticateToken, requireRole('Applicant'), applicantController.submitApplication);
router.get('/applicant/admission-letter', authenticateToken, applicantController.getAdmissionLetter);

// Admissions Management Routes (Admin & Admission Officers)
router.get('/admission/applications', authenticateToken, requireRole('Admission Officer', 'Super Admin', 'Administrator'), admissionController.getApplications);
router.get('/admission/applications/:id', authenticateToken, requireRole('Admission Officer', 'Super Admin', 'Administrator'), admissionController.getApplicationById);
router.put('/admission/applications/:id/status', authenticateToken, requireRole('Admission Officer', 'Super Admin', 'Administrator'), admissionController.updateApplicationStatus);

// Student Portal Routes
router.get('/student/profile', authenticateToken, requireRole('Student'), studentController.getStudentProfile);
router.get('/student/available-courses', authenticateToken, requireRole('Student'), studentController.getAvailableCourses);
router.post('/student/register-courses', authenticateToken, requireRole('Student'), studentController.registerCourses);
router.get('/student/results', authenticateToken, requireRole('Student'), studentController.getStudentResults);

// Academics Routes
router.get('/academics/schools', academicController.getSchools);
router.post('/academics/schools', authenticateToken, requireRole('Academic Officer', 'Super Admin'), academicController.createSchool);
router.get('/academics/departments', academicController.getDepartments);
router.get('/academics/programmes', academicController.getProgrammes);
router.post('/academics/programmes', authenticateToken, requireRole('Academic Officer', 'Super Admin'), academicController.createProgramme);
router.get('/academics/courses', academicController.getCourses);
router.get('/academics/sessions', academicController.getSessions);

// Finance & Payment Routes
router.post('/finance/initialize', authenticateToken, financeController.initializeTransaction);
router.get('/finance/verify/:reference', financeController.verifyTransaction);
router.get('/finance/transactions', authenticateToken, requireRole('Finance Officer', 'Super Admin', 'Administrator'), financeController.getTransactions);

// CMS Public & Admin Content Routes
router.get('/cms/news', cmsController.getNews);
router.get('/cms/news/:slug', cmsController.getNewsBySlug);
router.post('/cms/news', authenticateToken, requireRole('Content Manager', 'Super Admin'), cmsController.createNews);
router.get('/cms/events', cmsController.getEvents);
router.post('/cms/events', authenticateToken, requireRole('Content Manager', 'Super Admin'), cmsController.createEvent);
router.get('/cms/gallery', cmsController.getGallery);
router.post('/cms/gallery', authenticateToken, requireRole('Content Manager', 'Super Admin'), cmsController.addGalleryItem);
router.get('/cms/facilities', cmsController.getFacilities);
router.get('/cms/management', cmsController.getManagement);
router.get('/cms/faqs', cmsController.getFAQs);

// Admin & Executive Dashboard Routes
router.get('/admin/metrics', authenticateToken, requireRole('Super Admin', 'Administrator', 'Admission Officer', 'Finance Officer'), adminController.getDashboardMetrics);
router.get('/admin/users', authenticateToken, requireRole('Super Admin', 'Administrator'), adminController.getUsers);
router.put('/admin/users/:id/role', authenticateToken, requireRole('Super Admin', 'Administrator'), adminController.updateUserRole);
router.get('/admin/settings', adminController.getSystemSettings);
router.put('/admin/settings', authenticateToken, requireRole('Super Admin'), adminController.updateSystemSettings);
router.get('/admin/audit-logs', authenticateToken, requireRole('Super Admin'), adminController.getAuditLogs);

// Contact & Helpdesk Routes
router.post('/contact/send', contactController.submitContactMessage);
router.get('/contact/messages', authenticateToken, requireRole('Administrator', 'Super Admin'), contactController.getContactMessages);
router.put('/contact/messages/:id', authenticateToken, requireRole('Administrator', 'Super Admin'), contactController.updateContactMessageStatus);

module.exports = router;
