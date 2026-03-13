#!/usr/bin/env bash

# navigate to directory
cd ../..
cd frontend
npm run wasm   #Make sure to create WASM package
npm install
npm run build
cd ../ingress
#cargo clean
export $(cat .env | xargs)
cargo run
