mod frb_generated; /* AUTO INJECTED BY flutter_rust_bridge. This line may not be accurate, and you can change it according to your needs. */
mod bindings;
mod client;
mod errors;
mod models;
mod services;
mod utils;

pub use client::ApiClient;
pub use errors::ApiError;
pub use models::*;

// Bindings
#[cfg(target_arch = "wasm32")]
pub use bindings::wasm::*;

#[cfg(not(target_arch = "wasm32"))]
pub use bindings::ffi::*;
