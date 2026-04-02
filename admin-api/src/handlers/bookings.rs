use axum::extract::{Path, Query, State};
use axum::Json;
use shared::errors::AppError;
use shared::models::Booking;
use std::sync::Arc;
use uuid::Uuid;

use crate::middleware::RequireAdmin;
use crate::models::{
    ApiResponse, BookingFilterParams, PaginatedResponse, UpdateBookingStatusRequest,
};
use crate::AppState;

/// GET /api/admin/bookings
///
/// List all bookings with pagination and optional status/property_id filter.
pub async fn list_bookings(
    RequireAdmin(_claims, _role): RequireAdmin,
    State(state): State<Arc<AppState>>,
    Query(params): Query<BookingFilterParams>,
) -> Result<Json<ApiResponse<PaginatedResponse<Booking>>>, AppError> {
    let pagination = params.pagination();
    let limit = pagination.limit();
    let offset = pagination.offset();

    let status_str = params.status.as_ref().map(|s| {
        serde_json::to_value(s)
            .ok()
            .and_then(|v| v.as_str().map(String::from))
            .unwrap_or_default()
    });

    let bookings = sqlx::query_as::<_, Booking>(
        r#"
        SELECT *
        FROM bookings
        WHERE ($1::text IS NULL OR status::text = $1)
            AND ($2::uuid IS NULL OR property_id = $2)
        ORDER BY created_at DESC
        LIMIT $3 OFFSET $4
        "#,
    )
    .bind(&status_str)
    .bind(params.property_id)
    .bind(limit)
    .bind(offset)
    .fetch_all(&state.pool)
    .await?;

    let total = sqlx::query_scalar::<_, i64>(
        r#"
        SELECT COUNT(*)
        FROM bookings
        WHERE ($1::text IS NULL OR status::text = $1)
            AND ($2::uuid IS NULL OR property_id = $2)
        "#,
    )
    .bind(&status_str)
    .bind(params.property_id)
    .fetch_one(&state.pool)
    .await?;

    let total_pages = (total as f64 / limit as f64).ceil() as i64;

    Ok(Json(ApiResponse::success(PaginatedResponse {
        items: bookings,
        total,
        page: pagination.current_page(),
        per_page: limit,
        total_pages,
    })))
}

/// GET /api/admin/bookings/:id
///
/// Get a single booking by ID.
pub async fn get_booking(
    RequireAdmin(_claims, _role): RequireAdmin,
    State(state): State<Arc<AppState>>,
    Path(id): Path<Uuid>,
) -> Result<Json<ApiResponse<Booking>>, AppError> {
    let booking = sqlx::query_as::<_, Booking>("SELECT * FROM bookings WHERE id = $1")
        .bind(id)
        .fetch_optional(&state.pool)
        .await?
        .ok_or_else(|| AppError::NotFound(format!("Booking {id} not found")))?;

    Ok(Json(ApiResponse::success(booking)))
}

/// PUT /api/admin/bookings/:id/status
///
/// Update the status of a booking (confirm, check-in, check-out, cancel, refund).
pub async fn update_booking_status(
    RequireAdmin(_claims, _role): RequireAdmin,
    State(state): State<Arc<AppState>>,
    Path(id): Path<Uuid>,
    Json(payload): Json<UpdateBookingStatusRequest>,
) -> Result<Json<ApiResponse<Booking>>, AppError> {
    use shared::models::BookingStatus;

    // If cancelling, also set cancelled_at and cancellation_reason.
    let booking = if payload.status == BookingStatus::Cancelled
        || payload.status == BookingStatus::Refunded
    {
        sqlx::query_as::<_, Booking>(
            r#"
            UPDATE bookings
            SET status = $2,
                cancelled_at = NOW(),
                cancellation_reason = COALESCE($3, cancellation_reason),
                updated_at = NOW()
            WHERE id = $1
            RETURNING *
            "#,
        )
        .bind(id)
        .bind(&payload.status)
        .bind(&payload.reason)
        .fetch_optional(&state.pool)
        .await?
    } else {
        sqlx::query_as::<_, Booking>(
            r#"
            UPDATE bookings
            SET status = $2, updated_at = NOW()
            WHERE id = $1
            RETURNING *
            "#,
        )
        .bind(id)
        .bind(&payload.status)
        .fetch_optional(&state.pool)
        .await?
    };

    let booking =
        booking.ok_or_else(|| AppError::NotFound(format!("Booking {id} not found")))?;

    Ok(Json(ApiResponse::success(booking)))
}
