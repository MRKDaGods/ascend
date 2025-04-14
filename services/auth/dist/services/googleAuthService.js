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
exports.verifyGoogleToken = void 0;
const google_auth_library_1 = require("google-auth-library");
const CLIENT_IDS = [
    process.env.GOOGLE_CLIENT_ID_WEB || "",
    process.env.GOOGLE_CLIENT_ID_IOS || "",
    process.env.GOOGLE_CLIENT_ID_ANDROID || "",
].filter(Boolean);
const googleClient = new google_auth_library_1.OAuth2Client();
const verifyGoogleToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const ticket = yield googleClient.verifyIdToken({
        idToken: token,
        audience: CLIENT_IDS,
    });
    return ticket.getPayload();
});
exports.verifyGoogleToken = verifyGoogleToken;
