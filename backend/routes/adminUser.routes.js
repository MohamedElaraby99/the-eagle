import express from "express";
import { isLoggedIn, authorisedRoles } from "../middleware/auth.middleware.js";
import { 
    getAllUsers,
    createUser,
    getUserDetails,
    toggleUserStatus,
    deleteUser,
    updateUserRole,
    getUserActivities,
    getUserStats,
    resetUserPassword
} from "../controllers/adminUser.controller.js";

const router = express.Router();

// All routes require admin authentication
router.use(isLoggedIn);
router.use(authorisedRoles("ADMIN"));

// Get all users with filters and pagination
router.get("/users", (req, res, next) => {
    console.log('=== ADMIN USERS ROUTE HIT ===');
    console.log('User making request:', req.user);
    next();
}, getAllUsers);

// Create new user
router.post("/create", createUser);

// Get user details
router.get("/users/:userId", getUserDetails);

// Toggle user active status
router.patch("/users/:userId/status", toggleUserStatus);

// Update user role
router.patch("/users/:userId/role", updateUserRole);

// Delete user
router.delete("/users/:userId", deleteUser);

// Get user activities
router.get("/users/:userId/activities", getUserActivities);

// Get user statistics
router.get("/users/:userId/stats", getUserStats);

// Reset user password
router.patch("/users/:userId/password", resetUserPassword);

export default router; 