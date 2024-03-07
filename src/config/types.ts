export const default_jwt_header_key = 'kakarot-x-authorization';
interface Config {
  // 是否允许未登录使用web ui
  allowNoAuth?: boolean;
  // 认证相关
  auth: {
    // 自动更新token时间间隔, 单位: ms
    jwt_auto_renew_interval?: number;
    jwt_header_key?: string;
  };
  grpc: {
    defaultTimeout?: number;
    defaultEndpoint: string;
    endpoints: Array<GrpcEndpoint>;
  };
  // 文件相关服务接口
  fs?: {
    // 文件上传api. 如: "http://localhost:3030/v1/upload"
    uploadApi?: string;
    // 文件访问服务基础地址, 如: "http://localhost:3131",  当文件地址为 "/项目案例视频/黄山光伏/2022/开工典礼视频.mp4"， 则文件的url 为 http://localhost:3131/项目案例视频/黄山光伏/2022/开工典礼视频.mp4
    downloadApiBase?: string;
    // cdn base url, 如. "https://kakarot.com/kakarot"
    cdnBase?: string;
    // 删除文件api, 如: http://localhost/v1/delete
    deleteApi?: string;
  };
}

export interface GrpcEndpoint {
  name: string;
  url: string;
  // 包含连接和处理超时时间
  timeout?: number;
}

export default Config;
