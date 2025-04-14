// Auto-generated from TypeScript definitions


#[derive(Debug, Clone, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
pub enum UserRole {
    #[serde(rename = "user")]
    USER,
    #[serde(rename = "moderator")]
    MODERATOR,
    #[serde(rename = "admin")]
    ADMIN,
}

#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct User {
    pub id: i32,
    pub email: String,
    pub password_hash: Option<String>,
    pub role: UserRole,
    pub confirmation_token: Option<String>,
    pub reset_token: Option<String>,
    pub new_email: Option<String>,
    pub is_verified: bool,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: chrono::DateTime<chrono::Utc>,
}

