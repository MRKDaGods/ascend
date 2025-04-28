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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileFromMinIO = exports.getFileMetadata = exports.getPresignedUrl = exports.deleteFileFromMinIO = exports.uploadFileToMinIO = exports.initMinIO = void 0;
const db_1 = __importDefault(require("@shared/config/db"));
const jwt_1 = require("@shared/utils/jwt");
const minio_1 = require("minio");
const stream_1 = require("stream");
const minioClient = new minio_1.Client({
    endPoint: process.env.MINIO_ENDPOINT || "minio",
    port: parseInt(process.env.MINIO_PORT || "9000"),
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
});
const bucketName = process.env.MINIO_BUCKET || "ascend-files";
/**
 * Initializes the MinIO client and creates the bucket if it doesn't exist
 */
const initMinIO = () => __awaiter(void 0, void 0, void 0, function* () {
    // Create the bucket if it doesn't exist
    const exists = yield minioClient.bucketExists(bucketName);
    if (!exists) {
        yield minioClient.makeBucket(bucketName);
        console.log(`Created bucket: ${bucketName}`);
    }
});
exports.initMinIO = initMinIO;
/**
 * Uploads a file to MinIO and stores the metadata in the database
 *
 * @param userId - The unique identifier of the user
 * @param file - The file to upload
 * @param context - The context of the file (profile, resume, etc)
 * @returns The unique identifier of the file
 */
const uploadFileToMinIO = (userId, file, context) => __awaiter(void 0, void 0, void 0, function* () {
    // Generate a unique object name
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.originalname}`; // 1621234567890-1234567890-profile.jpg
    // Upload the file to MinIO
    const stream = stream_1.Readable.from(file.buffer);
    yield minioClient.putObject(bucketName, fileName, stream, file.size, {
        "Content-Type": file.mimetype,
    });
    // Store in db
    const result = yield db_1.default.query("INSERT INTO file_service.files (user_id, file_name, mime_type, file_size, context) VALUES ($1, $2, $3, $4, $5) RETURNING *", [userId, fileName, file.mimetype, file.size, context]);
    return result.rows[0].id;
});
exports.uploadFileToMinIO = uploadFileToMinIO;
/**
 * Deletes a file from MinIO and removes the metadata from the database
 *
 * @param fileId - The unique identifier of the file
 */
const deleteFileFromMinIO = (fileId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.default.query("SELECT file_name FROM file_service.files WHERE id = $1", [fileId]);
    if (result.rows.length === 0) {
        throw new Error("File not found");
    }
    const fileName = result.rows[0].file_name;
    yield minioClient.removeObject(bucketName, fileName);
    yield db_1.default.query("DELETE FROM file_service.files WHERE id = $1", [fileId]);
});
exports.deleteFileFromMinIO = deleteFileFromMinIO;
/**
 * Generates a presigned URL for a file
 *
 * @param fileId - The unique identifier of the file
 * @returns The presigned URL
 */
const getPresignedUrl = (fileId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.default.query("SELECT * FROM file_service.files WHERE id = $1", [fileId]);
    if (result.rows.length === 0) {
        throw new Error("File not found");
    }
    // Create a presigned URL that expires in 1 hour
    const token = (0, jwt_1.generateToken)({
        file_id: fileId,
    }, "1h");
    return `${process.env.GATEWAY_ENDPOINT}/files/view?token=${token}`;
});
exports.getPresignedUrl = getPresignedUrl;
/**
 * Retrieves file metadata
 *
 * @param fileId - The unique identifier of the file
 * @returns The file metadata
 */
const getFileMetadata = (fileId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.default.query("SELECT * FROM file_service.files WHERE id = $1", [fileId]);
    return result.rows.length > 0 ? result.rows[0] : null;
});
exports.getFileMetadata = getFileMetadata;
/**
 * Retrieves a file from MinIO
 *
 * @param fileId - The unique identifier of the file
 * @returns The file buffer
 */
const getFileFromMinIO = (fileId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    const result = yield db_1.default.query("SELECT file_name FROM file_service.files WHERE id = $1", [fileId]);
    if (result.rows.length === 0) {
        throw new Error("File not found");
    }
    const fileName = result.rows[0].file_name;
    const stream = yield minioClient.getObject(bucketName, fileName);
    const buffers = [];
    try {
        for (var _d = true, stream_2 = __asyncValues(stream), stream_2_1; stream_2_1 = yield stream_2.next(), _a = stream_2_1.done, !_a; _d = true) {
            _c = stream_2_1.value;
            _d = false;
            const chunk = _c;
            buffers.push(chunk);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = stream_2.return)) yield _b.call(stream_2);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return Buffer.concat(buffers);
});
exports.getFileFromMinIO = getFileFromMinIO;
