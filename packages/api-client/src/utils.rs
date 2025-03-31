use crate::errors::ApiError;
use reqwest::Response;

// JSON response handler
pub async fn handle_response<T>(response: Response) -> Result<T, ApiError>
where
    T: for<'de> serde::Deserialize<'de>,
{
    if !response.status().is_success() {
        return Err(ApiError::Request(response.error_for_status().unwrap_err()));
    }

    let data = response.json::<T>().await?;
    Ok(data)
}

// Text response handler
pub async fn handle_text_response(response: Response) -> Result<String, ApiError> {
    if !response.status().is_success() {
        return Err(ApiError::Request(response.error_for_status().unwrap_err()));
    }

    let text = response.text().await?;
    Ok(text)
}
