import API from "./api";

import { MediaFile } from "@/app/stores/useCompanyPostStore";
import { useProfileStore } from "@/app/stores/useProfileStore";

const API_BASE = "https://api.ascendx.tech";
const COMPANY_BASE = `${API_BASE}/company`;
const JOB_BASE = `${API_BASE}/job`;

export interface CompanyResponse {
  company_id: number;
  company_name: string;
  company_domain_name: string;
  profile_photo_url?: string;
  cover_photo_url?: string;
  description: string;
  industry: string;
  location: string;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const getCompanyProfileAPI = async (companyId: number) => {

  const response = await API.get(`${COMPANY_BASE}/companies/${companyId}`, {
  });

  return response.data.data.company;
};


export const getAllCompanyProfilesAPI = async () => {
  const response = await API.get(`${COMPANY_BASE}/companies`);
  return response.data.data.companies;
};

export const getCompanyFollowersAPI = async (companyId: number) => {
  const response = await API.get(`${COMPANY_BASE}/companies/${companyId}/followers`);
  return response.data.data.followers;
};

export const followCompanyAPI = async (companyId: number) => {

  try {
    const response = await API.post(
      `${COMPANY_BASE}/companies/${companyId}/follow`,
      {}, // ✅ REQUIRED: JSON empty body
      {
        headers: {
          "Content-Type": "application/json", // ✅ force proper content type
        },
      }
    );
    return response.data.data;
  } catch (err: any) {
    console.error("❌ Failed to follow company:", err?.response?.data || err);
    throw err;
  }
};



export const unfollowCompanyAPI = async (companyId: number) => {

  try {
    const response = await API.delete(
      `${COMPANY_BASE}/companies/${companyId}/unfollow`,
    );
    return response.data.data;
  } catch (err: any) {
    console.error("❌ Failed to unfollow company:", err?.response?.data || err);
    throw err;
  }
};


export const createCompanyProfileAPI = async (payload: any) => {
  try {
    const response = await API.post(
      `${COMPANY_BASE}/companies`,
      JSON.stringify(payload),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.data.company;
  } catch (error: any) {
    if (error.response?.data) {
      console.error("❌ Failed to create company profile:", error.response.data);
    } else {
      console.error("❌ Unknown error:", error);
    }
    throw error;
  }
};



export const updateCompanyProfileAPI = async (companyId: number, payload: any) => {
  const response = await API.patch(
    `${COMPANY_BASE}/companies/${companyId}`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.data.company;
};

export const deleteCompanyProfileAPI = async (companyId: number) => {
  const response = await API.delete(`${COMPANY_BASE}/companies/${companyId}`);
  return response.data.data.msg;
};

export const getCompanyAnnouncementsAPI = async (companyId: number) => {
  const response = await API.get(`${COMPANY_BASE}/companies/${companyId}/announcements`);
  return response.data.data.announcements;
};

export const createCompanyAnnouncementAPI = async (
  companyId: number,
  content: string,
  media: MediaFile[]
) => {
  const announcement_photos = media
    .filter((m) => m.type === "image" && m.file && m.file.name)
    .map((fileObj) => {
      const base64 = fileObj.preview.replace(/^data:.+;base64,/, "");
      return {
        buffer: base64,
        file_name: fileObj.file.name,
        file_size: fileObj.file.size,
        mime_type: fileObj.file.type,
      };
    });

  const announcement_video = media.find((m) => m.type === "video" && m.file && m.file.name);

  const payload: any = {
    company_id: companyId,
    content,
    announcement_photos,
  };

  if (announcement_video) {
    const base64 = announcement_video.preview.replace(/^data:.+;base64,/, "");
    payload.announcement_video = {
      buffer: base64,
      file_name: announcement_video.file.name,
      file_size: announcement_video.file.size,
      mime_type: announcement_video.file.type,
    };
  }

  const response = await API.post(
    `${COMPANY_BASE}/companies/${companyId}/announcements`,
    JSON.stringify(payload),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.data.announcement;
};

export const deleteCompanyAnnouncementAPI = async (
  companyId: number,
  announcementId: number
) => {
  const response = await API.delete(
    `${COMPANY_BASE}/companies/${companyId}/announcements/${announcementId}`
  );
  return response.data.data.msg;
};

export const updateCompanyAnnouncementAPI = async (
  companyId: number,
  announcementId: number,
  content: string,
  media: MediaFile[],
  deletedImageIds: number[] = []
) => {

  const announcement_photos = media
    .filter((m) => m.type === "image" && m.file && m.file.name && m.preview)
    .map((fileObj) => {
      const base64 = fileObj.preview.replace(/^data:.+;base64,/, "");
      return {
        buffer: base64,
        file_name: fileObj.file.name,
        file_size: fileObj.file.size,
        mime_type: fileObj.file.type,
      };
    });

  const image_urls = media
    .filter((m) => m.type === "image" && m.url && typeof m.url === "string")
    .map((m) => m.url);

  const announcement_video = media.find((m) => m.type === "video" && m.file && m.file.name);

  const payload: any = { content, deleted_image_ids: deletedImageIds };

  if (announcement_photos.length > 0) payload.announcement_photos = announcement_photos;
  if (image_urls.length > 0) payload.image_urls = image_urls;

  if (announcement_video) {
    const base64 = announcement_video.preview.replace(/^data:.+;base64,/, "");
    payload.announcement_video = {
      buffer: base64,
      file_name: announcement_video.file.name,
      file_size: announcement_video.file.size,
      mime_type: announcement_video.file.type,
    };
  }

  const response = await API.patch(
    `${COMPANY_BASE}/companies/${companyId}/announcements/${announcementId}`,
    JSON.stringify(payload),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.data.announcement;
};

export const searchForCompaniesAPI = async () => {
  try {
    // Explicitly fetch page 1 with a very high limit to get all companies
    const url = `${COMPANY_BASE}/companies/data/search?limit=1000&page=1`;
    const response = await API.get(url);
    return response.data.data.companies;
  } catch (err: any) {
    console.error("❌ Failed to fetch all companies via searchForCompaniesAPI:", err?.response?.data || err);
    throw err;
  }
};

export const getCompanyJobsAPI = async (companyId: number, page = 1) => {
  const response = await API.get(`${JOB_BASE}/company/${companyId}?page=${page}`);
  return response.data.data; // contains { data: [...jobs], pagination: {...} }
};


