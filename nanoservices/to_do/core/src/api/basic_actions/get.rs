use glue::errors::NanoServiceError;
use to_do_dal::to_do_items::schema::AllToDoItems;
use to_do_dal::to_do_items::transactions::get::GetAll;

// use crate::structs::{AllToDoItems, ToDoItem};
// use dal::json_file::get_all as get_all_handle;

pub async fn get_all<T: GetAll>() -> Result<AllToDoItems, NanoServiceError> {
    let all_items = T::get_all().await?;
    AllToDoItems::from_vec(all_items)
}

// pub async fn get_by_name(name: &str) -> Result<ToDoItem, NanoServiceError> {
//     Ok(get_all_handle::<ToDoItem>()?
//         .remove(name)
//         .ok_or(NanoServiceError::new(
//             format!("Item with name {} not found", name),
//             NanoServiceErrorStatus::NotFound,
//         ))?)
// }
