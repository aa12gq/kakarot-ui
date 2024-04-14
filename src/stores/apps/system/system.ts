import { GetClient } from '@/components/Grpc/grpc';
import { SystemClient } from '@/stores/grpc/system/v1/system.client';
import {
  RoleToUserRequest,
  RoleRequest,
  RoleIdRequest,
  UserRequest,
  UserIdRequest,
  UserListRequest,
  Role,
  User,
  BaseReply,
  RoleReply,
  RoleListReply,
  UserReply,
  UserListReply,
  ResetUserPasswordRequest,
} from '@/stores/grpc/system/v1/system';
import codes from '@/utils/errocodes';
export { Role };

function AddRoleToUser(roleIds: bigint[], userIds: bigint[], hrUserIds: bigint[], success: (value: BaseReply) => void, fail?: (why: any) => void): Promise<void> {
  let c = GetClient(SystemClient).addRoleToUser(
    RoleToUserRequest.create({
      roleIds: roleIds,
      userIds: userIds,
    })
  );
  return c.response.then(re => {
    success(re);
  }, fail);
}

function AddRole(req: Role, success: (value: BaseReply) => void, fail?: (why: any) => void): Promise<void> {
  let c = GetClient(SystemClient).addRole(RoleRequest.create({ data: req }));
  return c.response.then(re => {
    success(re);
  }, fail);
}

function UpdateRole(req: Role, success: (value: BaseReply) => void, fail?: (why: any) => void): Promise<void> {
  let c = GetClient(SystemClient).updateRole(RoleRequest.create({ data: req }));
  return c.response.then(re => {
    success(re);
  }, fail);
}

function DeleteRole(id: bigint, success: (value: BaseReply) => void, fail?: (why: any) => void): Promise<void> {
  let c = GetClient(SystemClient).deleteRole(RoleIdRequest.create({ id: id }));
  return c.response.then(re => {
    success(re);
  }, fail);
}

function QueryRoleList(success: (value: RoleListReply) => void, fail?: (why: any) => void): Promise<void> {
  let c = GetClient(SystemClient).queryRoleList(RoleIdRequest.create({}));
  return c.response.then(re => {
    success(re);
  }, fail);
}

function AddUser(req: User, success: (value: BaseReply) => void, fail?: (why: any) => void): Promise<void> {
  let c = GetClient(SystemClient).addUser(UserRequest.create({ data: req }));
  return c.response.then(re => {
    success(re);
  }, fail);
}

function UpdateUser(req: User, success: (value: BaseReply) => void, fail?: (why: any) => void): Promise<void> {
  let c = GetClient(SystemClient).updateUser(UserRequest.create({ data: req }));
  return c.response.then(re => {
    success(re);
  }, fail);
}

function DeleteUser(id: bigint, success: (value: BaseReply) => void, fail?: (why: any) => void): Promise<void> {
  let c = GetClient(SystemClient).deleteUser(UserIdRequest.create({ id: id }));
  return c.response.then(re => {
    success(re);
  }, fail);
}

function QueryUserList(req: UserListRequest, success: (value: UserListReply) => void, fail?: (why: any) => void): Promise<void> {
  let c = GetClient(SystemClient).listUser(req);
  return c.response.then(re => {
    success(re);
  }, fail);
}

export const ResetUserPassword = (phone: string, code: string, success?: () => void, fail?: (why: any) => void) => {
  GetClient(SystemClient)
    .resetUserPassword(
      ResetUserPasswordRequest.create({
        phone: phone,
        code: code,
      })
    )
    .then(success, fail);
};

export interface userListReq {
  page: number;
  pageSize: number;
  username: string;
}

export { AddRoleToUser, AddRole, UpdateRole, DeleteRole, QueryRoleList, AddUser, UpdateUser, DeleteUser, QueryUserList };
