// src/app/stores/useCreateCompanyStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  createCompanyProfileAPI,
  getCompanyProfileAPI,
  updateCompanyProfileAPI,
  deleteCompanyProfileAPI,
  getCompanyAnnouncementsAPI,
  followCompanyAPI,
  unfollowCompanyAPI,
  getCompanyFollowersAPI,
  getAllCompanyProfilesAPI,
  CompanyResponse,
  searchForCompaniesAPI,
  getCompanyAnalyticsAPI,
} from "@/api/company";

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

interface Company {
  company_id: number;
  company_name: string;
  description: string;
  location: string;
  industry: string;
  profile_photo_url?: string;
}

interface CompanyState {
  companyId: number | null;
  name: string;
  industry: string;
  domainName: string;
  location: string;
  description: string;
  profileImage: string | null;
  coverImage: string | null;
  logoFile: File | null;
  coverFile: File | null;
  announcements: any[];

  companies: Company[];
  exploreCompanies: Company[];
  followerCounts: Record<number, number>;
  followingStatus: Record<number, boolean>;
  analytics: {
    number_of_job_posts: number;
    number_of_followrs: number;
    number_of_announcements: number;
  } | null;
  

  setCompanyInfo: (data: Partial<CompanyState>) => void;
  fetchCompanyProfile: (companyId: number) => Promise<void>;
  fetchAllCompanies: () => Promise<void>;
  fetchExploreCompanies: () => Promise<void>;
  fetchCompanyFollowers: (companyId: number, userId: number | null) => Promise<void>;
  toggleFollowCompany: (companyId: number, userId: number) => Promise<'followed' | 'unfollowed'>;
  createCompanyProfile: () => Promise<CompanyResponse>;
  updateCompanyProfile: (fieldsToUpdate: Partial<CompanyState>) => Promise<void>;
  deleteCompanyProfile: () => Promise<void>;
  getCompanyAnnouncements: (companyId: number) => Promise<void>;
  getCompanyAnalytics: (companyId: number) => Promise<void>;
}



export const useCompanyStore = create<CompanyState>()(
  persist(
    (set, get) => ({
      companyId: null,
      name: "",
      industry: "",
      domainName: "",
      location: "",
      description: "",
      profileImage: null,
      coverImage: null,
      logoFile: null,
      coverFile: null,
      announcements: [],

      companies: [],
      exploreCompanies: [],
      followerCounts: {},
      followingStatus: {},

      setCompanyInfo: (data) => set((state) => ({ ...state, ...data })),

      fetchAllCompanies: async () => {
        const companies = await getAllCompanyProfilesAPI();
        set({ companies });
      },

      fetchExploreCompanies: async () => {
        try {
          const companies = await searchForCompaniesAPI();
          set({ exploreCompanies: companies });
        } catch (err) {
          console.error("❌ Failed to fetch explore companies:", err);
        }
      },
      
      fetchCompanyFollowers: async (companyId, userId) => {
        try {
          const followers = await getCompanyFollowersAPI(companyId);
          set((state) => ({
            followerCounts: {
              ...state.followerCounts,
              [companyId]: followers.length,
            },
            followingStatus: {
              ...state.followingStatus,
              [companyId]: userId ? followers.some((f: any) => f.follower_id === userId) : false,
            },
          }));
        } catch (err) {
          console.log(`❌ Failed to fetch followers for company ${companyId}:`, err);
        }
      },

      analytics: null,

      getCompanyAnalytics: async (companyId) => {
        try {
          const analytics = await getCompanyAnalyticsAPI(companyId);
          set({ analytics });
        } catch (err) {
          console.error("❌ Failed to fetch company analytics:", err);
        }
      },


      toggleFollowCompany: async (companyId, userId) => {
        await get().fetchCompanyFollowers(companyId, userId);

        const { followingStatus } = get();
        const isFollowing = followingStatus[companyId];

        try {
          if (isFollowing) {
            await unfollowCompanyAPI(companyId);
            console.log("🟥 Unfollowed company:", companyId);
            set((state) => ({
              followingStatus: { ...state.followingStatus, [companyId]: false },
              followerCounts: {
                ...state.followerCounts,
                [companyId]: Math.max((state.followerCounts[companyId] || 1) - 1, 0),
              },
            }));
            return "unfollowed";
          } else {
            try {
              await followCompanyAPI(companyId);
              console.log("🟩 Followed company:", companyId);
              set((state) => ({
                followingStatus: { ...state.followingStatus, [companyId]: true },
                followerCounts: {
                  ...state.followerCounts,
                  [companyId]: (state.followerCounts[companyId] || 0) + 1,
                },
              }));
              return "followed";
            } catch (err: any) {
              const backendMsg = err?.response?.data?.error || "";
              if (backendMsg.toLowerCase().includes("already followed")) {
                console.warn("⚠️ Already followed. Trying to unfollow.");
                await unfollowCompanyAPI(companyId);
                set((state) => ({
                  followingStatus: { ...state.followingStatus, [companyId]: false },
                  followerCounts: {
                    ...state.followerCounts,
                    [companyId]: Math.max((state.followerCounts[companyId] || 1) - 1, 0),
                  },
                }));
                return "unfollowed";
              }
              throw err;
            }
          }
        } catch (err) {
          console.error("❌ toggleFollowCompany error:", err);
          throw err;
        }
      },

      fetchCompanyProfile: async (companyId) => {
        try {
          const company = await getCompanyProfileAPI(companyId);
          set({
            companyId: company.company_id,
            name: company.company_name || "",
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

      createCompanyProfile: async (): Promise<CompanyResponse> => {
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
            buffer: profileBase64.replace(/^data:.+;base64,/, ""),
            file_name: logoFile.name,
            file_size: logoFile.size.toString(),
            mime_type: logoFile.type,
          },
          cover_photo: {
            buffer: coverBase64.replace(/^data:.+;base64,/, ""),
            file_name: coverFile.name,
            file_size: coverFile.size.toString(),
            mime_type: coverFile.type,
          },
        };

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

        return result;
      },

      getCompanyAnnouncements: async (companyId) => {
        try {
          const announcements = await getCompanyAnnouncementsAPI(companyId);
          set({ announcements });
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
          if (fieldsToUpdate.name) payload.company_name = fieldsToUpdate.name;
          if (fieldsToUpdate.domainName) payload.company_domain_name = fieldsToUpdate.domainName;
          if (fieldsToUpdate.industry) payload.industry = fieldsToUpdate.industry;
          if (fieldsToUpdate.location) payload.location = fieldsToUpdate.location;
          if (fieldsToUpdate.description) payload.description = fieldsToUpdate.description;

          if (fieldsToUpdate.logoFile instanceof File) {
            const base64 = await fileToBase64(fieldsToUpdate.logoFile);
            payload.profile_photo = {
              buffer: base64.replace(/^data:.+;base64,/, ""),
              file_name: fieldsToUpdate.logoFile.name,
              file_size: fieldsToUpdate.logoFile.size.toString(),
              mime_type: fieldsToUpdate.logoFile.type,
            };
          }

          if (fieldsToUpdate.coverFile instanceof File) {
            const base64 = await fileToBase64(fieldsToUpdate.coverFile);
            payload.cover_photo = {
              buffer: base64.replace(/^data:.+;base64,/, ""),
              file_name: fieldsToUpdate.coverFile.name,
              file_size: fieldsToUpdate.coverFile.size.toString(),
              mime_type: fieldsToUpdate.coverFile.type,
            };
          }

          console.log("Updating with payload:", JSON.stringify(payload, null, 2));

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