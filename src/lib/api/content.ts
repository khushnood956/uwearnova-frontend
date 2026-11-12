import { apiClient } from "./client";

export interface ContentPageResponse {
  id: number;
  slug: string;
  title: string;
  body: string;
  meta_title?: string | null;
  meta_description?: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface AnnouncementBarResponse {
  id: number;
  message: string;
  link_url?: string | null;
  link_text?: string | null;
  bg_color?: string | null;
  text_color?: string | null;
  is_active: boolean;
  start_at?: string | null;
  end_at?: string | null;
}

export interface HomepageCampaignResponse {
  id: number;
  title: string;
  subtitle?: string | null;
  cta_text?: string | null;
  cta_link?: string | null;
  image_url?: string | null;
  display_order: number;
  is_active: boolean;
}

export const contentApi = {
  async getPage(slug: string): Promise<ContentPageResponse> {
    return apiClient<ContentPageResponse>(`/content/pages/${slug}`, { skipAuth: true });
  },

  async getAnnouncements(): Promise<AnnouncementBarResponse[]> {
    return apiClient<AnnouncementBarResponse[]>("/content/announcements", { skipAuth: true });
  },

  async getHomepageCampaigns(): Promise<HomepageCampaignResponse[]> {
    return apiClient<HomepageCampaignResponse[]>("/content/homepage-campaigns", { skipAuth: true });
  },
};
