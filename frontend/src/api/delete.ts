import { ToDoItems } from "../interfaces/toDoItems";
import { deleteCall } from "./utils";
import { Url } from "./url";

export async function deleteToDoItemCall(name: string) {
    let response = await deleteCall<ToDoItems>(new Url().deleteUrl(name), 200);
    return response;
}
