use thiserror::Error;

#[derive(Error, Debug)]
pub enum ApiError {
    #[error("HTTP request failed: {0}")]
    Request(#[from] reqwest::Error),
    #[error("Serialization failed: {0}")]
    Serialization(#[from] serde_json::Error),  
    
    #[cfg(target_arch = "wasm32")]
    #[error("WASM serialization failed: {0}")]
    WasmSerialization(#[from] serde_wasm_bindgen::Error),
    
    #[error("Unauthorized access: {0}")]
    Unauthorized(String),
}
