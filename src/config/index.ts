import {default_jwt_header_key} from "@/config/types";
export {type GrpcEndpoint, default_jwt_header_key} from "./types"
import {config as _config} from "./config"
export const config = _config;
export const get_jwt_header_key = ():string => {
    if(config.auth.jwt_header_key){
        return config.auth.jwt_header_key;
    }
    return default_jwt_header_key;
}
export const get_fs_cdn_base = ():string=>{
    if(config.fs?.cdnBase){
        return config.fs.cdnBase;
    }
    throw Error("config中fs.cdnBase未配置");
}
export const cdn_url = (path: string) => get_fs_cdn_base() + path;