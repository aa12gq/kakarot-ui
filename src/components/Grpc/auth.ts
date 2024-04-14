import type {NextUnaryFn, RpcInterceptor} from "@protobuf-ts/runtime-rpc/build/types/rpc-interceptor";
import type {MethodInfo} from "@protobuf-ts/runtime-rpc/build/types/reflection-info";
import type {RpcOptions} from "@protobuf-ts/runtime-rpc/build/types/rpc-options";
import type {UnaryCall} from "@protobuf-ts/runtime-rpc/build/types/unary-call";
import {authStore} from "@/stores/components/auth";
import {get_jwt_header_key} from "@/config";

export class AuthInterceptor implements RpcInterceptor {
    interceptUnary(next: NextUnaryFn, method: MethodInfo, input: object, options: RpcOptions): UnaryCall {
        if (!options.meta) {
            options.meta = {};
        }else {
           delete options.meta[get_jwt_header_key()];
        }
        if (authStore().jwt) {
            options.meta[get_jwt_header_key()] = authStore().jwt as string;
        }
        return next(method, input, options);
    }
}