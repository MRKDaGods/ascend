"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteResume = exports.uploadResume = exports.deleteCoverPhoto = exports.uploadCoverPhoto = exports.deleteProfilePicture = exports.uploadProfilePicture = exports.updateUserProfile = exports.getUserProfileById = exports.getUserProfile = void 0;
const validationMiddleware_1 = __importDefault(require("@shared/middleware/validationMiddleware"));
const userService_1 = require("../services/userService");
const userValidation_1 = require("../validations/userValidation");
/**
 * Retrieves the logged in user's profile
 *
 * @returns HTTP response
 * - 200 with the user's profile
 * - 404 if profile not found
 * - 500 if server error
 */
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    try {
        const profile = yield (0, userService_1.getProfile)(userId);
        if (!profile) {
            return res.status(404).json({ error: "Profile not found" });
        }
        res.json(profile);
    }
    catch (error) {
        console.error("Error retrieving profile:", error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.getUserProfile = getUserProfile;
/**
 * Retrieves a user's profile by ID
 *
 * @returns HTTP response
 * - 200 with the user's profile
 * - 400 if userId is invalid
 * - 404 if profile not found
 * - 500 if server error
 */
const getUserProfileById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    try {
        // Check if userId is valid
        if (!userId || isNaN(Number(userId))) {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        const profile = yield (0, userService_1.getProfile)(parseInt(userId));
        if (!profile) {
            return res.status(404).json({ error: "Profile not found" });
        }
        res.json(profile);
    }
    catch (error) {
        console.error("Error retrieving profile:", error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.getUserProfileById = getUserProfileById;
/**
 * Updates the logged in user's profile
 *
 * @returns HTTP response
 * - 200 with the updated profile
 * - 500 if server error
 */
exports.updateUserProfile = [
    ...userValidation_1.updateUserProfileValidationRules,
    validationMiddleware_1.default,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.user.id;
        try {
            const profileData = req.body;
            // Update profile
            const profile = yield (0, userService_1.createOrUpdateProfile)(userId, profileData);
            res.json(profile);
        }
        catch (error) {
            console.error("Error updating profile:", error);
            res.status(500).json({ error: "Server error" });
        }
    }),
];
/**
 * Uploads a profile picture for the logged in user
 *
 * @returns HTTP response
 * - 200 with the updated profile
 * - 400 if no file uploaded
 * - 500 if server error
 */
exports.uploadProfilePicture = [
    ...userValidation_1.uploadProfilePictureValidationRules,
    validationMiddleware_1.default,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        const userId = req.user.id;
        try {
            const profile = yield (0, userService_1.uploadProfilePicture)(userId, file);
            res.json(profile);
        }
        catch (error) {
            console.error("Error uploading profile picture:", error);
            res.status(500).json({ error: "Server error" });
        }
    }),
];
/**
 * Deletes the profile picture for the logged in user
 *
 * @returns HTTP response
 * - 200 with the updated profile
 * - 500 if server error
 */
const deleteProfilePicture = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    try {
        const profile = yield (0, userService_1.uploadProfilePicture)(userId, null);
        res.json(profile);
    }
    catch (error) {
        console.error("Error deleting profile picture:", error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.deleteProfilePicture = deleteProfilePicture;
/**
 * Uploads a cover photo for the logged in user
 *
 * @returns HTTP response
 * - 200 with the updated profile
 * - 400 if no file uploaded
 * - 500 if server error
 */
exports.uploadCoverPhoto = [
    ...userValidation_1.uploadCoverPhotoValidationRules,
    validationMiddleware_1.default,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        const userId = req.user.id;
        try {
            const profile = yield (0, userService_1.uploadCoverPhoto)(userId, file);
            res.json(profile);
        }
        catch (error) {
            console.error("Error uploading cover photo:", error);
            res.status(500).json({ error: "Server error" });
        }
    }),
];
/**
 * Deletes the cover photo for the logged in user
 *
 * @returns HTTP response
 * - 200 with the updated profile
 * - 500 if server error
 */
const deleteCoverPhoto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    try {
        const profile = yield (0, userService_1.uploadCoverPhoto)(userId, null);
        res.json(profile);
    }
    catch (error) {
        console.error("Error deleting cover photo:", error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.deleteCoverPhoto = deleteCoverPhoto;
/**
 * Uploads a resume for the logged in user
 *
 * @returns HTTP response
 * - 200 with the updated profile
 * - 400 if no file uploaded
 * - 500 if server error
 */
exports.uploadResume = [
    ...userValidation_1.uploadResumeValidationRules,
    validationMiddleware_1.default,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        const userId = req.user.id;
        try {
            const profile = yield (0, userService_1.uploadResume)(userId, file);
            res.json(profile);
        }
        catch (error) {
            console.error("Error uploading resume:", error);
            res.status(500).json({ error: "Server error" });
        }
    }),
];
/**
 * Deletes the resume for the logged in user
 *
 * @returns HTTP response
 * - 200 with the updated profile
 * - 500 if server error
 */
const deleteResume = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    try {
        const profile = yield (0, userService_1.uploadResume)(userId, null);
        res.json(profile);
    }
    catch (error) {
        console.error("Error deleting resume:", error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.deleteResume = deleteResume;
