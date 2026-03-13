use glue::errors::NanoServiceError;
use to_do_dal::to_do_items::transactions::delete::DeleteOne;

// use crate::structs::ToDoItem;
// use dal::json_file::delete_one;

pub async fn delete<T: DeleteOne>(id: &str) -> Result<(), NanoServiceError> {
    let _ = T::delete_one(id.to_string()).await?;
    Ok(())
}
