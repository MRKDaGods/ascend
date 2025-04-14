"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRPCQueueName = exports.getQueueName = exports.Events = void 0;
var Events;
(function (Events) {
    // =======================AUTH-EVENTS=======================
    Events["AUTH_GET_ADMIN_RPC"] = "get_admin_rpc";
    Events["AUTH_FCM_TOKEN_RPC"] = "fcm_token_rpc";
    // =======================USER-EVENTS=======================
    Events["USER_CREATED"] = "user_created";
    Events["USER_PROFILE_PIC_RPC"] = "profile_pic_rpc";
    Events["USER_PROFILE_RPC"] = "profile_rpc";
    // =======================FILE-EVENTS=======================
    Events["FILE_URL_RPC"] = "file_url_rpc";
    Events["FILE_UPLOAD_RPC"] = "file_upload_rpc";
    Events["FILE_DELETE"] = "file_delete";
})(Events || (exports.Events = Events = {}));
/**
 * Gets the queue name for the given event locally
 */
const getQueueName = (event) => {
    // Each service has its own queue
    const service = process.env.SERVICE_NAME;
    if (!service) {
        throw new Error("Missing required SERVICE_NAME environment variable");
    }
    return `${service}.${event}.queue`;
};
exports.getQueueName = getQueueName;
/**
 * Gets the RPC queue name for the given service and event
 */
const getRPCQueueName = (rpcHostService, event) => {
    return `${rpcHostService}.${event}.queue`;
};
exports.getRPCQueueName = getRPCQueueName;
