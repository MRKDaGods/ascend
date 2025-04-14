// src/app/api/createPost.ts
import API from "./api";

interface CreatePostPayload {
  content: string;
  privacy: string;
  type: "image" | "video" | "document" | "link";
  title: string;
  description: string;
  mediaFiles: File[]; // Multiple media files
}

export const createPost = async ({
  content,
  privacy,
  type,
  title,
  description,
  mediaFiles,
}: CreatePostPayload) => {
  const formData = new FormData();
  formData.append("content", content);
  formData.append("privacy", privacy);
  formData.append("type", type);
  formData.append("title", title);
  formData.append("description", description);

  mediaFiles.forEach((file) => {
    formData.append("media", file); // field name must match backend
  });

  console.log("FormDataaaaaaaaaaaaaaaaaaaaaa:", formData); // Log FormData for debugging

  const response = await API.post("http://api.ascendx.tech/post/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "x-no-parse-body": "1", // required for backend to skip JSON parsing
    },
  });

  return response.data;
};
