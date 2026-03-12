use actix_web::{HttpResponse, web::Json};
use core::api::basic_actions::{get::get_all as get_all_core, update::update as update_core};
use dal::to_do_items::schema::ToDoItem;
use dal::to_do_items::transactions::{get::GetAll, update::UpdateOne};
use glue::errors::NanoServiceError;

pub async fn update<T: UpdateOne + GetAll>(
    body: Json<ToDoItem>,
) -> Result<HttpResponse, NanoServiceError> {
    let _ = update_core::<T>(body.into_inner()).await?;
    Ok(HttpResponse::Ok().json(get_all_core::<T>().await?))
}
