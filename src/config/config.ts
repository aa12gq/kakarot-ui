import type Config from "./types";

export const config: Config = {
  // 是否允许未登录使用(默认false).
  allowNoAuth: false,
  fs: {
    uploadApi: "http://127.0.0.1:3030/v1/upload",
    cdnBase: "http://127.0.0.1:3030",
    // downloadApi: "/",
    deleteApi: "/v1/delete",
  },
  auth: {
    // 自动更新JWT时间间隔(秒)
    jwt_auto_renew_interval: 51,
    jwt_header_key: "kakarot-x-authorization",
  },
  grpc: {
    defaultEndpoint: "default",
    defaultTimeout: 30,
    endpoints: [
      {
        // 根据实际系统部署进行配置，目前统一只配置"default"项即可.
        name: "default",
        url: "http://localhost:3131",
        timeout: 10,
      },
    ],
  },
};
