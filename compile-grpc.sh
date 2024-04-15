#!/bin/bash
NODE_BIN_PATH=./node_modules/.bin
OUT_DIR=./src/stores/grpc
API_PROTO_FILES=$(find src/stores/grpc/$1 -name "*.proto" | grep -v "^src/stores/grpc/third_party" | grep "$2")
for proto in $API_PROTO_FILES; do
    echo compiling $proto...
    $NODE_BIN_PATH/protoc \
        --proto_path=${OUT_DIR} \
        --proto_path=${OUT_DIR}/third_party \
        --ts_out=${OUT_DIR} \
        $proto
    if [ $? -eq 0 ]; then
        echo ok.
    fi
done