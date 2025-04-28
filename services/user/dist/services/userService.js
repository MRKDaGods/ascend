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
exports.getUserProfilePictureURL = exports.uploadResume = exports.uploadCoverPhoto = exports.uploadProfilePicture = exports.checkProfileExists = exports.createOrUpdateProfile = exports.getProfile = void 0;
const shared_1 = require("@ascend/shared");
const db_1 = __importDefault(require("@shared/config/db"));
const rabbitMQ_1 = require("@shared/rabbitMQ");
const files_1 = require("@shared/utils/files");
/** Retrieves a user's profile
 *
 * @param userId - The unique identifier of the user
 * @param keepFileIDs - Whether to keep the file IDs in the profile object
 * @returns Profile object if found, or null if no profile was found
 */
const getProfile = (userId_1, ...args_1) => __awaiter(void 0, [userId_1, ...args_1], void 0, function* (userId, keepFileIDs = false) {
    const profileResult = yield db_1.default.query("SELECT * FROM user_service.profiles WHERE user_id = $1", [userId]);
    // Found smth?
    if (profileResult.rows.length === 0) {
        return null;
    }
    const profile = profileResult.rows[0];
    // DB only stores file IDs, so we need to get the presigned URL for each file
    if (profile.profile_picture_id) {
        profile.profile_picture_url = yield (0, files_1.getPresignedUrl)(profile.profile_picture_id);
        if (!keepFileIDs) {
            delete profile.profile_picture_id;
        }
    }
    if (profile.cover_photo_id) {
        profile.cover_photo_url = yield (0, files_1.getPresignedUrl)(profile.cover_photo_id);
        if (!keepFileIDs) {
            delete profile.cover_photo_id;
        }
    }
    if (profile.resume_id) {
        profile.resume_url = yield (0, files_1.getPresignedUrl)(profile.resume_id);
        if (!keepFileIDs) {
            delete profile.resume_id;
        }
    }
    // Education
    const educationResult = yield db_1.default.query("SELECT * FROM user_service.education WHERE user_id = $1", [userId]);
    profile.education = educationResult.rows;
    // Experience
    const experienceResult = yield db_1.default.query("SELECT * FROM user_service.experience WHERE user_id = $1", [userId]);
    profile.experience = experienceResult.rows;
    // Projects
    const projectResult = yield db_1.default.query("SELECT * FROM user_service.projects WHERE user_id = $1", [userId]);
    profile.projects = projectResult.rows;
    // Courses
    const courseResult = yield db_1.default.query("SELECT * FROM user_service.courses WHERE user_id = $1", [userId]);
    profile.courses = courseResult.rows;
    // Skills
    const skillResult = yield db_1.default.query("SELECT s.* FROM user_service.skills s JOIN user_service.user_skills us ON s.id = us.skill_id WHERE us.user_id = $1", [userId]);
    profile.skills = skillResult.rows;
    // Interests
    const interestResult = yield db_1.default.query("SELECT i.* FROM user_service.interests i JOIN user_service.user_interests ui ON i.id = ui.interest_id WHERE ui.user_id = $1", [userId]);
    profile.interests = interestResult.rows;
    // Contact Info
    const contactInfoResult = yield db_1.default.query("SELECT * FROM user_service.contact_info WHERE user_id = $1", [userId]);
    profile.contact_info = contactInfoResult.rows[0] || undefined;
    return profile;
});
exports.getProfile = getProfile;
/** Creates or updates a user's profile
 *
 * @param userId - The unique identifier of the user
 * @param profileData - The profile data to create or update (first_name and last_name are required)
 * @returns The newly created or updated Profile object
 */
const createOrUpdateProfile = (userId, profileData) => __awaiter(void 0, void 0, void 0, function* () {
    const { first_name, last_name, industry, location, bio, privacy, show_school, show_current_company, website, additional_name, name_pronunciation, skills, education, experience, interests, projects, courses, contact_info, } = profileData;
    const get = (value, defaultValue) => {
        return value === undefined ? defaultValue : value;
    };
    const profile = yield (0, exports.getProfile)(userId);
    if (profile) {
        // Update defined fields
        yield db_1.default.query(`UPDATE user_service.profiles 
         SET first_name = $1, last_name = $2, industry = $3, location = $4, bio = $5, 
             privacy = $6, show_school = $7, show_current_company = $8, website = $9, 
             additional_name = $10, name_pronunciation = $11 
         WHERE user_id = $12`, [
            first_name,
            last_name,
            get(industry, profile.industry),
            get(location, profile.location),
            get(bio, profile.bio),
            get(privacy, profile.privacy),
            get(show_school, profile.show_school),
            get(show_current_company, profile.show_current_company),
            get(website, profile.website),
            get(additional_name, profile.additional_name),
            get(name_pronunciation, profile.name_pronunciation),
            userId,
        ]);
    }
    else {
        yield db_1.default.query(`INSERT INTO user_service.profiles 
         (user_id, first_name, last_name, industry, location, bio, privacy, show_school, show_current_company, website, additional_name, name_pronunciation) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`, [
            userId,
            first_name,
            last_name,
            industry,
            location,
            bio,
            privacy || "public",
            get(show_school, true),
            get(show_current_company, true),
            website,
            additional_name,
            name_pronunciation,
        ]);
    }
    // Update skills
    if (skills) {
        // Clear existing skills
        yield db_1.default.query("DELETE FROM user_service.user_skills WHERE user_id = $1", [
            userId,
        ]);
        // Create new skills if they dont exist, and assign their ids
        for (const skill of skills) {
            const skillResult = yield db_1.default.query("SELECT id FROM user_service.skills WHERE name = $1", [skill.name]);
            if (skillResult.rows.length === 0) {
                // Create new skill
                const skillResult = yield db_1.default.query("INSERT INTO user_service.skills (name) VALUES ($1) RETURNING id", [skill.name]);
                skill.id = skillResult.rows[0].id;
            }
            else {
                skill.id = skillResult.rows[0].id;
            }
        }
        for (const skill of skills) {
            yield db_1.default.query("INSERT INTO user_service.user_skills (user_id, skill_id) VALUES ($1, $2)", [userId, skill.id]);
        }
    }
    // Update education
    if (education) {
        // Clear existing education
        yield db_1.default.query("DELETE FROM user_service.education WHERE user_id = $1", [
            userId,
        ]);
        for (const edu of education) {
            yield db_1.default.query("INSERT INTO user_service.education (user_id, school, degree, field_of_study, start_date, end_date) VALUES ($1, $2, $3, $4, $5, $6)", [
                userId,
                edu.school,
                edu.degree,
                edu.field_of_study,
                edu.start_date,
                edu.end_date,
            ]);
        }
    }
    // Update experience
    if (experience) {
        // Clear existing experience
        yield db_1.default.query("DELETE FROM user_service.experience WHERE user_id = $1", [
            userId,
        ]);
        for (const exp of experience) {
            yield db_1.default.query("INSERT INTO user_service.experience (user_id, company, position, start_date, end_date, description) VALUES ($1, $2, $3, $4, $5, $6)", [
                userId,
                exp.company,
                exp.position,
                exp.start_date,
                exp.end_date,
                exp.description,
            ]);
        }
    }
    // Update interests
    if (interests) {
        // Clear existing interests
        yield db_1.default.query("DELETE FROM user_service.user_interests WHERE user_id = $1", [userId]);
        // Create new interests if they dont exist, and assign their ids
        for (const interest of interests) {
            const interestResult = yield db_1.default.query("SELECT id FROM user_service.interests WHERE name = $1", [interest.name]);
            if (interestResult.rows.length === 0) {
                // Create new interest
                const interestResult = yield db_1.default.query("INSERT INTO user_service.interests (name) VALUES ($1) RETURNING id", [interest.name]);
                interest.id = interestResult.rows[0].id;
            }
            else {
                interest.id = interestResult.rows[0].id;
            }
        }
        for (const interest of interests) {
            yield db_1.default.query("INSERT INTO user_service.user_interests (user_id, interest_id) VALUES ($1, $2)", [userId, interest.id]);
        }
    }
    // Update projects
    if (projects) {
        // Clear existing projects
        yield db_1.default.query("DELETE FROM user_service.projects WHERE user_id = $1", [
            userId,
        ]);
        for (const project of projects) {
            yield db_1.default.query("INSERT INTO user_service.projects (user_id, name, description, start_date, end_date, url) VALUES ($1, $2, $3, $4, $5, $6)", [
                userId,
                project.name,
                project.description,
                project.start_date,
                project.end_date,
                project.url,
            ]);
        }
    }
    // Update courses
    if (courses) {
        // Clear existing courses
        yield db_1.default.query("DELETE FROM user_service.courses WHERE user_id = $1", [
            userId,
        ]);
        for (const course of courses) {
            yield db_1.default.query("INSERT INTO user_service.courses (user_id, name, provider, completion_date) VALUES ($1, $2, $3, $4)", [userId, course.name, course.provider, course.completion_date]);
        }
    }
    // Update contact info
    if (contact_info) {
        // Clear existing contact info
        yield db_1.default.query("DELETE FROM user_service.contact_info WHERE user_id = $1", [
            userId,
        ]);
        yield db_1.default.query("INSERT INTO user_service.contact_info (user_id, profile_url, email, phone, phone_type, address, birthday) VALUES ($1, $2, $3, $4, $5, $6, $7)", [
            userId,
            contact_info.profile_url,
            contact_info.email,
            contact_info.phone,
            contact_info.phone_type,
            contact_info.address,
            contact_info.birthday,
        ]);
    }
    return (0, exports.getProfile)(userId);
});
exports.createOrUpdateProfile = createOrUpdateProfile;
/** Checks if a profile exists for a user
 *
 * @param userId - The unique identifier of the user
 */
const checkProfileExists = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.default.query("SELECT * FROM user_service.profiles WHERE user_id = $1", [userId]);
    return result.rows.length > 0;
});
exports.checkProfileExists = checkProfileExists;
/** Updates a user's profile picture
 *
 * @param userId - The unique identifier of the user
 * @param file - The file to upload as the profile picture
 * @returns The updated Profile object
 */
const uploadProfilePicture = (userId, file) => __awaiter(void 0, void 0, void 0, function* () {
    const profile = yield (0, exports.getProfile)(userId, true);
    if (!profile) {
        throw new Error("Profile not found");
    }
    let fileId = null;
    if (file) {
        // Construct payload and call the rpc
        const fileRpcQueue = (0, rabbitMQ_1.getRPCQueueName)(shared_1.Services.FILE, rabbitMQ_1.Events.FILE_UPLOAD_RPC);
        const payload = {
            user_id: userId,
            file_buffer: file.buffer.toString("base64"),
            file_name: file.originalname,
            mime_type: file.mimetype,
            file_size: file.size,
            context: "profile_picture",
        };
        const fileResponse = yield (0, rabbitMQ_1.callRPC)(fileRpcQueue, payload, 60000);
        fileId = fileResponse.file_id;
    }
    // Delete old profile picture
    if (profile.profile_picture_id) {
        const deletePayload = {
            file_id: profile.profile_picture_id,
        };
        yield (0, rabbitMQ_1.publishEvent)(rabbitMQ_1.Events.FILE_DELETE, deletePayload);
    }
    yield db_1.default.query(`UPDATE user_service.profiles 
     SET profile_picture_id = $1 
     WHERE user_id = $2`, [fileId, userId]);
    const updatedProfile = yield (0, exports.getProfile)(userId);
    return updatedProfile;
});
exports.uploadProfilePicture = uploadProfilePicture;
/** Updates a user's cover photo
 *
 * @param userId - The unique identifier of the user
 * @param file - The file to upload as the cover photo
 * @returns The updated Profile object
 */
const uploadCoverPhoto = (userId, file) => __awaiter(void 0, void 0, void 0, function* () {
    const profile = yield (0, exports.getProfile)(userId, true);
    if (!profile) {
        throw new Error("Profile not found");
    }
    let fileId = null;
    if (file) {
        // Construct payload and call the rpc
        const fileRpcQueue = (0, rabbitMQ_1.getRPCQueueName)(shared_1.Services.FILE, rabbitMQ_1.Events.FILE_UPLOAD_RPC);
        const payload = {
            user_id: userId,
            file_buffer: file.buffer.toString("base64"),
            file_name: file.originalname,
            mime_type: file.mimetype,
            file_size: file.size,
            context: "cover_photo",
        };
        const fileResponse = yield (0, rabbitMQ_1.callRPC)(fileRpcQueue, payload, 60000);
        fileId = fileResponse.file_id;
    }
    // Delete old cover photo
    if (profile.cover_photo_id) {
        const deletePayload = {
            file_id: profile.cover_photo_id,
        };
        yield (0, rabbitMQ_1.publishEvent)(rabbitMQ_1.Events.FILE_DELETE, deletePayload);
    }
    yield db_1.default.query(`UPDATE user_service.profiles 
     SET cover_photo_id = $1 
     WHERE user_id = $2`, [fileId, userId]);
    const updatedProfile = yield (0, exports.getProfile)(userId);
    return updatedProfile;
});
exports.uploadCoverPhoto = uploadCoverPhoto;
/** Updates a user's resume
 *
 * @param userId - The unique identifier of the user
 * @param file - The file to upload as the resume
 * @returns The updated Profile object
 */
const uploadResume = (userId, file) => __awaiter(void 0, void 0, void 0, function* () {
    const profile = yield (0, exports.getProfile)(userId, true);
    if (!profile) {
        throw new Error("Profile not found");
    }
    let fileId = null;
    if (file) {
        // Construct payload and call the rpc
        const fileRpcQueue = (0, rabbitMQ_1.getRPCQueueName)(shared_1.Services.FILE, rabbitMQ_1.Events.FILE_UPLOAD_RPC);
        const payload = {
            user_id: userId,
            file_buffer: file.buffer.toString("base64"),
            file_name: file.originalname,
            mime_type: file.mimetype,
            file_size: file.size,
            context: "resume",
        };
        const fileResponse = yield (0, rabbitMQ_1.callRPC)(fileRpcQueue, payload, 60000);
        fileId = fileResponse.file_id;
    }
    // Delete old resume
    if (profile.resume_id) {
        const deletePayload = {
            file_id: profile.resume_id,
        };
        yield (0, rabbitMQ_1.publishEvent)(rabbitMQ_1.Events.FILE_DELETE, deletePayload);
    }
    yield db_1.default.query(`UPDATE user_service.profiles 
     SET resume_id = $1 
     WHERE user_id = $2`, [fileId, userId]);
    const updatedProfile = yield (0, exports.getProfile)(userId);
    return updatedProfile;
});
exports.uploadResume = uploadResume;
/**
 * Retrieves a user's profile picture URL
 *
 * @param userId - The unique identifier of the user
 * @returns The URL of the user's profile picture, or null if no profile picture was found
 */
const getUserProfilePictureURL = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const profile = yield (0, exports.getProfile)(userId, false);
    return (profile === null || profile === void 0 ? void 0 : profile.profile_picture_url) || null;
});
exports.getUserProfilePictureURL = getUserProfilePictureURL;
