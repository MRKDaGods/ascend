// Auto-generated from TypeScript definitions


#[derive(Debug, Clone, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
pub enum NotificationType {
    #[serde(rename = "welcome")]
    WELCOME,
}

#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct Notification {
    pub id: i32,
    pub user_id: i32,
    pub type_: NotificationType,
    pub message: String,
    pub payload: Option<serde_json::Value>,
    pub is_read: Option<bool>,
    pub created_at: Option<chrono::DateTime<chrono::Utc>>,
    pub updated_at: Option<chrono::DateTime<chrono::Utc>>,
}

