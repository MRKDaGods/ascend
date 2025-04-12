use crate::{
    ApiClient, ApiError,
    profile::Profile,
    models::notification::Notification,
    services::auth::{LoginResponse, RegisterResponse},
};
use flutter_rust_bridge::frb;
pub use serde_json::Value;
pub use reqwest::Response;

pub struct FfiApiClient {
    inner: ApiClient,
}

fn map_error(e: ApiError) -> String {
    match e {
        ApiError::Request(err) => format!("Request error: {}", err),
        ApiError::Unauthorized(msg) => format!("Unauthorized: {}", msg),
        ApiError::Serialization(err) => format!("Serialization error: {}", err),
    }
}

impl FfiApiClient {
    #[frb(sync)]
    pub fn new(base_url: &str) -> Self {
        Self {
            inner: ApiClient::new(base_url),
        }
    }

    #[frb(sync)]
    pub fn set_auth_token(&mut self, token: String) {
        self.inner.set_auth_token(token);
    }

    #[frb(sync)]
    pub fn get_auth_token(&self) -> Result<String, String> {
        self.inner
            .auth_token()
            .map(|token| token.clone())
            .map_err(map_error)
    }

    pub async fn get_gateway_health(&self) -> Result<String, String> {
        self.inner.get_gateway_health().await.map_err(map_error)
    }

    // Auth methods
    pub async fn login(&mut self, email: &str, password: &str) -> Result<LoginResponse, String> {
        self.inner
            .auth()
            .login(email, password)
            .await
            .map_err(map_error)
    }

    pub async fn register(
        &mut self,
        first_name: &str,
        last_name: &str,
        email: &str,
        password: &str,
    ) -> Result<RegisterResponse, String> {
        self.inner
            .auth()
            .register(first_name, last_name, email, password)
            .await
            .map_err(map_error)
    }

    pub async fn resend_confirm_email(&mut self, email: &str) -> Result<(), String> {
        self.inner
            .auth()
            .resend_confirm_email(email)
            .await
            .map_err(map_error)
    }

    pub async fn update_password(
        &mut self,
        old_password: &str,
        new_password: &str,
    ) -> Result<(), String> {
        self.inner
            .auth()
            .update_password(old_password, new_password)
            .await
            .map_err(map_error)
    }

    pub async fn update_email(&mut self, new_email: &str) -> Result<(), String> {
        self.inner
            .auth()
            .update_email(new_email)
            .await
            .map_err(map_error)
    }

    pub async fn forget_password(&mut self, email: &str) -> Result<(), String> {
        self.inner
            .auth()
            .forget_password(email)
            .await
            .map_err(map_error)
    }

    pub async fn reset_password(&mut self, token: &str, new_password: &str) -> Result<(), String> {
        self.inner
            .auth()
            .reset_password(token, new_password)
            .await
            .map_err(map_error)
    }

    pub async fn delete_account(&mut self) -> Result<(), String> {
        self.inner.auth().delete_account().await.map_err(map_error)
    }

    pub async fn logout(&mut self) -> Result<(), String> {
        self.inner.auth().logout().await.map_err(map_error)
    }

    // User methods
    pub async fn get_local_user_profile(&self) -> Result<Profile, String> {
        self.inner
            .user()
            .get_local_user_profile()
            .await
            .map_err(map_error)
    }

    pub async fn update_local_user_profile(&self, profile: Profile) -> Result<Profile, String> {
        self.inner
            .user()
            .update_local_user_profile(profile)
            .await
            .map_err(map_error)
    }

    pub async fn upload_profile_picture(
        &self,
        name: &str,
        mime: &str,
        buffer: &[u8],
    ) -> Result<Profile, String> {
        self.inner
            .user()
            .upload_profile_picture(name, mime, buffer)
            .await
            .map_err(map_error)
    }

    pub async fn delete_profile_picture(&self) -> Result<Profile, String> {
        self.inner
            .user()
            .delete_profile_picture()
            .await
            .map_err(map_error)
    }

    pub async fn upload_cover_photo(
        &self,
        name: &str,
        mime: &str,
        buffer: &[u8],
    ) -> Result<Profile, String> {
        self.inner
            .user()
            .upload_cover_photo(name, mime, buffer)
            .await
            .map_err(map_error)
    }

    pub async fn delete_cover_photo(&self) -> Result<Profile, String> {
        self.inner
            .user()
            .delete_cover_photo()
            .await
            .map_err(map_error)
    }

    pub async fn upload_resume(
        &self,
        name: &str,
        mime: &str,
        buffer: &[u8],
    ) -> Result<Profile, String> {
        self.inner
            .user()
            .upload_resume(name, mime, buffer)
            .await
            .map_err(map_error)
    }

    pub async fn delete_resume(&self) -> Result<Profile, String> {
        self.inner.user().delete_resume().await.map_err(map_error)
    }

    // Notifications methods
    pub async fn get_notifications(&self, page: Option<i32>) -> Result<Vec<Notification>, String> {
        self.inner
            .notification()
            .get_notifications(page)
            .await
            .map_err(map_error)
    }

    pub async fn mark_notification_as_read(&self, notification_id: i32) -> Result<(), String> {
        self.inner
            .notification()
            .mark_as_read(notification_id)
            .await
            .map_err(map_error)
    }

    pub async fn delete_notification(&self, notification_id: i32) -> Result<(), String> {
        self.inner
            .notification()
            .delete_notification(notification_id)
            .await
            .map_err(map_error)
    }
}

#[frb(init)]
pub fn init_app() {
    // Default utilities - feel free to customize
    flutter_rust_bridge::setup_default_user_utils();
}
