use crate::services::auth::Auth;
use crate::errors::ApiError;
use crate::utils;
use reqwest::Client;

// I suck at rust mb

pub struct ApiClient {
    client: Client,
    base_url: String,
    auth_token: Option<String>,
}

impl ApiClient {
    pub fn new(base_url: &str) -> Self {
        Self {
            client: Client::new(),
            base_url: base_url.to_string(),
            auth_token: None,
        }
    }

    pub fn construct_url(&self, path: &str) -> String {
        format!("{}/{}", self.base_url, path)
    }

    pub fn http_client(&self) -> &Client {
        &self.client
    }

    pub fn set_auth_token(&mut self, token: String) {
        self.auth_token = Some(token);
    }

    pub fn auth_token(&self) -> Result<&String, ApiError> {
        self.auth_token
            .as_ref()
            .ok_or(ApiError::Unauthorized(String::from("No auth token set")))
    }

    pub fn auth(&mut self) -> Auth {
        Auth::new(self)
    }

    pub async fn get_gateway_health(&self) -> Result<String, ApiError> {
        let url = self.construct_url("health");
        let response = self.client.get(&url).send().await?;
        utils::handle_text_response(response).await
    }


}
