import { GetTransport } from "@/base-components/Grpc/grpc";
import type { RpcTransport } from "@protobuf-ts/runtime-rpc";

interface IGrpcClient<T> {
  new (transport: RpcTransport): T;
}

export function GetClient<T>(iGrpcClient: IGrpcClient<T>) {
  const client = new iGrpcClient(GetTransport());
  return client;
}
