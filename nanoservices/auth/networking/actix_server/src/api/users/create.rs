use actix_web::{HttpResponse, web::Json};
use auth_core::api::users::create::{CreateUser, create as create_core};
//use auth_dal::users::schema::NewUser;
use auth_dal::users::transactions::create::SaveOne;
use glue::errors::NanoServiceError;

pub async fn create<T: SaveOne>(body: Json<CreateUser>) -> Result<HttpResponse, NanoServiceError> {
    let _ = create_core::<T>(body.into_inner()).await?;
    Ok(HttpResponse::Created().finish())
}
