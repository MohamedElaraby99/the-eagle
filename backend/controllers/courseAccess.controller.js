import CourseAccessCode from "../models/courseAccessCode.model.js";
import CourseAccess from "../models/courseAccess.model.js";
import Course from "../models/course.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Admin: generate one-time codes to unlock a course for a limited duration
export const generateCourseAccessCodes = asyncHandler(async (req, res) => {
    const { courseId, accessStartAt, accessEndAt, quantity = 1, codeExpiresAt } = req.body;
    const adminId = req.user.id;

    if (!courseId) {
        throw new ApiError(400, 'courseId is required');
    }
    // Validate required window
    if (!accessStartAt || !accessEndAt) {
        throw new ApiError(400, 'accessStartAt and accessEndAt are required');
    }
    if (new Date(accessEndAt) <= new Date(accessStartAt)) {
        throw new ApiError(400, 'accessEndAt must be after accessStartAt');
    }
    if (quantity < 1 || quantity > 200) {
        throw new ApiError(400, 'quantity must be between 1 and 200');
    }

    const course = await Course.findById(courseId);
    if (!course) {
        throw new ApiError(404, 'Course not found');
    }

    const codes = [];
    for (let i = 0; i < quantity; i++) {
        let codeValue;
        let isUnique = false;
        while (!isUnique) {
            codeValue = CourseAccessCode.generateCode();
            const exists = await CourseAccessCode.findOne({ code: codeValue });
            if (!exists) isUnique = true;
        }
        const doc = await CourseAccessCode.create({
            code: codeValue,
            courseId,
            accessStartAt: new Date(accessStartAt),
            accessEndAt: new Date(accessEndAt),
            codeExpiresAt: codeExpiresAt ? new Date(codeExpiresAt) : undefined,
            createdBy: adminId
        });
        codes.push(doc);
    }

    return res.status(201).json(new ApiResponse(201, {
        codes: codes.map(c => ({
            id: c._id,
            code: c.code,
            courseId: c.courseId,
            accessStartAt: c.accessStartAt,
            accessEndAt: c.accessEndAt,
            codeExpiresAt: c.codeExpiresAt,
            isUsed: c.isUsed
        }))
    }, 'Course access code(s) generated'));
});

// User: redeem code to unlock course
export const redeemCourseAccessCode = asyncHandler(async (req, res) => {
    const { code, courseId } = req.body;
    const userId = req.user.id;
    if (!code) throw new ApiError(400, 'code is required');
    if (!courseId) throw new ApiError(400, 'courseId is required');

    const redeemable = await CourseAccessCode.findRedeemable(code);
    if (!redeemable) throw new ApiError(400, 'Invalid or expired code');

    // Check if the code is for the correct course
    if (redeemable.courseId.toString() !== courseId) {
        throw new ApiError(400, 'This code is not valid for this course');
    }

    // Ensure course exists
    const course = await Course.findById(redeemable.courseId);
    if (!course) throw new ApiError(404, 'Course not found for this code');

    const now = new Date();
    // Compute access window based on fixed date range
    let start = new Date(redeemable.accessStartAt);
    let end = new Date(redeemable.accessEndAt);
    if (now > end) throw new ApiError(400, 'This code is expired for its access window');

    // Create access record
    const access = await CourseAccess.create({
        userId,
        courseId: redeemable.courseId,
        accessStartAt: start,
        accessEndAt: end,
        source: 'code',
        codeId: redeemable._id
    });

    // Mark code as used
    redeemable.isUsed = true;
    redeemable.usedBy = userId;
    redeemable.usedAt = now;
    await redeemable.save();

    return res.status(200).json(new ApiResponse(200, {
        access: {
            id: access._id,
            courseId: access.courseId,
            accessStartAt: access.accessStartAt,
            accessEndAt: access.accessEndAt
        }
    }, 'Course unlocked successfully'));
});

// Check if current user has active access to a course
export const checkCourseAccess = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const userId = req.user.id;
    if (!courseId) throw new ApiError(400, 'courseId is required');

    const now = new Date();
    const access = await CourseAccess.findOne({ userId, courseId, accessEndAt: { $gt: now } }).sort({ accessEndAt: -1 });

    return res.status(200).json(new ApiResponse(200, {
        hasAccess: !!access,
        accessEndAt: access?.accessEndAt || null
    }, 'Access status'));
});

// Admin: list generated codes with filters
export const listCourseAccessCodes = asyncHandler(async (req, res) => {
    const { courseId, isUsed } = req.query;
    const query = {};
    if (courseId) query.courseId = courseId;
    if (typeof isUsed !== 'undefined') query.isUsed = isUsed === 'true';

    const codes = await CourseAccessCode.find(query)
        .populate('usedBy', 'name email') // Populate user name and email
        .populate('courseId', 'title') // Also populate course title
        .sort({ createdAt: -1 });
    
    return res.status(200).json(new ApiResponse(200, { codes }, 'Codes list'));
});


