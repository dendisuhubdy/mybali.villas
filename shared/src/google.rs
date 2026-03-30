use serde::Deserialize;

use crate::errors::AppError;

/// User information extracted from a verified Google ID token.
pub struct GoogleUserInfo {
    pub google_id: String,
    pub email: String,
    pub name: String,
    pub picture: Option<String>,
}

/// Response from Google's tokeninfo endpoint.
#[derive(Debug, Deserialize)]
struct TokenInfoResponse {
    /// The user's unique Google ID.
    sub: Option<String>,
    /// The user's email address.
    email: Option<String>,
    /// Whether the email is verified.
    email_verified: Option<String>,
    /// The user's full name.
    name: Option<String>,
    /// URL to the user's profile picture.
    picture: Option<String>,
    /// The audience (must match our client ID).
    aud: Option<String>,
}

/// Verify a Google ID token by calling Google's tokeninfo endpoint.
///
/// Returns the user's profile information if the token is valid and the
/// audience matches the expected client ID.
pub async fn verify_google_token(
    id_token: &str,
    expected_client_id: &str,
) -> Result<GoogleUserInfo, AppError> {
    let url = format!(
        "https://oauth2.googleapis.com/tokeninfo?id_token={}",
        id_token
    );

    let client = reqwest::Client::new();
    let response = client
        .get(&url)
        .send()
        .await
        .map_err(|e| AppError::Internal(format!("Failed to verify Google token: {e}")))?;

    if !response.status().is_success() {
        return Err(AppError::Unauthorized(
            "Invalid Google token".to_string(),
        ));
    }

    let info: TokenInfoResponse = response
        .json()
        .await
        .map_err(|e| AppError::Internal(format!("Failed to parse Google token info: {e}")))?;

    // Verify the audience matches our client ID.
    let aud = info
        .aud
        .as_deref()
        .ok_or_else(|| AppError::Unauthorized("Google token missing audience".to_string()))?;

    if aud != expected_client_id {
        return Err(AppError::Unauthorized(
            "Google token audience mismatch".to_string(),
        ));
    }

    // Verify email is present and verified.
    let email_verified = info.email_verified.as_deref() == Some("true");
    if !email_verified {
        return Err(AppError::Unauthorized(
            "Google email not verified".to_string(),
        ));
    }

    let google_id = info
        .sub
        .ok_or_else(|| AppError::Unauthorized("Google token missing subject".to_string()))?;

    let email = info
        .email
        .ok_or_else(|| AppError::Unauthorized("Google token missing email".to_string()))?;

    let name = info.name.unwrap_or_else(|| email.clone());

    Ok(GoogleUserInfo {
        google_id,
        email,
        name,
        picture: info.picture,
    })
}
