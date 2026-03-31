use axum::{
    routing::{delete, get, put},
    Router,
};
use std::sync::Arc;

use crate::handlers;
use crate::AppState;

pub fn routes(state: Arc<AppState>) -> Router {
    Router::new()
        .route("/", get(handlers::reviews::list_reviews))
        .route("/{id}/approve", put(handlers::reviews::approve_review))
        .route("/{id}/flag", put(handlers::reviews::flag_review))
        .route("/{id}", delete(handlers::reviews::delete_review))
        .with_state(state)
}
