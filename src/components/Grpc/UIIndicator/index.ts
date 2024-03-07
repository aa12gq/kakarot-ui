import {NextUnaryFn, RpcInterceptor} from "@protobuf-ts/runtime-rpc/build/types/rpc-interceptor";
import {MethodInfo} from "@protobuf-ts/runtime-rpc/build/types/reflection-info";
import {RpcOptions} from "@protobuf-ts/runtime-rpc/build/types/rpc-options";
import {UnaryCall} from "@protobuf-ts/runtime-rpc/build/types/unary-call";
export {default as GrpcIndicatorAni} from "./IndicatorAni.vue";

let inCommunicating = 0;
let uiIndicator: HTMLElement | null;
export const resetIndicator = ()=>{
   inCommunicating = 0;
   if(uiIndicator){
       uiIndicator.style.display = 'none';
   }
}
export class UIIndicatorInterceptor implements RpcInterceptor {
    interceptUnary(next: NextUnaryFn, method: MethodInfo, input: object, options: RpcOptions): UnaryCall {
        let re = next(method, input, options);
        if (!options.disableUIIndicator) {
            uiIndicator = document.getElementById('vg-grpc-invoking-ani');
            if (++inCommunicating > 0 && uiIndicator) {
                uiIndicator.style.display = 'block';
            }
        }

        re.response.finally(() => {
            if (!options.disableUIIndicator) {
                if (--inCommunicating <= 0 && uiIndicator) {
                    uiIndicator.style.display = 'none';
                }
            }
        })
        return re;
    }
}