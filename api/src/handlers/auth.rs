use axum::extract::State;
use axum::Json;
use shared::auth::{create_token, hash_password, verify_password};
use shared::errors::AppError;
use shared::google::verify_google_token;
use shared::models::User;
use std::sync::Arc;
use uuid::Uuid;
use validator::Validate;

use crate::models::{
    ApiResponse, CreateUserRequest, GoogleLoginRequest, LoginRequest, LoginResponse, UserResponse,
};
use crate::AppState;

/// POST /api/v1/auth/register
///
/// Create a new user account and return a JWT.
pub async fn register(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<CreateUserRequest>,
) -> Result<Json<ApiResponse<LoginResponse>>, AppError> {
    // Validate input
    payload
        .validate()
        .map_err(|e| AppError::BadRequest(format!("Validation error: {e}")))?;

    // Check email uniqueness
    let existing: Option<User> = sqlx::query_as("SELECT * FROM users WHERE email = $1")
        .bind(&payload.email)
        .fetch_optional(&state.pool)
        .await?;

    if existing.is_some() {
        return Err(AppError::Conflict(
            "A user with this email already exists".to_string(),
        ));
    }

    // Hash password
    let password_hash = hash_password(&payload.password)?;

    // Insert user
    let user: User = sqlx::query_as(
        r#"
        INSERT INTO users (id, email, password_hash, full_name, role, is_active, created_at, updated_at)
        VALUES ($1, $2, $3, $4, 'user', true, NOW(), NOW())
        RETURNING *
        "#,
    )
    .bind(Uuid::new_v4())
    .bind(&payload.email)
    .bind(&password_hash)
    .bind(&payload.full_name)
    .fetch_one(&state.pool)
    .await?;

    // Create JWT
    let token = create_token(user.id, &user.email, &user.role, &state.jwt_secret)?;

    let response = LoginResponse {
        token,
        user: UserResponse::from(user),
    };

    Ok(Json(ApiResponse::success(response)))
}

/// POST /api/v1/auth/login
///
/// Authenticate with email and password, return a JWT.
pub async fn login(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<LoginRequest>,
) -> Result<Json<ApiResponse<LoginResponse>>, AppError> {
    // Find user by email
    let user: User = sqlx::query_as("SELECT * FROM users WHERE email = $1 AND is_active = true")
        .bind(&payload.email)
        .fetch_optional(&state.pool)
        .await?
        .ok_or_else(|| AppError::Unauthorized("Invalid email or password".to_string()))?;

    // Handle Google-only users (no password set)
    let password_hash = user.password_hash.as_deref().ok_or_else(|| {
        AppError::Unauthorized(
            "This account uses Google sign-in. Please sign in with Google.".to_string(),
        )
    })?;

    // Verify password
    let valid = verify_password(&payload.password, password_hash)?;
    if !valid {
        return Err(AppError::Unauthorized(
            "Invalid email or password".to_string(),
        ));
    }

    // Create JWT
    let token = create_token(user.id, &user.email, &user.role, &state.jwt_secret)?;

    let response = LoginResponse {
        token,
        user: UserResponse::from(user),
    };

    Ok(Json(ApiResponse::success(response)))
}

/// POST /api/v1/auth/google
///
/// Authenticate with a Google ID token. Creates the user if they don't exist,
/// or links the Google account to an existing email-based account.
pub async fn google_login(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<GoogleLoginRequest>,
) -> Result<Json<ApiResponse<LoginResponse>>, AppError> {
    // Verify the Google ID token
    let google_user = verify_google_token(&payload.credential, &state.google_client_id).await?;

    // Try to find existing user by google_id first
    let user: Option<User> = sqlx::query_as("SELECT * FROM users WHERE google_id = $1")
        .bind(&google_user.google_id)
        .fetch_optional(&state.pool)
        .await?;

    let user = if let Some(user) = user {
        // Known Google user — log them in
        user
    } else {
        // Check if a user with this email already exists (password-registered user)
        let existing: Option<User> = sqlx::query_as("SELECT * FROM users WHERE email = $1")
            .bind(&google_user.email)
            .fetch_optional(&state.pool)
            .await?;

        if let Some(_existing) = existing {
            // Link Google ID to existing email user
            sqlx::query_as(
                r#"
                UPDATE users
                SET google_id = $1,
                    avatar_url = COALESCE(avatar_url, $2),
                    email_verified = true,
                    updated_at = NOW()
                WHERE email = $3
                RETURNING *
                "#,
            )
            .bind(&google_user.google_id)
            .bind(&google_user.picture)
            .bind(&google_user.email)
            .fetch_one(&state.pool)
            .await?
        } else {
            // Create new user (no password)
            sqlx::query_as(
                r#"
                INSERT INTO users (id, email, password_hash, full_name, google_id, avatar_url, role, is_active, email_verified, created_at, updated_at)
                VALUES ($1, $2, NULL, $3, $4, $5, 'user', true, true, NOW(), NOW())
                RETURNING *
                "#,
            )
            .bind(Uuid::new_v4())
            .bind(&google_user.email)
            .bind(&google_user.name)
            .bind(&google_user.google_id)
            .bind(&google_user.picture)
            .fetch_one(&state.pool)
            .await?
        }
    };

    // Update last_login_at
    sqlx::query("UPDATE users SET last_login_at = NOW() WHERE id = $1")
        .bind(user.id)
        .execute(&state.pool)
        .await?;

    // Create app JWT
    let token = create_token(user.id, &user.email, &user.role, &state.jwt_secret)?;

    let response = LoginResponse {
        token,
        user: UserResponse::from(user),
    };

    Ok(Json(ApiResponse::success(response)))
}
