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
    resetUserPassword,
    createBulkUser1Accounts
} from "../controllers/adminUser.controller.js";

const router = express.Router();

// All routes require admin authentication
router.use(isLoggedIn);
router.use(authorisedRoles("ADMIN"));

// Get all users with filters and pagination
router.get("/", (req, res, next) => {
    console.log('=== ADMIN USERS ROUTE HIT ===');
    console.log('User making request:', req.user);
    next();
}, getAllUsers);

// Create new user
router.post("/create", createUser);

// Get user details
router.get("/:userId", getUserDetails);

// Toggle user active status
router.patch("/:userId/status", toggleUserStatus);

// Update user role
router.patch("/:userId/role", updateUserRole);

// Delete user
router.delete("/:userId", deleteUser);

// Get user activities
router.get("/:userId/activities", getUserActivities);

// Get user statistics
router.get("/:userId/stats", getUserStats);

// Reset user password
router.patch("/:userId/password", resetUserPassword);

// Create bulk USER1 accounts
router.post("/bulk-user1", createBulkUser1Accounts);

export default router; 