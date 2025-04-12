// import {
//   callRPC,
//   publishEvent,
//   FileUploadRequestPayload,
//   FileUploadResponsePayload,
//   FileDeletePayload,
//   FilePresignedUrlRequestPayload,
//   FilePresignedUrlResponsePayload
// } from "@shared/rabbitMQ";

// export class PostFileProducer {
//   private static instance: PostFileProducer;
  
//   private constructor() {}

//   static getInstance(): PostFileProducer {
//     if (!PostFileProducer.instance) {
//       PostFileProducer.instance = new PostFileProducer();
//     }
//     return PostFileProducer.instance;
//   }

//   async uploadFile(file: Express.Multer.File, userId: number): Promise<number> {
//     try {
//       const payload: FileUploadRequestPayload = {
//         user_id: userId,
//         file_buffer: file.buffer.toString('base64'),
//         file_name: file.originalname,
//         mime_type: file.mimetype,
//         file_size: file.size,
//         context: 'post'
//       };

//       const response = await callRPC<FileUploadResponsePayload>(
//         'file.upload',
//         payload
//       );

//       if (!response?.file_id) {
//         throw new Error('File upload failed: No file ID received');
//       }

//       return response.file_id;
//     } catch (error) {
//       console.error('Error uploading file:', error);
//       throw new Error('File upload failed');
//     }
//   }

//   async deleteFile(fileId: number): Promise<void> {
//     try {
//       const payload: FileDeletePayload = {
//         file_id: fileId
//       };

//       await publishEvent('file.delete', payload);
//     } catch (error) {
//       console.error('Error deleting file:', error);
//       throw new Error('File deletion failed');
//     }
//   }

//   async getPresignedUrl(fileId: number): Promise<string> {
//     try {
//       const payload: FilePresignedUrlRequestPayload = {
//         file_id: fileId
//       };

//       const response = await callRPC<FilePresignedUrlResponsePayload>(
//         'file.get_url',
//         payload
//       );

//       if (!response?.presigned_url) {
//         throw new Error('Failed to get presigned URL');
//       }

//       return response.presigned_url;
//     } catch (error) {
//       console.error('Error getting presigned URL:', error);
//       throw new Error('Failed to get file URL');
//     }
//   }
// }

// export default PostFileProducer.getInstance();