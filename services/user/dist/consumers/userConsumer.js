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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetUserProfileRequestRPC = exports.handleUserProfilePicRequestRPC = exports.handleUserCreated = void 0;
const userService_1 = require("../services/userService");
/**
 * Handles the user.created event
 */
const handleUserCreated = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Received user.created event:", payload);
    // Check if profile already exists
    const exists = yield (0, userService_1.checkProfileExists)(payload.user_id);
    if (exists) {
        console.log(`Profile for user ${payload.user_id} already exists`);
        return;
    }
    // Create new profile
    yield (0, userService_1.createOrUpdateProfile)(payload.user_id, {
        first_name: payload.first_name,
        last_name: payload.last_name,
        contact_info: {
            email: payload.email,
            user_id: payload.user_id,
        },
    });
    console.log(`Created profile for user ${payload.user_id}`);
});
exports.handleUserCreated = handleUserCreated;
/**
 * Handles the user.profile_pic_rpc event
 **/
const handleUserProfilePicRequestRPC = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Received user.profile_pic_rpc event:", payload);
    const user_id = payload.user_id;
    if (!user_id) {
        console.error("Invalid user ID");
        return null;
    }
    // Get the user's profile picture
    const profilePicUrl = yield (0, userService_1.getUserProfilePictureURL)(user_id);
    if (!profilePicUrl) {
        console.error(`Failed to retrieve profile picture for user ${user_id}`);
        return null;
    }
    console.log(`Retrieved profile picture for user ${user_id}: ${profilePicUrl}`);
    const response = {
        user_id,
        profile_pic_url: profilePicUrl,
    };
    return response;
});
exports.handleUserProfilePicRequestRPC = handleUserProfilePicRequestRPC;
/**
 * Handles the user.profile_rpc event
 **/
const handleGetUserProfileRequestRPC = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Received user.profile_rpc event:", payload);
    const user_id = payload.user_id;
    if (!user_id) {
        console.error("Invalid user ID");
        return null;
    }
    // Get the user's profile
    const profile = yield (0, userService_1.getProfile)(user_id);
    if (!profile) {
        console.error(`Failed to retrieve profile for user ${user_id}`);
        return null;
    }
    console.log(`Retrieved profile for user ${user_id}`);
    const response = {
        profile,
    };
    return response;
});
exports.handleGetUserProfileRequestRPC = handleGetUserProfileRequestRPC;
