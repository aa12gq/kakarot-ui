#!/bin/bash

NODE_BIN_PATH=./node_modules/.bin
OUT_DIR=./src/stores/grpc

# 默认搜索路径
SEARCH_PATH="src/stores/grpc"
# 如果提供了第一个参数，调整搜索路径
if [ ! -z "$1" ]; then
    SEARCH_PATH="${SEARCH_PATH}$1"
fi

# 查找文件的正则表达式
PROTO_PATH_PATTERN="$SEARCH_PATH/.*\.proto$"
if [ ! -z "$2" ]; then
    PROTO_PATH_PATTERN="$PROTO_PATH_PATTERN|$SEARCH_PATH/third_party/$2/.*\.proto$"
fi

# 查找.proto文件
API_PROTO_FILES=$(find $SEARCH_PATH -regex "$PROTO_PATH_PATTERN")

for proto in $API_PROTO_FILES; do
    echo "compling $proto..."
    $NODE_BIN_PATH/protoc \
    --proto_path=${OUT_DIR} \
    --proto_path=${OUT_DIR}/third_party \
    --ts_out=${OUT_DIR} \
    $proto
    if [ $? -eq 0 ]; then
        echo "ok."
    else
        echo "compling failed $proto"
    fi
done