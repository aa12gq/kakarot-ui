#!/bin/bash

NODE_BIN_PATH=./node_modules/.bin
OUT_DIR=./src/stores/grpc

# 默认搜索路径
SEARCH_PATH="src/stores/grpc"
# 如果提供了第一个参数，调整搜索路径
if [ ! -z "$1" ]; then
    SEARCH_PATH="${SEARCH_PATH}/$1"
fi

# 查找文件的正则表达式
PROTO_PATH_PATTERN="$SEARCH_PATH/.*\.proto$"
if [ ! -z "$2" ]; then
    PROTO_PATH_PATTERN="${PROTO_PATH_PATTERN}|$SEARCH_PATH/third_party/$2/.*\.proto$"
fi

# 确保搜索目录存在
if [ ! -d "$SEARCH_PATH" ]; then
    echo "指定的目录不存在: $SEARCH_PATH"
    exit 1
fi

API_PROTO_FILES=$(find $SEARCH_PATH -regex "$PROTO_PATH_PATTERN")

if [ -z "$API_PROTO_FILES" ]; then
    echo "在$SEARCH_PATH下未找到任何.proto文件"
    exit 1
fi

for proto in $API_PROTO_FILES; do
    echo "正在编译 $proto..."
    $NODE_BIN_PATH/protoc \
    --proto_path=${OUT_DIR} \
    --proto_path=${OUT_DIR}/third_party \
    --ts_out=${OUT_DIR} \
    $proto
    if [ $? -eq 0 ]; then
        echo "$proto 编译成功。"
    else
        echo "编译失败 $proto"
        exit 1
    fi
done

echo "所有文件编译完成。"