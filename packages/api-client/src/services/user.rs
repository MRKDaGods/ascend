use crate::client::ApiClient;
use crate::errors::ApiError;
use crate::utils;
use crate::models::profile::Profile;

pub struct UserService<'a> {
    client: &'a ApiClient,
}

impl<'a> UserService<'a> {
    pub fn new(client: &'a ApiClient) -> Self {
        Self { client }
    }

    pub async fn get_local_user_profile(&self) -> Result<Profile, ApiError> {
        let url = self.client.construct_url("user/profile");
        let token = self.client.auth_token()?;

        let response = self
            .client
            .http_client()
            .get(&url)
            .bearer_auth(token)
            .send()
            .await?;

        utils::handle_response::<Profile>(response).await
    }

    pub async fn get_user_profile(&self, id: i32) -> Result<Profile, ApiError> {
        let url = self.client.construct_url(&format!("user/profile/{}", id));
        let token = self.client.auth_token()?;

        let response = self
            .client
            .http_client()
            .get(&url)
            .bearer_auth(token)
            .send()
            .await?;

        utils::handle_response::<Profile>(response).await
    }

    pub async fn update_local_user_profile(&self, profile: Profile) -> Result<Profile, ApiError> {
        let url = self.client.construct_url("user/profile");
        let token = self.client.auth_token()?;

        let filtered_profile = serde_json::to_value(profile)?;
        let filtered_profile = utils::filter_json_null_values(filtered_profile);

        let response = self
            .client
            .http_client()
            .put(&url)
            .bearer_auth(token)
            .json(&filtered_profile)
            .send()
            .await?;

        utils::handle_response::<Profile>(response).await
    }

    async fn upload_user_file(
        &self,
        endpoint: &str,
        context: &str,
        name: &str,
        mime: &str,
        buffer: &[u8],
    ) -> Result<Profile, ApiError> {
        let url = self.client.construct_url(endpoint);
        let token = self.client.auth_token()?;
        let part = reqwest::multipart::Part::bytes(buffer.to_vec())
            .file_name(name.to_string())
            .mime_str(mime)?;

        let context_part = reqwest::multipart::Part::text(context.to_string());
        let form = reqwest::multipart::Form::new()
            .part("file", part)
            .part("context", context_part);

        let response = self
            .client
            .http_client()
            .post(&url)
            .bearer_auth(token)
            .header("x-no-parse-body", "1")
            .multipart(form)
            .send()
            .await?;

        utils::handle_response::<Profile>(response).await
    }

    async fn delete_user_file(
        &self,
        endpoint: &str,
    ) -> Result<Profile, ApiError> {
        let url = self.client.construct_url(endpoint);
        let token = self.client.auth_token()?;

        let response = self
            .client
            .http_client()
            .delete(&url)
            .bearer_auth(token)
            .send()
            .await?;

        utils::handle_response::<Profile>(response).await
    }

    pub async fn upload_profile_picture(
        &self,
        name: &str,
        mime: &str,
        buffer: &[u8],
    ) -> Result<Profile, ApiError> {
        self.upload_user_file("user/profile/picture",
            "profile_picture", name, mime, buffer).await
    }

    pub async fn delete_profile_picture(&self) -> Result<Profile, ApiError> {
        self.delete_user_file("user/profile/picture").await
    }

    pub async fn upload_cover_photo(
        &self,
        name: &str,
        mime: &str,
        buffer: &[u8],
    ) -> Result<Profile, ApiError> {
        self.upload_user_file("user/profile/cover",
            "cover_photo", name, mime, buffer).await
    }

    pub async fn delete_cover_photo(&self) -> Result<Profile, ApiError> {
        self.delete_user_file("user/profile/cover").await
    }

    pub async fn upload_resume(
        &self,
        name: &str,
        mime: &str,
        buffer: &[u8],
    ) -> Result<Profile, ApiError> {
        self.upload_user_file("user/profile/resume",
            "resume", name, mime, buffer).await
    }

    pub async fn delete_resume(&self) -> Result<Profile, ApiError> {
        self.delete_user_file("user/profile/resume").await
    }
}
