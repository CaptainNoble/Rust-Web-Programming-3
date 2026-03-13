use crate::errors::{NanoServiceError, NanoServiceErrorStatus};
use jsonwebtoken::{Algorithm, DecodingKey, EncodingKey, Header, Validation, decode, encode};
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct HeaderToken {
    pub unique_id: String,
}

impl HeaderToken {
    pub fn get_key() -> Result<String, NanoServiceError> {
        std::env::var("JWT_SECRET")
            .map_err(|e| NanoServiceError::new(e.to_string(), NanoServiceErrorStatus::Unauthorized))
    }

    pub fn encode(self) -> Result<String, NanoServiceError> {
        let key_str = Self::get_key()?;
        let key = EncodingKey::from_secret(key_str.as_ref());
        return match encode(&Header::default(), &self, &key) {
            Ok(token) => Ok(token),
            Err(error) => Err(NanoServiceError::new(
                error.to_string(),
                NanoServiceErrorStatus::Unauthorized,
            )),
        };
    }
    pub fn decode(token: &str) -> Result<Self, NanoServiceError> {
        let key_str = Self::get_key()?;
        let key = DecodingKey::from_secret(key_str.as_ref());
        let mut validation = Validation::new(Algorithm::HS256);
        validation.required_spec_claims.remove("exp"); // Removing the expiry time from the expected means the token will not expire.
        match decode::<Self>(token, &key, &validation) {
            Ok(token_data) => return Ok(token_data.claims),
            Err(error) => {
                return Err(NanoServiceError::new(
                    error.to_string(),
                    NanoServiceErrorStatus::Unauthorized,
                ));
            }
        };
    }
}

// Actix Web implementation of FromRequest for HeaderToken
#[cfg(feature = "actix")]
mod actix_impl {
    use super::HeaderToken;
    use crate::errors::{NanoServiceError, NanoServiceErrorStatus};
    pub use actix_web::{FromRequest as ActixFromRequest, HttpRequest, dev::Payload};
    use futures::future::{Ready, err, ok};

    impl ActixFromRequest for HeaderToken {
        type Error = NanoServiceError;
        type Future = Ready<Result<HeaderToken, NanoServiceError>>;

        fn from_request(req: &HttpRequest, _: &mut Payload) -> Self::Future {
            let raw_data = match req.headers().get("token") {
                Some(data) => data.to_str().expect("convert token to str"),
                None => {
                    return err(NanoServiceError {
                        status: NanoServiceErrorStatus::Unauthorized,
                        message: "token not in header under key 'token'".to_string(),
                    });
                }
            };
            let token = match HeaderToken::decode(raw_data) {
                Ok(token) => token,
                Err(_) => {
                    return err(NanoServiceError {
                        status: NanoServiceErrorStatus::Unauthorized,
                        message: "token not a valid string".to_string(),
                    });
                }
            };
            ok(token)
        }
    }
}

// Re-export the specific FromRequest implementations depending on the activated feature
#[cfg(feature = "actix")]
pub use actix_impl::ActixFromRequest;
