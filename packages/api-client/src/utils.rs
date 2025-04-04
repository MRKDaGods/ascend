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

pub fn filter_json_null_values(value: serde_json::Value) -> serde_json::Value {
    match value {
        serde_json::Value::Object(obj) => {
            let filtered = obj.into_iter()
                .filter(|(_, v)| !v.is_null())
                .map(|(k, v)| (k, filter_json_null_values(v)))
                .collect::<serde_json::Map<String, serde_json::Value>>();
            serde_json::Value::Object(filtered)
        },
        serde_json::Value::Array(arr) => {
            let filtered = arr.into_iter()
                .filter(|v| !v.is_null())
                .map(filter_json_null_values)
                .collect::<Vec<serde_json::Value>>();
            serde_json::Value::Array(filtered)
        },
        _ => value,
    }
}