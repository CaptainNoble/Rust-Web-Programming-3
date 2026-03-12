import React from "react";
import { updateToDoItemCall } from "../api/update";
import { deleteToDoItemCall } from "../api/delete";
import { TaskStatus } from "../interfaces/toDoItems";
import { Check, Trash2 } from "lucide-react";

interface ToDoItemProps {
    title: string;
    status: string;
    id: number;
    passBackResponse: (response: any) => void;
    buttonMessage: string;
    isPending: boolean;
}

export const ToDoItem: React.FC<ToDoItemProps> = ({
    title,
    status,
    id,
    passBackResponse,
    buttonMessage,
    isPending,
}) => {
    const sendRequest = async () => {
        if (buttonMessage === "edit") {
            await updateToDoItemCall(title, TaskStatus.DONE, id).then(
                (response) => {
                    passBackResponse(response);
                },
            );
        } else {
            await deleteToDoItemCall(title).then((response) => {
                passBackResponse(response);
            });
        }
    };

    return (
        <div 
            className={`itemContainer ${isPending ? "pending" : "done"}`}
            role="listitem"
        >
            <p>{title}</p>
            <button 
                className={`actionButton ${!isPending ? "delete" : ""}`} 
                onClick={sendRequest}
                aria-label={isPending ? `Mark "${title}" as complete` : `Delete "${title}"`}
            >
                {isPending ? <Check size={18} /> : <Trash2 size={18} />}
                <span>{buttonMessage}</span>
            </button>
        </div>
    );
};
