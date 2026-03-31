use axum::extract::{Multipart, State};
use axum::Json;
use shared::errors::AppError;
use std::sync::Arc;
use uuid::Uuid;

use crate::middleware::auth::RequireAuth;
use crate::models::ApiResponse;
use crate::AppState;

/// POST /api/v1/uploads/image
pub async fn upload_image(
    State(_state): State<Arc<AppState>>,
    RequireAuth(_claims): RequireAuth,
    mut multipart: Multipart,
) -> Result<Json<ApiResponse<serde_json::Value>>, AppError> {
    let upload_dir = std::env::var("UPLOAD_DIR").unwrap_or_else(|_| "/app/uploads".to_string());
    tokio::fs::create_dir_all(&upload_dir).await.map_err(|e| {
        AppError::Internal(format!("Failed to create upload directory: {e}"))
    })?;

    while let Some(field) = multipart.next_field().await.map_err(|e| {
        AppError::BadRequest(format!("Failed to read multipart field: {e}"))
    })? {
        let field_name = field.name().unwrap_or("").to_string();
        if field_name != "file" {
            continue;
        }

        let content_type = field.content_type().unwrap_or("").to_string();
        let extension = match content_type.as_str() {
            "image/jpeg" => "jpg",
            "image/png" => "png",
            "image/webp" => "webp",
            _ => {
                return Err(AppError::BadRequest(
                    "Invalid file type. Only JPG, PNG, and WebP are allowed.".to_string(),
                ));
            }
        };

        let data = field.bytes().await.map_err(|e| {
            AppError::BadRequest(format!("Failed to read file data: {e}"))
        })?;

        // Max 10MB
        if data.len() > 10 * 1024 * 1024 {
            return Err(AppError::BadRequest(
                "File too large. Maximum size is 10MB.".to_string(),
            ));
        }

        let filename = format!("{}.{}", Uuid::new_v4(), extension);
        let filepath = format!("{}/{}", upload_dir, filename);

        tokio::fs::write(&filepath, &data).await.map_err(|e| {
            AppError::Internal(format!("Failed to save file: {e}"))
        })?;

        let url = format!("/uploads/{}", filename);

        return Ok(Json(ApiResponse::success(serde_json::json!({
            "url": url,
            "filename": filename,
            "size": data.len(),
        }))));
    }

    Err(AppError::BadRequest("No file provided".to_string()))
}
