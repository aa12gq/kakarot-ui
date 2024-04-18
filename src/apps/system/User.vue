<!--系统用户账号-->
<script setup lang="ts">
import _, { forEach } from 'lodash';
import { ref, reactive, computed } from 'vue';
import Button from '@/base-components/Button';
import { FormInput, FormLabel, FormSelect, FormInline, FormCheck, FormSwitch } from '@/base-components/Form';
import { useRouter } from 'vue-router';
import { GetClient } from '@/components/Grpc/grpc';
import type { BaseReply, UserListReply } from '@/stores/grpc/system/v1/system';
import { Alerts, type AlertMessage, SetAlertMessages } from '@/base-components/Alert';
import * as sys from '@/stores/apps/system/system';
import Table from '@/base-components/Table';
import Lucide from '@/base-components/Lucide';
import Pagination from '@/base-components/Pagination';
import { Menu, Tab, Dialog } from '@/base-components/Headless';
import Rule from '@/apps/system/Rule.vue';
import PagingDevice from '@/components/PagingDevice/PagingDevice.vue';
import { BaseOption } from '@/components/PagingDevice';
import { UserListRequest, User } from '@/stores/grpc/system/v1/system';
import TomSelect from '@/components/TomSelect';

const searchTypeValue = ['用户名或姓名', '用户名', '联系电话'];

let data = [
  { value: '全部', options: 0 },
  { value: 'todo', options: 1 },
];
const data1 = ref('0');
const ids = ref<any[]>([]);
const idAll = ref<any[]>([]);
const checkAll = (e: any) => {
  if (e.target.checked) {
    ids.value = idAll.value;
  } else {
    ids.value = [];
  }
};

const warningAlerts = ref<AlertMessage[]>([]);
const infoAlerts = ref<AlertMessage[]>([]);

const inputUser = ref('');
const searchType = ref(0);
const pageSize = ref(10);
const page = ref(1);
const pageMax = computed(() => {
  return Number(table_user.value.total) / pageSize.value > 1 ? Math.ceil(Number(table_user.value.total) / pageSize.value) : 1;
});

// table data start//
interface reply extends UserListReply {
  data: any[];
  total: number;
}

let table_user = ref<reply>({
  data: [],
  total: 0,
});

const showUser = ref<any[]>([]);

function ReListTableUser() {
  let req = UserListRequest.create({
    username: inputUser.value,
    pageSize: pageSize.value,
    page: page.value,
    phone: searchType.value === 2 ? inputUser.value : '',
  });
  sys.QueryUserList(
    req,
    (d: UserListReply) => {
      // 重置后再延时，以触发刷新动画
      table_user.value.data = [];
      showUser.value = [];
      ids.value = [];

      setTimeout(() => {
        table_user.value.data = d.data;
        table_user.value.total = d.total;
        showUser.value =
          table_user.value.data?.slice(pageSize.value * (page.value - 1), pageSize.value * page.value)?.length != 0
            ? table_user.value.data?.slice(pageSize.value * (page.value - 1), pageSize.value * page.value)
            : table_user.value.data;

        idAll.value = [];
        for (let i = 0; i < d.data.length; i++) {
          idAll.value.push(d.data[i]);
        }
      }, 100);
    },
    (why: any) => {
      SetAlertMessages(warningAlerts, [{ index: 0n, message: why.code + ': ' + why.message }]);
    }
  );
}
ReListTableUser();

function SaveUser() {
  sys.UpdateUser(
    editPanel.value,
    (d: BaseReply) => {
      SetAlertMessages(infoAlerts, [{ index: 0n, message: '修改成功' }]);
      ReListTableUser();
    },
    (why: any) => {
      SetAlertMessages(warningAlerts, [{ index: 0n, message: why.code + ': ' + why.message }]);
    }
  );
}

// table data end//

// table tools start//
const getActive = (index: number) => {
  return page.value == index;
};

const getShow = (index: number) => {
  return page.value == index + 1 || page.value == index - 1 || page.value == index;
};

const changePage = (size: number, index: number) => {
  if (index < 1 || index > pageMax.value) {
    return;
  }
  page.value = index;
  ReListTableUser();
};

const changePageSize = (size: number, index: number) => {
  pageSize.value = size;
  showUser.value =
    table_user.value.data?.slice(pageSize.value * (page.value - 1), pageSize.value * page.value)?.length != 0
      ? table_user.value.data?.slice(pageSize.value * (page.value - 1), pageSize.value * page.value)
      : [];
  if (pageSize.value > table_user.value.data?.length) {
    ReListTableUser();
  }
};
// table tools end//

// button function start//
const handleClick = () => {};

const openClick = (open: boolean = true) => {
  if (ids.value.length == 0) {
    SetAlertMessages(warningAlerts, [{ index: 0n, message: '请选择要操作的用户' }]);
    return;
  }

  if (open) {
    //todo 禁用
    for (let i = 0; i < ids.value.length; i++) {
      // sys.UnFreezeUser(ids.value[i]?.id, (d: any) => {
      //     SetAlertMessages(infoAlerts, [{ index: 0n, message: "操作成功" }])
      //     ReListTableUser()
      // }, (why: any) => {
      //     SetAlertMessages(warningAlerts, [{ index: 0n, message: why.code + ": " + why.message }])
      // })
    }
  } else {
    for (let i = 0; i < ids.value.length; i++) {
      // sys.FreezeUser(ids.value[i]?.id, (d: any) => {
      //     SetAlertMessages(infoAlerts, [{ index: 0n, message: "操作成功" }])
      //     ReListTableUser()
      // }, (why: any) => {
      //     SetAlertMessages(warningAlerts, [{ index: 0n, message: why.code + ": " + why.message }])
      // })
    }
  }
};

const editModalPreview = ref(false);
const editPanel = ref<User>(User.create());

const seteditModalPreview = (v: boolean) => {
  if (ids.value.length != 1) {
    SetAlertMessages(warningAlerts, [{ index: 0n, message: '请选择一条数据' }]);
    return;
  }
  if (v) {
    editPanel.value = ids.value[0];
  } else {
    //editPanel.value = null;
  }
  editModalPreview.value = v;
};

const roleModalPreview = ref(false);
const rolePanel = ref<any[]>([]);
const roles = ref<any[]>([]);

const setroleModalPreview = (v: boolean) => {
  if (ids.value.length != 1) {
    SetAlertMessages(warningAlerts, [{ index: 0n, message: '请选择一条数据' }]);
    return;
  }
  roleModalPreview.value = v;
  rolePanel.value = [];

  for (let i = 0; i < roles.value.length; i++) {
    if (ids.value[0].roles?.indexOf(roles.value[i].id) != -1) {
      getTheSelectedOne(roles.value[i]);
    }
  }
};

const getTheSelectedOne = (data: any, del: boolean = false) => {
  rolePanel.value?.forEach((item: any) => {
    if (item.id == data.id) {
      rolePanel.value?.splice(rolePanel.value?.indexOf(item), 1);
      del = true;
    }
  });
  if (del) {
    return;
  }
  rolePanel.value?.push(data);
};

const setroles = () => {
  sys.QueryRoleList(
    (d: any) => {
      roles.value = d.data;
    },
    (why: any) => {
      SetAlertMessages(warningAlerts, [{ index: 0n, message: why.code + ': ' + why.message }]);
    }
  );
};
setroles();

function SaveRole() {
  let rids = [];
  let uids = [];
  for (let i = 0; i < rolePanel.value.length; i++) {
    rids.push(rolePanel.value[i].id);
  }
  uids.push(ids.value[0].id);
  sys.AddRoleToUser(
    rids,
    uids,
    [],
    (d: BaseReply) => {
      SetAlertMessages(infoAlerts, [{ index: 0n, message: '修改成功' }]);
      ReListTableUser();
    },
    (why: any) => {
      SetAlertMessages(warningAlerts, [{ index: 0n, message: why.code + ': ' + why.message }]);
    }
  );
  getTheSelectedOne('', true);
}

function getRoleName(ids: bigint[]) {
  let ret: any[] = [];
  ids.forEach(id => {
    roles.value.forEach(role => {
      if (role.id == id) {
        ret.push(role.name);
      }
    });
  });
  return ret;
}

const buttonClickCss = computed(() => {
  return;
});
// button function end//

const dsize = ref<any>('lg');
</script>

<template>
  <div>
    <h2 class="mt-2 text-lg font-medium">系统用户管理</h2>
    <Alerts variant="primary" icon="AlertCircle" :with-close-icon="true" :auto-dismiss="6000" :messages="infoAlerts" class="flex mx-4 mt-3 items-center mb-0" />
    <Alerts variant="warning" icon="AlertTriangle" :with-close-icon="true" :messages="warningAlerts" class="flex mx-4 mt-3 items-center mb-0" />
    <div class="mt-3 box">
      <div class="pt-2">
        <FormLabel htmlFor="test1" class="inline w-60 mr-2 ml-2">用户类型</FormLabel>
        <FormSelect id="test1" class="inline w-40" v-model="data1">
          <option v-for="(faker, fakerKey) in _.take(data, data.length)" :key="fakerKey" :value="faker.options">
            {{ faker.value }}
          </option>
        </FormSelect>
        <FormInput v-model="inputUser" class="inline w-80 mx-4" type="text" :placeholder="`请输入${searchTypeValue[searchType]}`" />
        <Button variant="primary" class="inline w-24 mb-2 mr-1" @click="ReListTableUser()">搜索</Button>
      </div>
      <div>
        <div class="flex-row-reverse ml-2 mt-3">
          <Button variant="primary" class="w-24 mb-2 mr-3 py-1">
            <Lucide icon="PlusSquare" class="w-4 h-4 mr-1" />
            添加
          </Button>
          <Button variant="secondary" class="w-24 mb-2 mr-3 py-1" @click="seteditModalPreview(true)" :disabled="ids.length != 1">
            <Lucide icon="Edit" class="w-4 h-4 mr-1" />
            修改
          </Button>
          <Button variant="primary" class="w-24 mb-2 mr-3 py-1 min-w-fit" @click="setroleModalPreview(true)" :disabled="ids.length != 1">
            <div class="h-4"></div>
            设置角色
          </Button>
        </div>
      </div>
    </div>

    <Dialog
      :open="editModalPreview"
      @close="
        () => {
          seteditModalPreview(false);
        }
      "
      :size="dsize"
    >
      <Dialog.Panel>
        <Dialog.Title>
          <h2 class="flex mr-auto text-base font-medium">
            <Lucide icon="Edit" class="w-6 h-6 mr-1" />
            用户信息
          </h2>
        </Dialog.Title>
        <Dialog.Description class="grid gap-4 gap-y-3">
          <FormInline class="flex-1">
            <FormLabel htmlFor="horizontal-form-1">用户名:&nbsp;&nbsp;&nbsp;</FormLabel>
            {{ editPanel.username }}
          </FormInline>
          <FormInline class="flex-1">
            <FormLabel htmlFor="horizontal-form-1">姓名:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</FormLabel>
            <FormInput id="1" class="w-3/4" type="text" v-model="editPanel.fullName" />
          </FormInline>
          <FormInline class="flex-1">
            <FormLabel htmlFor="horizontal-form-1">手机号码:</FormLabel>
            <FormInput id="1" class="w-3/4" type="text" v-model="editPanel.phone" />
          </FormInline>
          <FormInline class="flex-1">
            <FormLabel htmlFor="horizontal-form-1">电子邮箱:</FormLabel>
            <FormInput id="1" class="w-3/4" type="text" v-model="editPanel.email" />
          </FormInline>
          <FormInline class="flex-1">
            <FormLabel htmlFor="horizontal-form-1">用户密码:</FormLabel>
            <FormCheck class="mr-2 ml-4">
              <FormCheck.Input id="radio-switch-4" type="radio" name="horizontal_radio_button" />
              <FormCheck.Label htmlFor="radio-switch-4">当前密码</FormCheck.Label>
            </FormCheck>
            <FormCheck class="mt-2 mr-2 sm:mt-0">
              <FormCheck.Input id="radio-switch-5" type="radio" name="horizontal_radio_button" value="123456" />
              <FormCheck.Label htmlFor="radio-switch-5">初始密码</FormCheck.Label>
            </FormCheck>
          </FormInline>
        </Dialog.Description>
        <Dialog.Footer>
          <Button
            variant="primary"
            type="button"
            class="w-20"
            @click="
              () => {
                SaveUser();
                seteditModalPreview(false);
              }
            "
          >
            确认
          </Button>
          <Button
            variant="primary"
            type="button"
            class="w-20 ml-4"
            @click="
              () => {
                seteditModalPreview(false);
              }
            "
          >
            取消
          </Button>
        </Dialog.Footer>
      </Dialog.Panel>
    </Dialog>

    <Dialog
      :open="roleModalPreview"
      @close="
        () => {
          setroleModalPreview(false);
        }
      "
      :size="dsize"
    >
      <Dialog.Panel>
        <Dialog.Title>
          <h2 class="mr-auto text-base font-medium">角色选择</h2>
        </Dialog.Title>
        <Dialog.Description>
          <div class="box grid grid-cols-5 gap-4 gap-y-3">
            <Button v-for="data in _.take(rolePanel, rolePanel?.length)" @click="getTheSelectedOne(data, true)" class="whitespace-nowrap min-w-fit">
              {{ data.name }}
              <div class="ml-1"><Lucide class="w-3 h-3 font-bold text-[#DC143C]" icon="XCircle" /></div>
            </Button>
          </div>
          <div class="mt-3 grid grid-cols-5 gap-4 gap-y-3">
            <div v-for="(data, index) in _.take(roles, roles.length)" :key="index">
              <Button @click="getTheSelectedOne(data)" :class="buttonClickCss">
                {{ data.name }}
              </Button>
            </div>
          </div>
        </Dialog.Description>
        <Dialog.Footer>
          <Button
            variant="primary"
            type="button"
            class="w-20"
            @click="
              () => {
                SaveRole();
                setroleModalPreview(false);
              }
            "
          >
            确认
          </Button>
          <Button
            variant="primary"
            type="button"
            class="w-20 ml-4"
            @click="
              () => {
                setroleModalPreview(false);
                getTheSelectedOne('', true);
              }
            "
          >
            取消
          </Button>
        </Dialog.Footer>
      </Dialog.Panel>
    </Dialog>

    <div class="overflow-x-auto w-full box mt-2">
      <Table class="table w-full">
        <!-- head -->
        <Table.Thead>
          <Table.Tr>
            <Table.Th>
              <label>
                <FormCheck.Input
                  class="form-check checked:border-primary checkbox bg-white box-border w-[14px] h-[14px]"
                  type="checkbox"
                  @click="
                    (e: Event) => {
                      checkAll(e);
                    }
                  "
                />
              </label>
            </Table.Th>
            <Table.Th>ID</Table.Th>
            <Table.Th>用户名</Table.Th>
            <Table.Th>昵称</Table.Th>
            <Table.Th>联系电话</Table.Th>
            <Table.Th>电子邮箱</Table.Th>
            <Table.Th>账号状态</Table.Th>
            <Table.Th>用户角色</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <!-- body -->
        <Table.Tbody>
          <Table.Tr v-for="(data, index) in showUser" :key="data.data?.id">
            <Table.Td>
              <label>
                <FormCheck.Input class="form-check checked:border-primary checkbox bg-white box-border w-[14px] h-[14px]" type="checkbox" v-model="ids" :value="data" />
              </label>
            </Table.Td>
            <Table.Td>{{ data.id }}</Table.Td>
            <Table.Td>{{ data.username }}</Table.Td>
            <Table.Td>{{ data.fullName }}</Table.Td>
            <Table.Td>{{ data.phone }}</Table.Td>
            <Table.Td>{{ data.email }}</Table.Td>
            <Table.Td>
              <FormSwitch
                class="switch relative flex text-[0.5rem]"
                v-model="data.status"
                @click="
                  (event:any) => {
                    event.preventDefault();
                  }
                "
              >
                <span v-if="data.status != 0" class="switch-label !text-[0.6rem] whitespace-no-wrap font-bold dark:text-gray-500 ml-5 z-10 !text-gray-500 cursor-pointer"></span>
                <span v-else class="switch-label !text-[0.6rem] whitespace-no-wrap font-bold dark:text-gray-200 !text-gray-200 z-10 cursor-pointer"></span>
                <FormSwitch.Input
                  type="checkbox"
                  :checked="!(data.status as any)"
                  class="w-[64px] h-[24px] before:checked:ml-[39px] before:checked:bg-white checked:bg-red-500"
                  :class="!data.status ? 'opacity-75' : ''"
                ></FormSwitch.Input>
              </FormSwitch>
            </Table.Td>
            <Table.Td>{{ getRoleName(data.roles) }}</Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </div>
    <PagingDevice :total="table_user?.total" @handleChangePageSize="changePageSize" @handleChangePage="changePage" ref="pagingRef" :options="BaseOption" />
  </div>
</template>
