pub mod auth;
pub mod bookings;
pub mod properties;
pub mod uploads;
pub mod users;

use axum::middleware;
use axum::Router;
use std::sync::Arc;
use tower_http::services::ServeDir;

use crate::middleware::auth::auth_middleware;
use crate::AppState;

/// Build the full application router with all route groups nested under
/// `/api/v1`.
pub fn create_router(state: Arc<AppState>) -> Router {
    let upload_dir = std::env::var("UPLOAD_DIR").unwrap_or_else(|_| "/app/uploads".to_string());

    Router::new()
        .nest(
            "/api/v1",
            Router::new()
                .nest("/auth", auth::routes())
                .nest("/properties", properties::routes())
                .nest("/users", users::routes())
                .nest("/bookings", bookings::routes())
                .nest("/uploads", uploads::routes()),
        )
        // Serve uploaded files at /uploads/
        .nest_service("/uploads", ServeDir::new(upload_dir))
        .layer(middleware::from_fn_with_state(
            state.clone(),
            auth_middleware,
        ))
        .with_state(state)
}
