import { Router } from 'express';
import { isLoggedIn, authorisedRoles } from '../middleware/auth.middleware.js';
import { generateCourseAccessCodes, redeemCourseAccessCode, checkCourseAccess, listCourseAccessCodes } from '../controllers/courseAccess.controller.js';

const router = Router();

// Admin endpoints
router.post('/admin/codes', isLoggedIn, authorisedRoles("ADMIN"), generateCourseAccessCodes);
router.get('/admin/codes', isLoggedIn, authorisedRoles("ADMIN"), listCourseAccessCodes);

// User endpoints
router.post('/redeem', isLoggedIn, redeemCourseAccessCode);
router.get('/check/:courseId', isLoggedIn, checkCourseAccess);

export default router;


