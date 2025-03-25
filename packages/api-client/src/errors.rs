use thiserror::Error;

#[derive(Error, Debug)]
pub enum ApiError {
    #[error("HTTP request failed: {0}")]
    Request(#[from] reqwest::Error),
    #[error("Serialization failed: {0}")]
    Serialization(#[from] serde_json::Error),
}
