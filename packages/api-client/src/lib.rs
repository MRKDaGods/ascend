mod bindings;
mod client;
mod errors;
mod models;

pub use client::ApiClient;
pub use errors::ApiError;
pub use models::*;

// Bindings
#[cfg(target_arch = "wasm32")]
pub use bindings::wasm::*;

#[cfg(not(target_arch = "wasm32"))]
pub use bindings::ffi::*;
