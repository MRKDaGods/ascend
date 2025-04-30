// ✅ company.ts
import API from "./api";

import { MediaFile } from "@/app/stores/useCompanyPostStore";

const API_BASE = "https://api.ascendx.tech";
const COMPANY_BASE = `${API_BASE}/company`;

const getAuthToken = (): string => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found. Please login.");
  }
  return token;
};

export const getCompanyProfileAPI = async (companyId: number) => {
  
  const response = await API.get(`${COMPANY_BASE}/companies/${companyId}`, {
  });
  return response.data.data.company;
};

export const createCompanyProfileAPI = async (payload: any) => {
  
  try {
    const response = await API.post(
      `${COMPANY_BASE}/companies`,
      JSON.stringify(payload), // Ensure correct serialization
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.data.company;
  } catch (error: any) {
    console.error("❌ Failed to create company profile:", error.response?.data || error.message);
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
  const response = await API.delete(`${COMPANY_BASE}/companies/${companyId}`, {
  });
  return response.data.data.msg;
};

export const getCompanyAnnouncementsAPI = async (companyId: number) => {
  const response = await API.get(`${COMPANY_BASE}/companies/${companyId}/announcements`, {
  });
  return response.data.data.announcements;
};

export const createCompanyAnnouncementAPI = async (
  companyId: number,
  content: string,
  media: MediaFile[]
) => {
  const token = getAuthToken();

  const announcement_photos = media
    .filter((m) => m.type === "image")
    .map((fileObj) => {
      const base64 = fileObj.preview.replace(/^data:.+;base64,/, "");
      return {
        buffer: base64,
        file_name: fileObj.file.name,
        file_size: fileObj.file.size,
        mime_type: fileObj.file.type,
      };
    });

  const announcement_video = media
    .find((m) => m.type === "video");

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
    `${COMPANY_BASE}/companies/${companyId}/announcements/${announcementId}`,
  );
  return response.data.data.msg;
};

// ✅ Add this to company.ts

export const updateCompanyAnnouncementAPI = async (
  companyId: number,
  announcementId: number,
  content: string,
  media: MediaFile[]
) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found.");

  const announcement_photos = media
    .filter((m) => m.type === "image")
    .map((fileObj) => {
      const base64 = fileObj.preview.replace(/^data:.+;base64,/, "");
      return {
        buffer: base64,
        file_name: fileObj.file.name,
        file_size: fileObj.file.size,
        mime_type: fileObj.file.type,
      };
    });

  const announcement_video = media.find((m) => m.type === "video");

  const payload: any = {
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

  const response = await API.patch(
    `${COMPANY_BASE}/companies/${companyId}/announcements/${announcementId}`,
    JSON.stringify(payload),
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.data.announcement;
};





