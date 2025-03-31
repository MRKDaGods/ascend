use crate::client::ApiClient;
use crate::errors::ApiError;
use crate::utils;
use serde::{Deserialize, Serialize};

pub struct Auth<'a> {
    client: &'a mut ApiClient,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LoginResponse {
    pub token: String,
    pub user_id: u32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RegisterResponse {
    pub user_id: u32,
    pub email: String,
}

impl<'a> Auth<'a> {
    pub fn new(client: &'a mut ApiClient) -> Self {
        Self { client }
    }

    pub async fn login(&self, email: &str, password: &str) -> Result<LoginResponse, ApiError> {
        let url = self.client.construct_url("auth/login");
        let response = self
            .client
            .http_client()
            .post(&url)
            .json(&serde_json::json!({
                "email": email,
                "password": password,
            }))
            .send()
            .await?;

        utils::handle_response::<LoginResponse>(response).await
    }

    pub async fn register(
        &self,
        first_name: &str,
        last_name: &str,
        email: &str,
        password: &str,
    ) -> Result<RegisterResponse, ApiError> {
        let url = self.client.construct_url("auth/register");
        let response = self
            .client
            .http_client()
            .post(&url)
            .json(&serde_json::json!({
                "first_name": first_name,
                "last_name": last_name,
                "email": email,
                "password": password,
            }))
            .send()
            .await?;

        utils::handle_response::<RegisterResponse>(response).await
    }

    pub async fn resend_confirm_email(&self, email: &str) -> Result<(), ApiError> {
        let url = self.client.construct_url("auth/resend-confirm");
        let response = self
            .client
            .http_client()
            .post(&url)
            .json(&serde_json::json!({
                "email": email,
            }))
            .send()
            .await?;

        // We receive json but it's useless anyway
        utils::handle_text_response(response).await.map(|_| ())
    }

    // Authenticated
    pub async fn update_password(
        &self,
        old_password: &str,
        new_password: &str,
    ) -> Result<(), ApiError> {
        let url = self.client.construct_url("auth/update-password");
        let token = self.client.auth_token()?;
        let response = self
            .client
            .http_client()
            .put(&url)
            .bearer_auth(token)
            .json(&serde_json::json!({
                "old_password": old_password,
                "new_password": new_password,
            }))
            .send()
            .await?;

        utils::handle_text_response(response).await.map(|_| ())
    }

    // Authenticated
    pub async fn update_email(
        &self,
        new_email: &str,
    ) -> Result<(), ApiError> {
        let url = self.client.construct_url("auth/update-email");
        let token = self.client.auth_token()?;
        let response = self
            .client
            .http_client()
            .put(&url)
            .bearer_auth(token)
            .json(&serde_json::json!({
                "new_email": new_email,
            }))
            .send()
            .await?;

        utils::handle_text_response(response).await.map(|_| ())
    }

    pub async fn forget_password(
        &self,
        email: &str,
    ) -> Result<(), ApiError> {
        let url = self.client.construct_url("auth/forget-password");
        let response = self
            .client
            .http_client()
            .post(&url)
            .json(&serde_json::json!({
                "email": email,
            }))
            .send()
            .await?;

        utils::handle_text_response(response).await.map(|_| ())
    }

    pub async fn reset_password(
        &self,
        token: &str,
        new_password: &str,
    ) -> Result<(), ApiError> {
        let url = self.client.construct_url("auth/reset-password");
        let response = self
            .client
            .http_client()
            .post(&url)
            .json(&serde_json::json!({
                "token": token,
                "new_password": new_password,
            }))
            .send()
            .await?;

        utils::handle_text_response(response).await.map(|_| ())
    }

    // Authenticated
    pub async fn delete_account(&self) -> Result<(), ApiError> {
        let url = self.client.construct_url("auth/delete-account");
        let token = self.client.auth_token()?;
        let response = self
            .client
            .http_client()
            .delete(&url)
            .bearer_auth(token)
            .send()
            .await?;

        utils::handle_text_response(response).await.map(|_| ())
    }

    pub async fn logout(&mut self) -> Result<(), ApiError> {
        // Clear the auth token
        self.client.set_auth_token(String::new());
        Ok(())
    }
}
