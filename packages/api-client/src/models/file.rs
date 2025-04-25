// Auto-generated from TypeScript definitions


#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct FileMetadata {
    pub id: i32,
    pub user_id: i32,
    pub file_name: String,
    pub mime_type: String,
    pub file_size: i32,
    pub context: Option<String>,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: chrono::DateTime<chrono::Utc>,
}

