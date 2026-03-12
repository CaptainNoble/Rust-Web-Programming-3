# AGENTS.md - Coding Guidelines for Rust Web Programming

This document provides guidelines for AI agents working on this Rust web application codebase.

## Project Overview

This is a Rust-based web application with:
- **Workspace**: Multi-crate workspace in root `Cargo.toml`
- **Frontend**: React 19 + TypeScript, built with esbuild, WASM via wasm-pack
- **Backend**: Actix-web server with SQLx for PostgreSQL
- **Architecture**: Nanoservices pattern with separate crates for auth, to_do, DAL, and networking
- **Glue**: Shared error handling in `glue/` crate

## Build Commands

```bash
# Build entire workspace
cargo build
cargo build --release

# Build specific package
cargo build -p dal
cargo build -p actix_server

# Build with features
cargo build --features sqlx-postgres
cargo build --features json-file
```

## Test Commands

```bash
# Run all tests
cargo test --workspace

# Run tests for specific package
cargo test -p dal
cargo test -p to_do_core

# Run tests for specific module
cargo test -p dal --lib to_do_items::transactions

# Run single test
cargo test -p dal --lib to_do_items::transactions::create::test_save_one

# Run with output
cargo test -- --nocapture

# Run tests with features
cargo test --features sqlx-postgres
cargo test --features json-file

# Lint Rust code
cargo clippy
cargo clippy --fix
cargo fmt --check
cargo fmt
```

## Frontend Commands

```bash
cd frontend

# Install dependencies
npm install

# Build WASM interface
npm run wasm

# Build frontend assets
npm run build

# Serve frontend locally
npm run serve
```

## Database Commands

```bash
# Install sqlx CLI
cargo install sqlx-cli

# Run migrations (requires DATABASE_URL)
export DATABASE_URL=postgres://user:pass@localhost/to_do
sqlx migrate run
```

## Code Style - Rust

### Error Handling
- Use `NanoServiceError` from `glue::errors`
- Wrap errors with `safe_eject!` macro
- Return `Result<T, NanoServiceError>` from async functions

```rust
use glue::errors::{NanoServiceError, NanoServiceErrorStatus};
use glue::safe_eject;

let result = safe_eject!(some_operation(), NanoServiceErrorStatus::Unknown)?;
```

### Imports (order: std, external, workspace, local, conditional)
```rust
use std::future::Future;
use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use sqlx::query_as;

use glue::errors::{NanoServiceError, NanoServiceErrorStatus};
use glue::safe_eject;

use crate::connections::sqlx_postgres::SQLX_POSTGRES_POOL;
use super::super::descriptors::SqlxPostGresDescriptor;

#[cfg(feature = "json-file")]
use crate::json_file::{get_all, save_all};
```

### Naming
- Traits: verb phrases (`SaveOne`, `GetAll`, `DeleteOne`)
- Functions: `snake_case`
- Structs/Enums: `PascalCase`
- Modules: `snake_case`
- Features: `kebab-case` in Cargo.toml

### Feature Flags
```rust
#[cfg(feature = "sqlx-postgres")]
impl SaveOne for SqlxPostGresDescriptor { ... }

#[cfg(feature = "json-file")]
impl SaveOne for JsonFileDescriptor { ... }
```

## Code Style - TypeScript/React

### Component Patterns
- Use functional components with TypeScript interfaces for props
- Define interfaces in `src/interfaces/`
- Use `React.FC<Props>` for component typing
- Destructure props in function parameters

```tsx
interface ToDoItemProps {
    title: string;
    id: number;
    passBackResponse: (response: any) => void;
    isPending: boolean;
}

export const ToDoItem: React.FC<ToDoItemProps> = ({
    title,
    id,
    passBackResponse,
    isPending,
}) => {
    // component logic
    return <div>...</div>;
};
```

### State Management
- Use `useState` for local component state
- Use `useEffect` for side effects
- Handle async operations with `.then()` or `await`

### CSS Styling
- Use CSS modules or global CSS files
- Define CSS custom properties (variables) for theming
- Use flexbox/grid for layout
- Add transitions for interactive elements

### API Calls
- Create API modules in `src/api/`
- Use axios for HTTP requests
- Handle errors consistently

```ts
export async function createToDoItemCall(title: string) {
    const response = await postCall<{title: string}, ToDoItems>(
        new Url().create,
        { title, status: "PENDING" },
        201
    );
    return response;
}
```

## API Endpoints

Server runs on `127.0.0.1:8080`:

```bash
# GET all items
curl http://127.0.0.1:8080/api/v1/get/all

# CREATE item
curl -X POST http://127.0.0.1:8080/api/v1/create \
     -H "Content-Type: application/json" \
     -H "token: some_token" \
     -d '{"title": "writing", "status": "PENDING"}'

# UPDATE item
curl -X PUT http://127.0.0.1:8080/api/v1/update \
     -H "Content-Type: application/json" \
     -d '{"id": 1, "title": "coding", "status": "DONE"}'

# DELETE item
curl -X DELETE http://127.0.0.1:8080/api/v1/delete/<title>
```

## Development Workflow

1. Set `DATABASE_URL` environment variable
2. Run `sqlx migrate run` to apply migrations
3. Build WASM: `cd frontend && npm run wasm`
4. Build frontend: `npm run build`
5. Run server: `cargo run -p actix_server`
6. Access at `http://127.0.0.1:8001`
