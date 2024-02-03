NODE_BIN_PATH=./node_modules/.bin
OUT_DIR=./src/stores/grpc

ifeq ($(GOHOSTOS), windows)
	#the `find.exe` is different from `find` in bash/shell.
	#to see https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/find.
	#changed to use git-bash.exe to run find cli or other cli friendly, caused of every developer has a Git.
	Git_Bash= $(subst cmd\,bin\bash.exe,$(dir $(shell where git)))
	API_PROTO_FILES=$(shell $(Git_Bash) -c 'find src/stores/grpc -path src/stores/grpc/third_party -prune -o -name "*.proto" | grep -v "^src/stores/grpc/third_party"')
else
	API_PROTO_FILES=$(shell find src/stores/grpc -path src/stores/grpc/third_party -prune -o -name "*.proto" | grep -v "^src/stores/grpc/third_party")
endif


.PHONY: grpc
grpc:
		$(NODE_BIN_PATH)/protoc \
		--proto_path=${OUT_DIR}  \
		--proto_path=${OUT_DIR}/third_party \
		--ts_out=${OUT_DIR} \
		$(API_PROTO_FILES)