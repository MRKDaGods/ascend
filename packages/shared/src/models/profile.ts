export enum PhoneType {
  HOME = "home",
  WORK = "work",
  MOBILE = "mobile",
}

export interface Education { // 1:N
  id: number;
  user_id: number;
  school: string;
  degree: string;
  field_of_study: string;
  start_date: Date;
  end_date?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Experience { // 1:N
  id: number;
  user_id: number;
  company: string;
  position: string;
  start_date: Date;
  end_date?: Date;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Project { // 1:N
  id: number;
  user_id: number;
  name: string;
  description: string;
  start_date: Date;
  end_date?: Date;
  url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Course { // 1:N
  id: number;
  user_id: number;
  name: string;
  provider: string;
  completion_date?: Date;
  created_at: Date;
  updated_at: Date;
}

// Skills & Interests are stored as seperate entities
// so that they can be shared between users
// may as well have autocomplete for them
export interface Skill { // M:N
  id: number;
  name: string;
}

export interface Interest { // M:N
  id: number;
  name: string;
}

export interface ContactInfo { // 1:1
  user_id: number;
  profile_url?: string;
  email: string; // Primary email address, from auth!
  phone?: string;
  phone_type?: PhoneType;
  address?: string;
  birthday?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export interface Profile {
  user_id: number;
  first_name: string;
  last_name: string;
  resume_url?: string;
  cover_photo_url?: string;
  profile_picture_url?: string;
  industry?: string;
  location?: string;
  bio?: string;
  privacy?: "public" | "private" | "connections";
  show_school?: boolean;
  show_current_company?: boolean;
  website?: string;
  additional_name?: string;
  name_pronunciation?: string;
  skills?: Skill[];
  education?: Education[];
  experience?: Experience[];
  interests?: Interest[];
  projects?: Project[];
  courses?: Course[];
  contact_info?: ContactInfo;
  created_at: Date;
  updated_at: Date;
}
