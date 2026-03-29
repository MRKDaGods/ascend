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
exports.handleUserCreated = void 0;
const notificationService_1 = require("../services/notificationService");
const handleUserCreated = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Received user.created event:", payload);
    // Send welcome notification to user
    console.log(`Sending welcome notification to user ${payload.user_id}`);
    yield (0, notificationService_1.sendWelcomeNotification)(payload.user_id);
});
exports.handleUserCreated = handleUserCreated;
