use actix_web::{HttpRequest, HttpResponse};
use core::api::basic_actions::{delete::delete as delete_core, get::get_all as get_all_core};
use dal::to_do_items::transactions::{delete::DeleteOne, get::GetAll};
use glue::errors::{NanoServiceError, NanoServiceErrorStatus};

pub async fn delete_by_name<T: DeleteOne + GetAll>(
    req: HttpRequest,
) -> Result<HttpResponse, NanoServiceError> {
    match req.match_info().get("name") {
        Some(name) => {
            delete_core::<T>(name).await?;
        }
        None => {
            return Err(NanoServiceError::new(
                "Name not provided".to_string(),
                NanoServiceErrorStatus::BadRequest,
            ));
        }
    };
    Ok(HttpResponse::Ok().json(get_all_core::<T>().await?))
}
