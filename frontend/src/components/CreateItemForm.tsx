import React, { useState } from "react";
import { createToDoItemCall } from "../api/create";
import { Plus } from "lucide-react";

interface CreateToDoItemProps {
    passBackResponse: (response: any) => void;
}

export const CreateToDoItem: React.FC<CreateToDoItemProps> = ({
    passBackResponse,
}) => {
    const [title, setTitle] = useState<string>("");

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && title.trim()) {
            createItem();
        }
    };

    const createItem = async () => {
        await createToDoItemCall(title).then((response) => {
            setTitle("");
            passBackResponse(response);
        });
    };
    return (
        <div className="inputContainer">
            <input
                type="text"
                id="name"
                placeholder="Create a new task..."
                value={title}
                onChange={handleTitleChange}
                onKeyDown={handleKeyDown}
                aria-label="New task title"
            />
            <button
                className="actionButton"
                id="create-button"
                onClick={createItem}
                disabled={!title.trim()}
                aria-label="Create new task"
            >
                <Plus size={18} />
                <span>Create</span>
            </button>
        </div>
    );
};
