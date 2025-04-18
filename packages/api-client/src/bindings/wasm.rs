use crate::models::profile::Profile;
use crate::{ApiClient, ApiError};
use wasm_bindgen::prelude::*;

macro_rules! wasm_wrap {
    ($self:ident.$ns:ident().$method:ident($($arg:ident: $type:ty),*)) => {
        match $self.inner.$ns().$method($($arg),*).await {
            Ok(response) => Ok(serde_wasm_bindgen::to_value(&response).map_err(map_error_wasm)?),
            Err(e) => Err(JsValue::from_str(&format!("{} error: {}", stringify!($method), e))),
        }
    }
}

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
    pub fn get_auth_token(&mut self) -> Result<String, JsValue> {
        self.inner
            .auth_token()
            .map(|token| token.clone())
            .map_err(map_error)
    }

    #[wasm_bindgen]
    pub async fn get_gateway_health(&mut self) -> Result<String, JsValue> {
        self.inner.get_gateway_health().await.map_err(map_error)
    }

    // Auth methods
    #[wasm_bindgen]
    pub async fn login(&mut self, email: &str, password: &str) -> Result<JsValue, JsValue> {
        wasm_wrap!(self.auth().login(email: &str, password: &str))
    }

    #[wasm_bindgen]
    pub async fn register(
        &mut self,
        first_name: &str,
        last_name: &str,
        email: &str,
        password: &str,
    ) -> Result<JsValue, JsValue> {
        wasm_wrap!(self.auth().register(first_name: &str, last_name: &str, email: &str, password: &str))
    }

    #[wasm_bindgen]
    pub async fn resend_confirm_email(&mut self, email: &str) -> Result<JsValue, JsValue> {
        wasm_wrap!(self.auth().resend_confirm_email(email: &str))
    }

    #[wasm_bindgen]
    pub async fn update_password(
        &mut self,
        old_password: &str,
        new_password: &str,
    ) -> Result<JsValue, JsValue> {
        wasm_wrap!(self.auth().update_password(old_password: &str, new_password: &str))
    }

    #[wasm_bindgen]
    pub async fn update_email(&mut self, new_email: &str) -> Result<JsValue, JsValue> {
        wasm_wrap!(self.auth().update_email(new_email: &str))
    }

    #[wasm_bindgen]
    pub async fn forget_password(&mut self, email: &str) -> Result<JsValue, JsValue> {
        wasm_wrap!(self.auth().forget_password(email: &str))
    }

    #[wasm_bindgen]
    pub async fn reset_password(
        &mut self,
        token: &str,
        new_password: &str,
    ) -> Result<JsValue, JsValue> {
        wasm_wrap!(self.auth().reset_password(token: &str, new_password: &str))
    }

    #[wasm_bindgen]
    pub async fn delete_account(&mut self) -> Result<JsValue, JsValue> {
        wasm_wrap!(self.auth().delete_account())
    }

    #[wasm_bindgen]
    pub async fn logout(&mut self) -> Result<JsValue, JsValue> {
        wasm_wrap!(self.auth().logout())
    }

    // User methods
    #[wasm_bindgen]
    pub async fn get_local_user_profile(&self) -> Result<JsValue, JsValue> {
        wasm_wrap!(self.user().get_local_user_profile())
    }

    #[wasm_bindgen]
    pub async fn get_user_profile(&self, id: i32) -> Result<JsValue, JsValue> {
        wasm_wrap!(self.user().get_user_profile(id: i32))
    }

    #[wasm_bindgen]
    pub async fn update_local_user_profile(&self, profile: JsValue) -> Result<JsValue, JsValue> {
        let profile: Profile = serde_wasm_bindgen::from_value(profile).map_err(map_error_wasm)?;

        wasm_wrap!(self.user().update_local_user_profile(profile: Profile))
    }

    #[wasm_bindgen]
    pub async fn upload_profile_picture(
        &self,
        name: &str,
        mime: &str,
        buffer: &[u8],
    ) -> Result<JsValue, JsValue> {
        wasm_wrap!(self.user().upload_profile_picture(name: &str, mime: &str, buffer: &[u8]))
    }

    #[wasm_bindgen]
    pub async fn delete_profile_picture(&self) -> Result<JsValue, JsValue> {
        wasm_wrap!(self.user().delete_profile_picture())
    }

    #[wasm_bindgen]
    pub async fn upload_cover_photo(
        &self,
        name: &str,
        mime: &str,
        buffer: &[u8],
    ) -> Result<JsValue, JsValue> {
        wasm_wrap!(self.user().upload_cover_photo(name: &str, mime: &str, buffer: &[u8]))
    }

    #[wasm_bindgen]
    pub async fn delete_cover_photo(&self) -> Result<JsValue, JsValue> {
        wasm_wrap!(self.user().delete_cover_photo())
    }

    #[wasm_bindgen]
    pub async fn upload_resume(
        &self,
        name: &str,
        mime: &str,
        buffer: &[u8],
    ) -> Result<JsValue, JsValue> {
        wasm_wrap!(self.user().upload_resume(name: &str, mime: &str, buffer: &[u8]))
    }

    #[wasm_bindgen]
    pub async fn delete_resume(&self) -> Result<JsValue, JsValue> {
        wasm_wrap!(self.user().delete_resume())
    }

    // Notification methods
    #[wasm_bindgen]
    pub async fn get_notifications(&self, page: Option<i32>) -> Result<JsValue, JsValue> {
        wasm_wrap!(self.notification().get_notifications(page: Option<i32>))
    }

    #[wasm_bindgen]
    pub async fn mark_notification_as_read(
        &self,
        notification_id: i32,
    ) -> Result<JsValue, JsValue> {
        wasm_wrap!(self.notification().mark_as_read(notification_id: i32))
    }

    #[wasm_bindgen]
    pub async fn mark_notification_as_unread(
        &self,
        notification_id: i32,
    ) -> Result<JsValue, JsValue> {
        wasm_wrap!(self.notification().mark_as_unread(notification_id: i32))
    }

    #[wasm_bindgen]
    pub async fn delete_notification(
        &self,
        notification_id: i32,
    ) -> Result<JsValue, JsValue> {
        wasm_wrap!(self.notification().delete_notification(notification_id: i32))
    }
}
