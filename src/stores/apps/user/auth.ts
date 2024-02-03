import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport";
import { AuthClient } from "../../grpc/user/auth.client";
import * as pb from "../../grpc/user/auth";
let transport: GrpcWebFetchTransport;
function GetTransport(): GrpcWebFetchTransport {
  if (transport != undefined) {
    return transport;
  }
  transport = new GrpcWebFetchTransport({
    baseUrl: "http://localhost:3131",
    format: "binary",
  });
  return transport;
}
let client: AuthClient;
function GetClient(): AuthClient {
  if (client != undefined) {
    return client;
  }
  client = new AuthClient(GetTransport());
  return client;
}

export function Login(
  success: (value: pb.LoginReply[]) => void,
  fail?: (why: any) => void
) {
  const c = GetClient().login(
    pb.LoginRequest.create({ account: "123456", password: "123456" })
  );
  c.response.then((re: pb.LoginReply) => {
    success(re);
  }, fail);
}
