use axum::extract::FromRequestParts;
use axum::http::request::Parts;
use shared::auth::{verify_token, Claims};
use shared::errors::AppError;
use shared::models::UserRole;
use std::sync::Arc;

use crate::AppState;

// ---------------------------------------------------------------------------
// Helper: extract and validate JWT, returning claims + parsed role
// ---------------------------------------------------------------------------

fn parse_role_from_claims(claims: &Claims) -> Result<UserRole, AppError> {
    claims
        .role
        .parse::<UserRole>()
        .map_err(|_| AppError::Unauthorized(format!("Unknown role: {}", claims.role)))
}

async fn extract_claims(
    parts: &mut Parts,
    state: &Arc<AppState>,
) -> Result<(Claims, UserRole), AppError> {
    let auth_header = parts
        .headers
        .get("Authorization")
        .and_then(|v| v.to_str().ok())
        .ok_or_else(|| AppError::Unauthorized("Missing Authorization header".to_string()))?;

    let token = auth_header.strip_prefix("Bearer ").ok_or_else(|| {
        AppError::Unauthorized("Invalid Authorization header format".to_string())
    })?;

    let claims = verify_token(token, &state.jwt_secret)?;
    let role = parse_role_from_claims(&claims)?;

    Ok((claims, role))
}

// ---------------------------------------------------------------------------
// RequireAdmin: any admin-portal role (super_admin | admin | operational)
// ---------------------------------------------------------------------------

/// Extractor that verifies the caller has any admin-portal role.
/// All three roles (super_admin, admin, operational) pass this check.
#[derive(Debug, Clone)]
pub struct RequireAdmin(pub Claims, pub UserRole);

impl FromRequestParts<Arc<AppState>> for RequireAdmin {
    type Rejection = AppError;

    async fn from_request_parts(
        parts: &mut Parts,
        state: &Arc<AppState>,
    ) -> Result<Self, Self::Rejection> {
        let (claims, role) = extract_claims(parts, state).await?;

        if !role.is_admin_portal_role() {
            return Err(AppError::Unauthorized("Admin portal access required".to_string()));
        }

        Ok(RequireAdmin(claims, role))
    }
}

// ---------------------------------------------------------------------------
// RequireAdminOrAbove: only super_admin or admin (not operational)
// ---------------------------------------------------------------------------

/// Extractor that requires at least the `admin` role.
/// Operational team members are rejected.
#[derive(Debug, Clone)]
pub struct RequireAdminOrAbove(pub Claims, pub UserRole);

impl FromRequestParts<Arc<AppState>> for RequireAdminOrAbove {
    type Rejection = AppError;

    async fn from_request_parts(
        parts: &mut Parts,
        state: &Arc<AppState>,
    ) -> Result<Self, Self::Rejection> {
        let (claims, role) = extract_claims(parts, state).await?;

        if !role.can_manage_users() {
            return Err(AppError::Unauthorized(
                "Admin or Super Admin access required".to_string(),
            ));
        }

        Ok(RequireAdminOrAbove(claims, role))
    }
}

// ---------------------------------------------------------------------------
// RequireSuperAdmin: only super_admin
// ---------------------------------------------------------------------------

/// Extractor that requires the `super_admin` role.
#[derive(Debug, Clone)]
pub struct RequireSuperAdmin(pub Claims, pub UserRole);

impl FromRequestParts<Arc<AppState>> for RequireSuperAdmin {
    type Rejection = AppError;

    async fn from_request_parts(
        parts: &mut Parts,
        state: &Arc<AppState>,
    ) -> Result<Self, Self::Rejection> {
        let (claims, role) = extract_claims(parts, state).await?;

        if role != UserRole::SuperAdmin {
            return Err(AppError::Unauthorized(
                "Super Admin access required".to_string(),
            ));
        }

        Ok(RequireSuperAdmin(claims, role))
    }
}
