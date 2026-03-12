use dal::to_do_items::schema::ToDoItem;
use dal::to_do_items::transactions::update::UpdateOne;
use glue::errors::NanoServiceError;

// use crate::structs::ToDoItem;
// use dal::json_file::{get_all as get_all_handle, save_all};

pub async fn update<T: UpdateOne>(item: ToDoItem) -> Result<(), NanoServiceError> {
    let _ = T::update_one(item).await?;
    Ok(())
}
