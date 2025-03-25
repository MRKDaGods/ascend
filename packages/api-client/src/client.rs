use crate::errors::ApiError;
// use crate::models::user::User;
use reqwest::Client;

// I suck at rust mb

pub struct ApiClient {
    client: Client,
    base_url: String,
}

impl ApiClient {
    pub fn new(base_url: &str) -> Self {
        Self {
            client: Client::new(),
            base_url: base_url.to_string(),
        }
    }

    pub async fn get_gateway_health(&self) -> Result<String, ApiError> {
        let url = format!("{}/gateway/health", self.base_url);
        let response = self.client.get(&url).send().await?;
        let body = response.text().await?;
        Ok(body)
    }

    // pub async fn get_user(&self, id: i64) -> Result<User, ApiError> {
    //     let url = format!("{}/users/{}", self.base_url, id);
    //     let response = self.client.get(&url).send().await?;
    //     let user: User = response.json().await?;
    //     Ok(user)
    // }
}
