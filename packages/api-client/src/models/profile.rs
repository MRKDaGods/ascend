// Auto-generated from TypeScript definitions


#[derive(Debug, Clone, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
pub enum PhoneType {
    #[serde(rename = "home")]
    HOME,
    #[serde(rename = "work")]
    WORK,
    #[serde(rename = "mobile")]
    MOBILE,
}

// All fields optional due to REF annotation
#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct Education {
    pub id: Option<i32>,
    pub user_id: Option<i32>,
    pub school: Option<String>,
    pub degree: Option<String>,
    pub field_of_study: Option<String>,
    pub start_date: Option<chrono::DateTime<chrono::Utc>>,
    pub end_date: Option<String>,
    pub created_at: Option<chrono::DateTime<chrono::Utc>>,
    pub updated_at: Option<chrono::DateTime<chrono::Utc>>,
}

// All fields optional due to REF annotation
#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct Experience {
    pub id: Option<i32>,
    pub user_id: Option<i32>,
    pub company: Option<String>,
    pub position: Option<String>,
    pub start_date: Option<chrono::DateTime<chrono::Utc>>,
    pub end_date: Option<chrono::DateTime<chrono::Utc>>,
    pub description: Option<String>,
    pub created_at: Option<chrono::DateTime<chrono::Utc>>,
    pub updated_at: Option<chrono::DateTime<chrono::Utc>>,
}

// All fields optional due to REF annotation
#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct Project {
    pub id: Option<i32>,
    pub user_id: Option<i32>,
    pub name: Option<String>,
    pub description: Option<String>,
    pub start_date: Option<chrono::DateTime<chrono::Utc>>,
    pub end_date: Option<chrono::DateTime<chrono::Utc>>,
    pub url: Option<String>,
    pub created_at: Option<chrono::DateTime<chrono::Utc>>,
    pub updated_at: Option<chrono::DateTime<chrono::Utc>>,
}

// All fields optional due to REF annotation
#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct Course {
    pub id: Option<i32>,
    pub user_id: Option<i32>,
    pub name: Option<String>,
    pub provider: Option<String>,
    pub completion_date: Option<chrono::DateTime<chrono::Utc>>,
    pub created_at: Option<chrono::DateTime<chrono::Utc>>,
    pub updated_at: Option<chrono::DateTime<chrono::Utc>>,
}

// All fields optional due to REF annotation
#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct Skill {
    pub id: Option<i32>,
    pub name: Option<String>,
}

// All fields optional due to REF annotation
#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct Interest {
    pub id: Option<i32>,
    pub name: Option<String>,
}

// All fields optional due to REF annotation
#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct ContactInfo {
    pub user_id: Option<i32>,
    pub profile_url: Option<String>,
    pub email: Option<String>,
    pub phone: Option<String>,
    pub phone_type: Option<PhoneType>,
    pub address: Option<String>,
    pub birthday: Option<chrono::DateTime<chrono::Utc>>,
    pub created_at: Option<chrono::DateTime<chrono::Utc>>,
    pub updated_at: Option<chrono::DateTime<chrono::Utc>>,
}

// All fields optional due to REF annotation
#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct Profile {
    pub user_id: Option<i32>,
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub resume_url: Option<String>,
    pub resume_id: Option<i32>,
    pub cover_photo_url: Option<String>,
    pub cover_photo_id: Option<i32>,
    pub profile_picture_url: Option<String>,
    pub profile_picture_id: Option<i32>,
    pub industry: Option<String>,
    pub location: Option<String>,
    pub bio: Option<String>,
    pub privacy: Option<String /* Union type: "public" | "private" | "connections" */>,
    pub show_school: Option<bool>,
    pub show_current_company: Option<bool>,
    pub website: Option<String>,
    pub additional_name: Option<String>,
    pub name_pronunciation: Option<String>,
    pub skills: Option<Vec<Skill>>,
    pub education: Option<Vec<Education>>,
    pub experience: Option<Vec<Experience>>,
    pub interests: Option<Vec<Interest>>,
    pub projects: Option<Vec<Project>>,
    pub courses: Option<Vec<Course>>,
    pub contact_info: Option<ContactInfo>,
    pub created_at: Option<chrono::DateTime<chrono::Utc>>,
    pub updated_at: Option<chrono::DateTime<chrono::Utc>>,
}

