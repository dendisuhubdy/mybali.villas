use axum::{
    routing::{get, put},
    Router,
};
use std::sync::Arc;

use crate::handlers;
use crate::AppState;

pub fn routes(state: Arc<AppState>) -> Router {
    Router::new()
        .route("/", get(handlers::bookings::list_bookings))
        .route("/{id}", get(handlers::bookings::get_booking))
        .route(
            "/{id}/status",
            put(handlers::bookings::update_booking_status),
        )
        .with_state(state)
}
