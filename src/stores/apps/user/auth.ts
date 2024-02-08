import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport";
import { GetClient } from "@/components/Grpc/grpc";
import * as pb from "@/stores/grpc/user/auth";
import { AuthClient } from "@/stores/grpc/user/auth.client";

export function Login(
  success: (value: pb.LoginReply) => void,
  fail?: (why: any) => void
) {
  const c = GetClient(AuthClient).login(
    pb.LoginRequest.create({ account: "13017173106", password: "123456" })
  );
  c.response.then((re: pb.LoginReply) => {
    success(re);
  }, fail);
}
