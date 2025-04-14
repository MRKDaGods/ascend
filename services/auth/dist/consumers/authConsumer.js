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
exports.handleGetAdminUserRPC = exports.handleGetUserFCMTokenRPC = void 0;
const userService_1 = require("../services/userService");
/**
 * Handles the user.fcm_token_rpc event
 **/
const handleGetUserFCMTokenRPC = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Received user.fcm_token_rpc event:", JSON.stringify(payload));
    const user_id = payload.user_id;
    if (!user_id) {
        throw new Error("Invalid user ID");
    }
    // Get the user's FCM token
    const fcmToken = yield (0, userService_1.getUserFCMToken)(user_id);
    if (!fcmToken) {
        console.error(`Failed to retrieve FCM token for user ${user_id}`);
        return null;
    }
    console.log(`Retrieved FCM token for user ${user_id}: ${fcmToken}`);
    const response = {
        user_id,
        fcm_token: fcmToken,
    };
    return response;
});
exports.handleGetUserFCMTokenRPC = handleGetUserFCMTokenRPC;
/**
 * Handles the auth.get_admin_rpc event
 **/
const handleGetAdminUserRPC = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Received auth.get_admin_rpc event");
    // Get the admin user ID
    const user_id = yield (0, userService_1.getAdminUserId)();
    if (!user_id) {
        console.error("Failed to retrieve admin user ID");
        return null;
    }
    console.log(`Retrieved admin user ID: ${user_id}`);
    const response = {
        user_id,
    };
    return response;
});
exports.handleGetAdminUserRPC = handleGetAdminUserRPC;
