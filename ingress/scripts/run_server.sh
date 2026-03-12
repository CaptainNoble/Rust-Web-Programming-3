#!/usr/bin/env bash
# navigate to directory


# SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"
# cd $SCRIPTPATH

# cd ../..
# cd frontend
# npm install
# npm run build
# cd ../ingress
# cargo clean
# export $(cat .env | xargs)
# cargo run



# navigate to directory
cd ../..
cd frontend
npm install
npm run build
cd ../ingress
#cargo clean
export $(cat .env | xargs)
cargo run
