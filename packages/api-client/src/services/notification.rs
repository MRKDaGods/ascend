use crate::{utils, ApiClient, ApiError};
use crate::models::notification::Notification;

pub struct NotificationService<'a> {
    client: &'a ApiClient,
}

impl<'a> NotificationService<'a> {
    pub fn new(client: &'a ApiClient) -> Self {
        Self { client }
    }

    pub async fn get_notifications(&self, page: Option<i32>) -> Result<Vec<Notification>, ApiError> {
        let url = self.client.construct_url(&format!("notifications/?page={}", page.unwrap_or(1)));
        let token = self.client.auth_token()?;
        let response = self
            .client
            .http_client()
            .get(&url)
            .bearer_auth(token)
            .send()
            .await?;

        utils::handle_response::<Vec<Notification>>(response).await
    }

    pub async fn mark_as_read(&self, notification_id: i32) -> Result<(), ApiError> {
        let url = self.client.construct_url(&format!("notifications/{}", notification_id));
        let token = self.client.auth_token()?;
        let response = self
            .client
            .http_client()
            .patch(&url)
            .bearer_auth(token)
            .send()
            .await?;

        utils::handle_text_response(response).await.map(|_| ())
    }

    pub async fn mark_as_unread(&self, notification_id: i32) -> Result<(), ApiError> {
        let url = self.client.construct_url(&format!("notifications/{}", notification_id));
        let token = self.client.auth_token()?;
        let response = self
            .client
            .http_client()
            .post(&url)
            .bearer_auth(token)
            .send()
            .await?;

        utils::handle_text_response(response).await.map(|_| ())
    }

    pub async fn delete_notification(&self, notification_id: i32) -> Result<(), ApiError> {
        let url = self.client.construct_url(&format!("notifications/{}", notification_id));
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
}