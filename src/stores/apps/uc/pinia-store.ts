
// pinia store. 当前登录用户的用户中心数据.
import {User} from "@/stores/grpc/system/v1/system";
import {defineStore} from "pinia";
import {piniaSerializer} from "@/utils/json";
import {BasicUserInfo, ExtUserInfo} from "@/stores/apps/uc/uc";

export interface UcInfo {
    BasicInfo?: User;
    ExtInfo?: ExtUserInfo;
}

const ST_KEY = "uc_store";
const PERSIST_STORAGE = localStorage;
// 当前登录用户的用户中心数据
export const ucStore = defineStore(ST_KEY, {
    persist: {
        storage: PERSIST_STORAGE,
        key: ST_KEY,
        serializer: piniaSerializer,
    },
    state: ():UcInfo => {
        return {
            BasicInfo: undefined,
            ExtInfo: undefined
        };
    },
    actions: {
        setBasicInfo(info: User) {
            this.BasicInfo = info;
        },
        setExtInfo(extInfo: ExtUserInfo) {
            this.ExtInfo = extInfo;
        },
        clear() {
            this.$state = {};
            PERSIST_STORAGE.removeItem(ST_KEY);
        },
        // 从服务端同步到本地(必须在用户登录之后才能调用)
        syncRemote(): Promise<UcInfo> {
            return new Promise<UcInfo>((success, fail) => {
                BasicUserInfo((info) => {
                    if(info.basicInfo){
                        this.setBasicInfo(info.basicInfo);
                    } else {
                        fail({message:"未获取到用户基础信息", code: "unknown"});
                    }
                    if(info.extInfo){
                        this.setExtInfo(info.extInfo);
                    } else {
                        fail({message:"未获取到用户扩展信息", code: "unknown"});
                    }
                    success(this.$state)
                }, (why) => {
                    why.message = decodeURIComponent(why.message);
                    fail(why);
                });
            })

        }
    }
});