<!--系统角色-->
<script setup lang="ts">
import Button from '@/base-components/Button';
import { FormInput, FormLabel, FormSelect, FormInline, FormCheck } from '@/base-components/Form';
import { Role, type RoleListReply, BaseReply } from '@/stores/grpc/system/v1/system';
import * as sys from '@/stores/apps/system/system';
import { Alerts, type AlertMessage, SetAlertMessages } from '@/base-components/Alert';
import Table from '@/base-components/Table';
import { Popover } from '@/base-components/Headless';
import Lucide from '@/base-components/Lucide';
import { Menu, Tab, Dialog } from '@/base-components/Headless';
import Rule from '@/apps/system/Rule.vue';
import type { Icon } from '@/base-components/Lucide';
import Label from '@/base-components/Form/FormCheck/Label.vue';
import Tippy from '@/base-components/Tippy/Tippy.vue';
import { ref } from 'vue';
import _ from 'lodash';
import { User, UserListRequest, UserListReply } from '@/stores/grpc/system/v1/system';
import { QueryUserList } from '@/stores/apps/system/system';

const warningAlerts = ref<AlertMessage[]>([]);
const infoAlerts = ref<AlertMessage[]>([]);
const checkedRole = ref(Role.create());
const originCheckedRole = ref<Role>();
let formDialogIcon: Icon = 'PlusSquare';

const tableData = ref<sys.Role[]>();

function setCheckedRole(r: Role) {
  checkedRole.value = _.cloneDeep(r);
  originCheckedRole.value = r;
}

const ruleSelector = ref<typeof Rule>();

function resetCheckedRoleRules() {
  ruleSelector.value?.reset();
}

function ReListTable() {
  sys.QueryRoleList(
    (d: RoleListReply) => {
      // 重置后再延时，以触发刷新动画
      tableData.value = [];
      setTimeout(() => {
        tableData.value = d.data;
      }, 100);
      checkedRole.value = Role.create();
    },
    (why: any) => {
      SetAlertMessages(warningAlerts, [{ index: 0n, message: why.code + ': ' + why.message }]);
    }
  );
}

ReListTable();

const addModelPreview = ref(false);
const setAddModalPreview = (v: boolean, edit: boolean = false) => {
  if (!v) {
    resetAddValue();
  } else {
    if (edit) {
      if (checkedRole.value.id < 1) {
        SetAlertMessages(warningAlerts, [{ index: 0n, autoDismiss: 1500, message: '请选择要修改的角色' }]);
        return;
      }
      addValue.value = checkedRole.value?.name;
      formDialogIcon = 'Edit';
    } else {
      formDialogIcon = 'PlusSquare';
    }
  }

  addModelPreview.value = v;
};
const deleteModal = ref(false);
const setDeleteModal = (v: boolean) => {
  if (v) {
    if (checkedRole.value.id < 1) {
      SetAlertMessages(warningAlerts, [{ index: 0n, autoDismiss: 1500, message: '请选择要删除的角色' }]);
      return;
    }
  }
  deleteModal.value = v;
};

const addValue = ref('');
const resetAddValue = () => {
  addValue.value = '';
};
const addClick = () => {
  if (formDialogIcon == 'Edit') {
    editClick();
    return;
  }
  let req: Role = Role.create({ name: addValue.value });

  sys.AddRole(
    req,
    (d: BaseReply) => {
      setTimeout(() => {
        SetAlertMessages(infoAlerts, [{ index: 0n, message: '新增成功' }]);
        ReListTable();
      }, 100);
    },
    (why: any) => {
      SetAlertMessages(warningAlerts, [{ index: 0n, message: why.code + ': ' + why.message }]);
    }
  );
  resetAddValue();
};

const editClick = (updatePrivilegesOnly?: boolean) => {
  if (checkedRole.value.id < 1) {
    SetAlertMessages(warningAlerts, [{ index: 0n, autoDismiss: 1500, message: '请选择角色' }]);
    return;
  }
  let req = Role.create(checkedRole.value);
  if (!updatePrivilegesOnly) {
    req.name = addValue.value;
  }
  sys.UpdateRole(
    req,
    (d: BaseReply) => {
      setTimeout(() => {
        SetAlertMessages(infoAlerts, [{ index: 0n, message: '编辑成功' }]);
        ReListTable();
      }, 100);
    },
    (why: any) => {
      SetAlertMessages(warningAlerts, [{ index: 0n, message: why.code + ': ' + why.message }]);
    }
  );
};

const deleteClick = () => {
  if (checkedRole.value.id < 1) {
    SetAlertMessages(warningAlerts, [{ index: 0n, autoDismiss: 1500, message: '请选择角色' }]);
    return;
  }
  sys.DeleteRole(
    checkedRole.value.id,
    (d: BaseReply) => {
      SetAlertMessages(infoAlerts, [{ index: 0n, message: '删除成功' }]);
      ReListTable();
    },
    (why: any) => {
      SetAlertMessages(warningAlerts, [{ index: 0n, message: why.code + ': ' + why.message }]);
    }
  );
  setDeleteModal(false);
};

const roleModelPreview = ref(false);

const setRoleModalPreview = (v: boolean) => {
  if (originCheckedRole.value) {
    // 以防checkedRole 与modal treeselect绑定后不能还原, 再次设置一次.
    setCheckedRole(originCheckedRole.value);
  }
  if (checkedRole.value.id < 1) {
    SetAlertMessages(warningAlerts, [{ index: 0n, autoDismiss: 1500, message: '请选择角色.' }]);
    return;
  }
  roleModelPreview.value = v;
};

let users: User[] = [];

function ListUsers() {
  let req = UserListRequest.create({ page: 1, pageSize: 1000 });
  QueryUserList(
    req,
    (d: UserListReply) => {
      users = d.data;
    },
    (why: any) => {
      SetAlertMessages(warningAlerts, [{ index: 0n, message: `获取用户失败, ${why.message}` }]);
    }
  );
}

ListUsers();

function GetUserName(id: bigint[]) {
  let name: string[] = [];
  users.forEach((item: any) => {
    if (id.indexOf(item?.id) != -1) {
      name.push(item?.fullName);
    }
  });
  return name;
}
</script>

<template>
  <div class="relative intro-y">
    <h2 class="mt-2 text-lg font-medium">系统角色管理</h2>
    <Alerts
      variant="primary"
      icon="AlertCircle"
      :with-close-icon="true"
      :auto-dismiss="6000"
      :messages="infoAlerts"
      class="absolute z-[61] bg-primary/50 border-none top-[10vh] w-[60vw] flex mx-4 mt-3 items-center mb-0"
    />
    <Alerts
      variant="warning"
      icon="AlertTriangle"
      :with-close-icon="true"
      :messages="warningAlerts"
      class="absolute z-[61] bg-warning/90 border-none top-[10vh] w-[60vw] flex mx-4 mt-3 items-center mb-0"
    />
    <div class="box">
      <div class="flex-row-reverse ml-2 mt-3">
        <Button variant="primary" class="inline w-24 mb-2 mr-3 mt-3 py-1" @click="setAddModalPreview(true)">新增</Button>
        <Button variant="primary" class="inline w-24 mb-2 mr-3 py-1" :disabled="checkedRole.id < 1" @click="setAddModalPreview(true, true)">编辑</Button>
        <Button variant="danger" class="inline w-24 mb-2 mr-3 py-1" :disabled="checkedRole.id < 1" @click="setDeleteModal(true)">删除</Button>
        <Button variant="primary" class="inline w-24 mb-2 mr-3 py-1" :disabled="checkedRole.id < 1" @click="setRoleModalPreview(true)">权限设置</Button>
      </div>
      <div class="overflow-x-auto w-full box mt-3">
        <Table class="table">
          <!-- head -->
          <Table.Thead>
            <Table.Tr>
              <Table.Th class="w-5 px-1 text-center">选择</Table.Th>
              <Table.Th class="w-5">ID</Table.Th>
              <Table.Th>角色名称</Table.Th>
              <Table.Th class="text-center">
                是否超管
                <Tippy content="角色是否包含超级管理员权限." :options="{ maxWidth: '8rem' }">
                  <Lucide icon="HelpCircle2" stroke="none" class="inline-block w-4 cursor-pointer" />
                </Tippy>
              </Table.Th>
              <Table.Th class="text-center">成员数量</Table.Th>
              <Table.Th class="text-center">成员</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <!-- body -->
          <Table.Tbody>
            <Table.Tr class="intro-x" v-for="data in tableData" :key="data.id.toString()">
              <Table.Td class="td-center">
                <label>
                  <input
                    type="radio"
                    class=""
                    name="cb-role-id"
                    @click="
                      () => {
                        setCheckedRole(data);
                      }
                    "
                    :value="data"
                  />
                </label>
              </Table.Td>
              <Table.Td>{{ data.id }}</Table.Td>
              <Table.Td>{{ data.name }}</Table.Td>
              <Table.Td class="text-center">
                <Lucide class="inline-block w-4" v-if="data.rules.indexOf(0n) >= 0" icon="MarkYes1" stroke="none" />
              </Table.Td>
              <Table.Td class="text-center">{{ data.number }}</Table.Td>
              <Table.Td class="text-center">
                <Popover class="inline-block">
                  <Popover.Button
                    as="div"
                    class="rounded-full shadow-sm w-10 h-10 dark:bg-darkmode-400 dark:hover:bg-darkmode-300 bg-slate-200 hover:shadow-md hover:bg-slate-200/60 flex items-center justify-center"
                  >
                    <Lucide class="w-5 h-5 cursor-pointer" icon="Members1" />
                  </Popover.Button>
                  <Popover.Panel placement="left-start" class="overflow-auto min-w-[12rem] max-w-[60vw] max-h-[70vh] bg-slate-200 shadow-md mb-5 dark:bg-darkmode-500">
                    <div class="flex gap-2 p-3">
                      <span v-if="data.userIds.length > 0" class="p-2 py-1 text-slate-500 bg-slate-300 dark:bg-darkmode-700 text-primary rounded shadow-sm" v-for="v in GetUserName(data.userIds)">
                        {{ v }}
                      </span>
                      <span v-else class="text-slate-500">暂无人员</span>
                    </div>
                  </Popover.Panel>
                </Popover>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </div>
    </div>
  </div>

  <Dialog
    :open="addModelPreview"
    @close="
      () => {
        setAddModalPreview(false);
      }
    "
  >
    <Dialog.Panel>
      <Dialog.Title>
        <h2 class="flex mr-auto text-base font-medium">
          <Lucide :icon="formDialogIcon" class="w-6 h-6 mr-1" />
          角色
        </h2>
      </Dialog.Title>
      <Dialog.Description class="">
        <FormInline class="flex-1">
          <FormLabel htmlFor="horizontal-form-1">角色名称</FormLabel>
          <FormInput id="1" class="w-3/4" type="text" v-model="addValue" />
        </FormInline>
      </Dialog.Description>
      <Dialog.Footer>
        <Button
          variant="primary"
          type="button"
          class="w-20"
          @click="
            () => {
              addClick();
              setAddModalPreview(false);
            }
          "
        >
          确认
        </Button>
        <Button
          variant="secondary"
          type="button"
          class="w-20 ml-4"
          @click="
            () => {
              setAddModalPreview(false);
            }
          "
        >
          取消
        </Button>
      </Dialog.Footer>
    </Dialog.Panel>
  </Dialog>

  <Dialog
    :open="deleteModal"
    @close="
      () => {
        setDeleteModal(false);
      }
    "
  >
    <Dialog.Panel>
      <div class="p-5 text-center">
        <Lucide icon="AlertCircle" class="w-16 h-16 mx-auto mt-3 text-danger" />
        <div class="mt-5 text-2xl">确定删除?</div>
        <div class="mt-2 text-slate-500">此操作不可恢复!</div>
      </div>
      <div class="px-5 pb-8 text-center">
        <Button
          variant="outline-secondary"
          type="button"
          @click="
            () => {
              setDeleteModal(false);
            }
          "
          class="w-24 mr-1"
        >
          取消
        </Button>
        <Button variant="danger" type="button" class="w-24" @click="deleteClick()">确定</Button>
      </div>
    </Dialog.Panel>
  </Dialog>

  <Dialog
    :open="roleModelPreview"
    @close="
      () => {
        setRoleModalPreview(false);
      }
    "
  >
    <Dialog.Panel>
      <Dialog.Title>
        <h2 class="flex mr-auto text-base font-medium">
          <Lucide icon="Edit" class="w-6 h-6 mr-1" />
          权限设置
        </h2>
      </Dialog.Title>
      <Dialog.Description class="h-[50vh] overflow-y-auto">
        <Rule ref="ruleSelector" v-model="checkedRole.rules" />
      </Dialog.Description>
      <Dialog.Footer>
        <Button
          variant="primary"
          type="button"
          class="w-20"
          @click="
            () => {
              editClick(true);
              setRoleModalPreview(false);
            }
          "
        >
          确认
        </Button>
        <Button
          variant="secondary"
          type="button"
          class="w-20 ml-4"
          @click="
            () => {
              setRoleModalPreview(false);
            }
          "
        >
          取消
        </Button>
        <Button
          variant="warning"
          type="button"
          class="w-20 ml-4"
          @click="
            () => {
              resetCheckedRoleRules();
            }
          "
        >
          还原
        </Button>
      </Dialog.Footer>
    </Dialog.Panel>
  </Dialog>
</template>
