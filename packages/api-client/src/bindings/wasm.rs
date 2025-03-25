use crate::ApiClient;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct JsApiClient {
    inner: ApiClient,
}

#[wasm_bindgen]
impl JsApiClient {
    #[wasm_bindgen(constructor)]
    pub fn new(base_url: &str) -> Self {
        Self {
            inner: ApiClient::new(base_url),
        }
    }

    #[wasm_bindgen(js_name = getGatewayHealth)]
    pub async fn get_gateway_health(&self) -> Result<JsValue, JsValue> {
        match self.inner.get_gateway_health().await {
            Ok(value) => Ok(JsValue::from_str(&value)),
            Err(err) => Err(JsValue::from_str(&format!("{}", err))),
        }
    }
}
