// src/app/stores/useCreateCompanyStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  createCompanyProfileAPI,
  getCompanyProfileAPI,
  updateCompanyProfileAPI,
  deleteCompanyProfileAPI,
  getCompanyAnnouncementsAPI,
} from "@/api/company";

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result); // ✅ Keep full data URI format: data:image/jpeg;base64,...
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};


interface CompanyState {
  companyId: number | null;
  name: string;
  url: string;
  industry: string;
  domainName: string;
  location: string;
  description: string;
  profileImage: string | null;
  coverImage: string | null;
  logoFile: File | null;
  coverFile: File | null;
  announcements: any[];

  getCompanyAnnouncements: (companyId: number) => Promise<void>;
  setCompanyInfo: (data: Partial<CompanyState>) => void;
  fetchCompanyProfile: (companyId: number) => Promise<void>;
  createCompanyProfile: () => Promise<void>;
  updateCompanyProfile: (fieldsToUpdate: Partial<CompanyState>) => Promise<void>;
  deleteCompanyProfile: () => Promise<void>;
}

export const useCompanyStore = create<CompanyState>()(
  persist(
    (set, get) => ({
      companyId: null,
      name: "",
      url: "",
      industry: "",
      domainName: "",
      location: "",
      description: "",
      profileImage: null,
      coverImage: null,
      logoFile: null,
      coverFile: null,

      setCompanyInfo: (data) => set((state) => ({ ...state, ...data })),

      fetchCompanyProfile: async (companyId) => {
        try {
          const company = await getCompanyProfileAPI(companyId);
          set({
            companyId: company.company_id,
            name: company.company_name || "",
            url: company.company_domain_name
              ? `https://ascendx.tech/company/${company.company_domain_name}`
              : "",
            industry: company.industry || "",
            domainName: company.company_domain_name || "",
            location: company.location || "",
            description: company.description || "",
            profileImage: company.profile_photo_url || null,
            coverImage: company.cover_photo_url || null,
          });
          localStorage.setItem("companyId", company.company_id.toString());
        } catch (error) {
          console.error("Failed to fetch company profile:", error);
        }
      },

      createCompanyProfile: async () => {
        try {
          const {
            name,
            description,
            industry,
            location,
            domainName,
            logoFile,
            coverFile,
          } = get();

          if (!(logoFile instanceof File) || !(coverFile instanceof File)) {
            throw new Error("Missing or invalid logo/cover file");
          }

          const profileBase64 = await fileToBase64(logoFile);
          const coverBase64 = await fileToBase64(coverFile);

          const payload = {
            name: name.trim().slice(0, 50),
            description: description.trim(),
            industry: industry.trim().slice(0, 50),
            location: location.trim().slice(0, 50),
            company_domain_name: domainName.trim().slice(0, 50),
            profile_photo: {
              buffer: profileBase64, // now full "data:image/jpeg;base64,..."
              file_name: logoFile.name,
              file_size: logoFile.size.toString(),
              mime_type: logoFile.type,
            },
            cover_photo: {
              buffer: coverBase64, // same here
              file_name: coverFile.name,
              file_size: coverFile.size.toString(),
              mime_type: coverFile.type,
            },
          };
          console.log("🚀 Final payload being sent to backend:", payload);

          

          const result = await createCompanyProfileAPI(payload);

          set({
            companyId: result.company_id,
            domainName: result.company_domain_name,
            name: result.company_name,
            description: result.description,
            industry: result.industry,
            location: result.location,
            profileImage: result.profile_photo_url,
            coverImage: result.cover_photo_url,
          });

          localStorage.setItem("companyId", result.company_id.toString());
          console.log("✅ Company profile created successfully!");
        } catch (error) {
          console.error("❌ Failed to create company profile:", error);
          throw error;
        }
      },

      announcements: [],

      getCompanyAnnouncements: async (companyId) => {
        try {
          const announcements = await getCompanyAnnouncementsAPI(companyId);
          set({ announcements });
          console.log("📢 Announcements fetched:", announcements);
        } catch (error) {
          console.error("❌ Failed to fetch announcements:", error);
        }
      },

      deleteCompanyProfile: async () => {
        try {
          let companyId = get().companyId;
          if (!companyId) {
            const storedId = localStorage.getItem("companyId");
            if (storedId) {
              companyId = parseInt(storedId, 10);
              set({ companyId });
            }
          }

          if (!companyId) throw new Error("No company ID to delete.");

          await deleteCompanyProfileAPI(companyId);

          set({
            companyId: null,
            name: "",
            url: "",
            industry: "",
            domainName: "",
            location: "",
            description: "",
            profileImage: null,
            coverImage: null,
            logoFile: null,
            coverFile: null,
          });

          localStorage.removeItem("companyId");
          console.log("✅ Company profile deleted.");
        } catch (error) {
          console.error("❌ Failed to delete company profile:", error);
          throw error;
        }
      },

      updateCompanyProfile: async (fieldsToUpdate) => {
        try {
          let companyId = get().companyId;
          if (!companyId) {
            const storedId = localStorage.getItem("companyId");
            if (storedId) {
              companyId = parseInt(storedId, 10);
              set({ companyId });
            }
          }
          if (!companyId) throw new Error("No company ID available.");

          const payload: any = {};
          if (fieldsToUpdate.name) payload.name = fieldsToUpdate.name;
          if (fieldsToUpdate.description) payload.description = fieldsToUpdate.description;
          if (fieldsToUpdate.industry) payload.industry = fieldsToUpdate.industry;
          if (fieldsToUpdate.location) payload.location = fieldsToUpdate.location;
          if (fieldsToUpdate.domainName) payload.company_domain_name = fieldsToUpdate.domainName;

          if (fieldsToUpdate.logoFile instanceof File) {
            const base64 = await fileToBase64(fieldsToUpdate.logoFile);
            payload.profile_photo = {
              buffer: base64,
              file_name: fieldsToUpdate.logoFile.name,
              file_size: fieldsToUpdate.logoFile.size.toString(),
              mime_type: fieldsToUpdate.logoFile.type,
            };
          }

          if (fieldsToUpdate.coverFile instanceof File) {
            const base64 = await fileToBase64(fieldsToUpdate.coverFile);
            payload.cover_photo = {
              buffer: base64,
              file_name: fieldsToUpdate.coverFile.name,
              file_size: fieldsToUpdate.coverFile.size.toString(),
              mime_type: fieldsToUpdate.coverFile.type,
            };
          }

          const updatedCompany = await updateCompanyProfileAPI(companyId, payload);

          set((prev) => ({
            ...prev,
            ...fieldsToUpdate,
            name: updatedCompany.company_name,
            description: updatedCompany.description,
            industry: updatedCompany.industry,
            location: updatedCompany.location,
            domainName: updatedCompany.company_domain_name,
            profileImage: updatedCompany.profile_photo_url,
            coverImage: updatedCompany.cover_photo_url,
          }));

          console.log("✅ Company profile updated!");
        } catch (error) {
          console.error("❌ Failed to update company profile:", error);
          throw error;
        }
      },
    }),
    {
      name: "company-storage",
    }
  )
);