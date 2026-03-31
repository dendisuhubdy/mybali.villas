use axum::routing::post;
use axum::Router;

use crate::handlers::uploads;

pub fn routes() -> Router<std::sync::Arc<crate::AppState>> {
    Router::new()
        .route("/image", post(uploads::upload_image))
}
