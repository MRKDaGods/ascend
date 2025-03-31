use crate::{ApiClient, ApiError};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct WasmApiClient {
    inner: ApiClient,
}

fn map_error(e: crate::ApiError) -> JsValue {
    match e {
        crate::ApiError::Request(err) => JsValue::from_str(&format!("Request error: {}", err)),
        crate::ApiError::Unauthorized(msg) => JsValue::from_str(&format!("Unauthorized: {}", msg)),
        crate::ApiError::Serialization(err) => {
            JsValue::from_str(&format!("Serialization error: {}", err))
        }
        crate::ApiError::WasmSerialization(err) => {
            JsValue::from_str(&format!("WASM serialization error: {}", err))
        }
    }
}

fn map_error_wasm(e: serde_wasm_bindgen::Error) -> JsValue {
    map_error(ApiError::WasmSerialization(e))
}

#[wasm_bindgen]
impl WasmApiClient {
    #[wasm_bindgen(constructor)]
    pub fn new(base_url: &str) -> Self {
        Self {
            inner: ApiClient::new(base_url),
        }
    }

    #[wasm_bindgen]
    pub fn set_auth_token(&mut self, token: String) {
        self.inner.set_auth_token(token);
    }

    #[wasm_bindgen]
    pub fn get_auth_token(&self) -> Result<String, JsValue> {
        self.inner
            .auth_token()
            .map(|token| token.clone())
            .map_err(map_error)
    }

    #[wasm_bindgen]
    pub async fn get_gateway_health(&self) -> Result<String, JsValue> {
        self.inner.get_gateway_health().await.map_err(map_error)
    }

    // Auth methods
    pub async fn login(&self, email: &str, password: &str) -> Result<JsValue, JsValue> {
        match self.inner.auth().login(email, password).await {
            Ok(response) => Ok(serde_wasm_bindgen::to_value(&response).map_err(map_error_wasm)?),
            Err(e) => Err(JsValue::from_str(&format!("Login error: {}", e))),
        }
    }
}
