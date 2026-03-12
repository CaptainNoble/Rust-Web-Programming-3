use dal::to_do_items::schema::{NewToDoItem, ToDoItem};
use dal::to_do_items::transactions::create::SaveOne;
use glue::errors::NanoServiceError;

// use crate::structs::ToDoItem;
// use dal::json_file::save_one;

pub async fn create<T: SaveOne>(item: NewToDoItem) -> Result<ToDoItem, NanoServiceError> {
    let created_item = T::save_one(item).await?;
    Ok(created_item)
}
