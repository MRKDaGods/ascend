export declare enum Events {
    AUTH_GET_ADMIN_RPC = "get_admin_rpc",// Admin get user RPC request
    AUTH_FCM_TOKEN_RPC = "fcm_token_rpc",// Auth FCM token RPC request
    USER_CREATED = "user_created",// A new user has been created
    USER_PROFILE_PIC_RPC = "profile_pic_rpc",// User profile picture RPC request
    USER_PROFILE_RPC = "profile_rpc",// User profile RPC request
    FILE_URL_RPC = "file_url_rpc",
    FILE_UPLOAD_RPC = "file_upload_rpc",
    FILE_DELETE = "file_delete"
}
/**
 * Gets the queue name for the given event locally
 */
export declare const getQueueName: (event: string) => string;
/**
 * Gets the RPC queue name for the given service and event
 */
export declare const getRPCQueueName: (rpcHostService: string, event: string) => string;
