import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import getAll from "./api/get";
import { ToDoItems } from "./interfaces/toDoItems";
import { ToDoItem } from "./components/ToDoItem";
import { CreateToDoItem } from "./components/CreateItemForm";
import "./App.css";
import init, {
    rust_generate_button_text,
} from "../rust-interface/pkg/rust_interface.js";
import { Loader2, CheckCircle2, ListTodo, AlertCircle } from "lucide-react";
import { LoginForm } from "./components/LoginForm.js";

const App = () => {
    const [data, setData] = useState<ToDoItems | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [wasmReady, setWasmReady] = useState<boolean>(false);
    const [RustGenerateButtonText, setRustGenerateButtonText] = useState<
        ((input: string) => string) | null
    >(null);
    const [loggedin, setLoggedin] = useState<boolean>(
        localStorage.getItem("token") !== null,
    );

    function setToken(token: string) {
        localStorage.setItem("token", token);
        setLoggedin(true);
    }

    function reRenderItems(response: any) {
        if (response.error) {
            alert(JSON.stringify(response));
            return;
        } else if (response.data) {
            setData(response.data);
            setError(null);
        } else {
            setError("Unknown error");
        }
    }

    React.useEffect(() => {
        init()
            .then(() => {
                setRustGenerateButtonText(() => rust_generate_button_text);
                setWasmReady(true);
            })
            .catch((e) => console.error("Error initializing WASM: ", e));
    }, []);

    React.useEffect(() => {
        const fetchData = async () => {
            const response = await getAll();
            if (response.error) {
                setError(response.error);
            } else if (response.data && typeof response.data !== "string") {
                setData(response.data);
            } else {
                setError("Invalid response");
            }
        };
        if (wasmReady && loggedin) {
            fetchData();
        }
    }, [wasmReady, loggedin]);

    if (localStorage.getItem("token") === null) {
        return <LoginForm setToken={setToken} />;
    }

    if (error) {
        return (
            <div className="App">
                <div className="mainContainer">
                    <div
                        className="state-container error-state"
                        role="alert"
                        aria-live="assertive"
                    >
                        <AlertCircle size={48} className="state-icon" />
                        <h1>Error</h1>
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        );
    } else if (!data) {
        return (
            <div className="App">
                <div className="mainContainer">
                    <div
                        className="state-container loading-state"
                        role="status"
                        aria-live="polite"
                    >
                        <Loader2 size={48} className="state-icon spinning" />
                        <h1>Loading...</h1>
                        <p>Preparing your tasks</p>
                    </div>
                </div>
            </div>
        );
    }

    const pendingCount = data.pending.length;
    const doneCount = data.done.length;

    return (
        <div className="App">
            <div className="mainContainer">
                <div className="header">
                    <h1>TaskFlow</h1>
                    <div className="stats">
                        <div className="stat pending">
                            <span className="stat-value">{pendingCount}</span>
                            <span className="stat-label">Pending</span>
                        </div>
                        <div className="stat done">
                            <span className="stat-value">{doneCount}</span>
                            <span className="stat-label">Completed</span>
                        </div>
                    </div>
                </div>

                <div aria-live="polite" aria-atomic="true">
                    {data.pending.length > 0 && (
                        <>
                            <h2 className="section-title pending">
                                Pending Tasks
                            </h2>
                            <div
                                className="items-list"
                                role="list"
                                aria-label="Pending tasks"
                            >
                                {data.pending.map((item) => (
                                    <ToDoItem
                                        key={item.id}
                                        title={item.title}
                                        status={item.status}
                                        id={item.id}
                                        buttonMessage={
                                            RustGenerateButtonText?.(
                                                item.status,
                                            ) || "edit"
                                        }
                                        passBackResponse={reRenderItems}
                                        isPending={true}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    {data.done.length > 0 && (
                        <>
                            <h2 className="section-title done">
                                Completed Tasks
                            </h2>
                            <div
                                className="items-list"
                                role="list"
                                aria-label="Completed tasks"
                            >
                                {data.done.map((item) => (
                                    <ToDoItem
                                        key={item.id}
                                        title={item.title}
                                        status={item.status}
                                        id={item.id}
                                        buttonMessage={
                                            RustGenerateButtonText?.(
                                                item.status,
                                            ) || "delete"
                                        }
                                        passBackResponse={reRenderItems}
                                        isPending={false}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {data.pending.length === 0 && data.done.length === 0 && (
                    <div className="empty-state" role="status">
                        <ListTodo size={64} className="empty-icon" />
                        <h3>No tasks yet</h3>
                        <p>Create your first task below to get started!</p>
                    </div>
                )}

                <CreateToDoItem passBackResponse={reRenderItems} />
            </div>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<App />);
