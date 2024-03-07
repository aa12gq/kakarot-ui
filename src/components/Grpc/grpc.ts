import type {RpcTransport} from "@protobuf-ts/runtime-rpc";
import {GrpcWebFetchTransport} from '@protobuf-ts/grpcweb-transport';
import {UIIndicatorInterceptor} from "./UIIndicator";
import {config, type GrpcEndpoint} from "@/config"

interface IGrpcClient<T> {
    new(transport: RpcTransport): T;
}

const transports = new Map<string, GrpcWebFetchTransport>();
const DefaultGrpcTimeout = 10;
const DefaultEndpointName = "default";

export function GetClient<T>(iGrpcClient: IGrpcClient<T>, endpoint?: string) {
    return new iGrpcClient(GetTransport(endpoint));
}

function GetTransport(endpointName?: string): GrpcWebFetchTransport {
    if (endpointName === undefined) {
        if(config.grpc.defaultEndpoint !== undefined){
            endpointName = config.grpc.defaultEndpoint;
        } else {
            endpointName = DefaultEndpointName;
        }
    }
    let transport = transports.get(endpointName);
    if (transport) {
        return transport;
    }
    let endpoint:GrpcEndpoint|undefined;
    for (let i = 0; i < config.grpc.endpoints.length; i++) {
        if(config.grpc.endpoints[i].name == endpointName){
            endpoint = config.grpc.endpoints[i];
            break;
        }
    }
    if(!endpoint){
        throw new Error(`无法找到grpc配置endpoint "${endpointName}"`)
    }
    let grpcTimeout = DefaultGrpcTimeout;
    if(endpoint.timeout !== undefined){
        grpcTimeout = endpoint.timeout;
    } else if(config.grpc.defaultTimeout !== undefined){
        grpcTimeout = config.grpc.defaultTimeout;
    }
    transport = new GrpcWebFetchTransport({
        baseUrl: endpoint.url,
        format: "binary",
        interceptors: [new UIIndicatorInterceptor],
        timeout: grpcTimeout * 1000
    });
    transports.set(endpointName, transport);
    return transport;
}
