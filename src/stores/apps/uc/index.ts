import {get_fs_cdn_base} from "@/config";
import fakeData from "@/stores/fake-data";
import {ucStore} from "@/stores/apps/uc/pinia-store";
import { computed } from "vue";
export {SearchUser, UserInfoForSearch} from "./uc";
export {ucStore};
export const userAvatar = computed((): string => {
    if(ucStore().ExtInfo && ucStore().ExtInfo!.avatarPath){
        return get_fs_cdn_base() + ucStore().ExtInfo!.avatarPath;
    }
    return fakeData[0].users[0].avatar;
})