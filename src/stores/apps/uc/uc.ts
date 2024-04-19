import { GetClient } from '@/components/Grpc/grpc';
import { UCClient } from '@/stores/grpc/uc/v1/uc.client';
import {
  UpdatePasswordRequest,
  BasicUserInfoReply,
  BasicUserInfoReply_ExtInfo,
  UpdateAvatarReply,
  UpdateAvatarRequest,
  UpdateBasicUserInfoRequest,
  SearchUserReply,
  SearchUserRequest,
  UserInfoForSearch,
  MenusRequest,
  MenusReply,
} from '@/stores/grpc/uc/v1/uc';
import { get_fs_cdn_base } from '@/config';
import { MenuResource } from '@/stores/grpc/system/v1/auth';

export type ExtUserInfo = BasicUserInfoReply_ExtInfo;
export { UserInfoForSearch };
export const UpdatePassword = (newPassword: string, oldPassword: string, success?: () => void, fail?: (why: any) => void) => {
  GetClient(UCClient)
    .updatePassword(
      UpdatePasswordRequest.create({
        oldPassword: oldPassword,
        newPassword: newPassword,
      })
    )
    .then(success, fail);
};
export const BasicUserInfo = (success?: (userInfo: BasicUserInfoReply) => void, fail?: (why: any) => void) => {
  GetClient(UCClient)
    .basicUserInfo(UpdatePasswordRequest.create())
    .response.then(re => {
      if (success) {
        success(re);
      }
    }, fail);
};
export const UpdateAvatar = (fsoId: string, filePath: string, success?: (re: UpdateAvatarReply) => void, fail?: (why: any) => void) => {
  GetClient(UCClient)
    .updateAvatar(UpdateAvatarRequest.create({ fsoId: fsoId, filePath: filePath }))
    .response.then(success, fail);
};
export const UpdateBasicUserInfo = (data: UpdateBasicUserInfoRequest, success?: () => void, fail?: (why: any) => void) => {
  GetClient(UCClient).updateBasicUserInfo(UpdateBasicUserInfoRequest.create(data)).response.then(success, fail);
};
export const SearchUser = (name: string, success?: (u: SearchUserReply) => void, fail?: (why: any) => void) => {
  GetClient(UCClient)
    .searchUser(SearchUserRequest.create({ name: name, pageNum: 1, pageSize: 500 }))
    .response.then(su => {
      if (success) {
        su.userList.forEach(v => {
          v.avatarPath = get_fs_cdn_base() + v.avatarPath;
        });
        success(su);
      }
    }, fail);
};

export const UserMenus = (success: (m: MenuResource[]) => void, fail?: (why: any) => void): Promise<void> => {
  return GetClient(UCClient)
    .menus(MenusRequest.create())
    .response.then((re: MenusReply) => {
      success(re.menus as MenuResource[]);
    }, fail);
};
