use sqlx::postgres::{PgPool, PgPoolOptions};
use std::env;
use std::sync::LazyLock as Lazy;

// Connection pool is wrapped in a static - code is evaluated once when initially called
// and then never again throughout the lifetime of the program.
pub static SQLX_POSTGRES_POOL: Lazy<PgPool> = Lazy::new(|| {
    let connection_string = env::var("TO_DO_DB_URL").expect("TO_DO_DB_URL Missing!");
    let max_connections = match env::var("TO_DO_MAX_CONNECTIONS") {
        Ok(val) => val,
        Err(_) => "5".to_string(),
    }
    .trim()
    .parse::<u32>()
    .map_err(|_| "Could not parse max connections".to_string())
    .unwrap();

    let pool = PgPoolOptions::new().max_connections(max_connections);
    pool.connect_lazy(&connection_string)
        .expect("Failed to create pool")
});
