use axum::extract::{Path, Query, State};
use axum::Json;
use shared::errors::AppError;
use shared::models::Review;
use std::sync::Arc;
use uuid::Uuid;

use crate::middleware::RequireAdmin;
use crate::models::{ApiResponse, PaginatedResponse, ReviewFilterParams};
use crate::AppState;

/// GET /api/admin/reviews
///
/// List all reviews with pagination and optional is_approved filter.
pub async fn list_reviews(
    RequireAdmin(_claims): RequireAdmin,
    State(state): State<Arc<AppState>>,
    Query(params): Query<ReviewFilterParams>,
) -> Result<Json<ApiResponse<PaginatedResponse<Review>>>, AppError> {
    let pagination = params.pagination();
    let limit = pagination.limit();
    let offset = pagination.offset();

    let reviews = sqlx::query_as::<_, Review>(
        r#"
        SELECT *
        FROM reviews
        WHERE ($1::bool IS NULL OR is_approved = $1)
            AND ($2::bool IS NULL OR is_flagged = $2)
        ORDER BY created_at DESC
        LIMIT $3 OFFSET $4
        "#,
    )
    .bind(params.is_approved)
    .bind(params.is_flagged)
    .bind(limit)
    .bind(offset)
    .fetch_all(&state.pool)
    .await?;

    let total = sqlx::query_scalar::<_, i64>(
        r#"
        SELECT COUNT(*)
        FROM reviews
        WHERE ($1::bool IS NULL OR is_approved = $1)
            AND ($2::bool IS NULL OR is_flagged = $2)
        "#,
    )
    .bind(params.is_approved)
    .bind(params.is_flagged)
    .fetch_one(&state.pool)
    .await?;

    let total_pages = (total as f64 / limit as f64).ceil() as i64;

    Ok(Json(ApiResponse::success(PaginatedResponse {
        items: reviews,
        total,
        page: pagination.current_page(),
        per_page: limit,
        total_pages,
    })))
}

/// PUT /api/admin/reviews/:id/approve
///
/// Approve a review (sets is_approved=true) and recalculates the property avg_rating.
pub async fn approve_review(
    RequireAdmin(_claims): RequireAdmin,
    State(state): State<Arc<AppState>>,
    Path(id): Path<Uuid>,
) -> Result<Json<ApiResponse<Review>>, AppError> {
    let review = sqlx::query_as::<_, Review>(
        r#"
        UPDATE reviews
        SET is_approved = true, updated_at = NOW()
        WHERE id = $1
        RETURNING *
        "#,
    )
    .bind(id)
    .fetch_optional(&state.pool)
    .await?
    .ok_or_else(|| AppError::NotFound(format!("Review {id} not found")))?;

    Ok(Json(ApiResponse::success(review)))
}

/// PUT /api/admin/reviews/:id/flag
///
/// Flag a review (sets is_flagged=true).
pub async fn flag_review(
    RequireAdmin(_claims): RequireAdmin,
    State(state): State<Arc<AppState>>,
    Path(id): Path<Uuid>,
) -> Result<Json<ApiResponse<Review>>, AppError> {
    let review = sqlx::query_as::<_, Review>(
        r#"
        UPDATE reviews
        SET is_flagged = true, updated_at = NOW()
        WHERE id = $1
        RETURNING *
        "#,
    )
    .bind(id)
    .fetch_optional(&state.pool)
    .await?
    .ok_or_else(|| AppError::NotFound(format!("Review {id} not found")))?;

    Ok(Json(ApiResponse::success(review)))
}

/// DELETE /api/admin/reviews/:id
///
/// Delete a review and recalculate the property avg_rating.
pub async fn delete_review(
    RequireAdmin(_claims): RequireAdmin,
    State(state): State<Arc<AppState>>,
    Path(id): Path<Uuid>,
) -> Result<Json<ApiResponse<Review>>, AppError> {
    // Fetch first to get the property_id for recalculation.
    let review = sqlx::query_as::<_, Review>("SELECT * FROM reviews WHERE id = $1")
        .bind(id)
        .fetch_optional(&state.pool)
        .await?
        .ok_or_else(|| AppError::NotFound(format!("Review {id} not found")))?;

    sqlx::query("DELETE FROM reviews WHERE id = $1")
        .bind(id)
        .execute(&state.pool)
        .await?;

    Ok(Json(ApiResponse::success(review)))
}
