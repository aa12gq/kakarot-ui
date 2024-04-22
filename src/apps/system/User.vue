<!--系统用户账号-->
<script setup lang="ts">
import _, { forEach } from 'lodash';
import { ref, reactive, computed } from 'vue';
import Button from '@/base-components/Button';
import { FormInput, FormLabel, FormSelect, FormInline, FormCheck, FormSwitch } from '@/base-components/Form';
import { useRouter } from 'vue-router';
import { GetClient } from '@/components/Grpc/grpc';
import type { BaseReply, UserListReply, UserIdRequest, UserReply } from '@/stores/grpc/system/v1/system';
import { Alerts, type AlertMessage, SetAlertMessages } from '@/base-components/Alert';
import * as sys from '@/stores/apps/system/system';
import Table from '@/base-components/Table';
import Lucide, { Icon } from '@/base-components/Lucide';
import Pagination from '@/base-components/Pagination';
import { Menu, Tab, Dialog } from '@/base-components/Headless';
import Rule from '@/apps/system/Rule.vue';
import PagingDevice from '@/components/PagingDevice/PagingDevice.vue';
import { BaseOption } from '@/components/PagingDevice';
import { UserListRequest, User } from '@/stores/grpc/system/v1/system';
import { yup } from '@/base-components/I18n-validators';

const searchTypeValue = ['用户名或姓名', '用户名', '联系电话'];
// 操作类型 1:添加 0:修改
const controlType = ref(0);

let data = [{ value: '全部', options: 0 }];
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

const validator = yup.object({
  username: yup.string().label('系统账号').trim().required(),
  password: yup
    .string()
    .label('登录密码')
    .trim()
    .when({
      is: () => controlType.value == 1,
      then: s => s.required(),
    }),
  fullName: yup.string().label('用户昵称').trim().required(),
});
const errors = yup.toSchemaErrors(validator, []);

function SaveUser() {
  validator.validate(formData.value, { abortEarly: false }).then(
    () => {
      yup.toSchemaErrors(validator, [], errors);
      if (controlType.value == 1) {
        sys.AddUser(
          formData.value,
          (d: BaseReply) => {
            SetAlertMessages(infoAlerts, [{ index: 0n, message: '添加成功' }]);
            ReListTableUser();
          },
          (why: any) => {
            SetAlertMessages(warningAlerts, [{ index: 0n, message: why.code + ': ' + why.message }]);
          }
        );
      } else {
        sys.UpdateUser(
          formData.value,
          (d: BaseReply) => {
            SetAlertMessages(infoAlerts, [{ index: 0n, message: '修改成功' }]);
            ReListTableUser();
          },
          (why: any) => {
            SetAlertMessages(warningAlerts, [{ index: 0n, message: why.code + ': ' + why.message }]);
          }
        );
      }
      setFormModalPreview(false);
    },
    err => {
      yup.toSchemaErrors(validator, err.inner, errors);
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
const formData = ref<User>(User.create());

const seteditModalPreview = (v: boolean) => {
  if (ids.value.length != 1) {
    SetAlertMessages(warningAlerts, [{ index: 0n, message: '请选择一条数据' }]);
    return;
  }
  if (v) {
    formData.value = ids.value[0];
  } else {
    //formData.value = null;
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

function getRoleName(ids: bigint[]): string {
  let roleNamesHtml: string = '';
  ids.forEach(id => {
    roles.value.forEach((role: { id: bigint; name: any }) => {
      if (role.id === id) {
        roleNamesHtml += `<span class="bg-slate-400 rounded text-slate-100 px-2 text-sm mb-2 xl:mb-0">${role.name}</span> `;
      }
    });
  });
  return roleNamesHtml.trim(); // 去除最后一个多余的空格
}

const buttonClickCss = computed(() => {
  return;
});
// button function end//

const dsize = ref<any>('lg');

// 添加系统用户
let formDialogIcon: Icon = 'PlusSquare';
const formModelPreview = ref(false);
const setFormModalPreview = (value: boolean, isAdd?: boolean) => {
  if (value && !isAdd) {
    // 仅在打开对话框且是修改操作时执行
    formDialogIcon = 'Edit';
    controlType.value = 0;
    if (ids.value && ids.value.length > 0 && ids.value[0]) {
      sys.QueryUser(
        ids.value[0].id,
        (d: UserReply) => {
          formData.value = d.data!;
        },
        (why: any) => {
          SetAlertMessages(warningAlerts, [{ index: 0n, message: why.code + ': ' + why.message }]);
        }
      );
    } else {
      SetAlertMessages(warningAlerts, [{ index: 0n, message: '请选择一条数据' }]);
    }
  } else if (!value) {
    // 当关闭对话框时，无需任何检查
    formDialogIcon = 'PlusSquare';
    controlType.value = 1;
    formData.value = User.create();
  }
  formModelPreview.value = value;
};

// 删除系统用户
const deleteModalPreview = ref(false);
const setDeleteModalPreview = (value: boolean) => {
  if (ids.value.length == 0) {
    SetAlertMessages(warningAlerts, [{ index: 0n, message: '请选择要删除的用户' }]);
    return;
  }
  deleteModalPreview.value = value;
};

const deleteUser = () => {
  if (ids.value.length == 0) {
    SetAlertMessages(warningAlerts, [{ index: 0n, message: '请选择要删除的用户' }]);
    return;
  }
  sys.DeleteUser(
    ids.value[0].id,
    (d: BaseReply) => {
      SetAlertMessages(infoAlerts, [{ index: 0n, message: '删除成功' }]);
      ReListTableUser();
    },
    (why: any) => {
      SetAlertMessages(warningAlerts, [{ index: 0n, message: why.code + ': ' + why.message }]);
    }
  );
  setDeleteModalPreview(false);
};
</script>

<template>
  <div>
    <h2 class="mt-2 text-lg font-medium">系统用户管理</h2>
    <Alerts variant="primary" icon="AlertCircle" :with-close-icon="true" :auto-dismiss="6000" :messages="infoAlerts" class="flex mx-4 mt-3 items-center mb-0" />
    <Alerts variant="warning" icon="AlertTriangle" :with-close-icon="true" :messages="warningAlerts" class="flex mx-4 mt-3 items-center mb-0" />
    <div class="mt-3 box p-2">
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
          <Button
            variant="primary"
            class="w-24 mb-2 mr-3 py-1"
            @click="
              () => {
                setFormModalPreview(true, true);
                controlType = 1;
              }
            "
          >
            <Lucide icon="PlusSquare" class="w-4 h-4 mr-1" />
            添加
          </Button>
          <Button variant="warning" class="w-24 mb-2 mr-3 py-1" @click="setFormModalPreview(true, false)" :disabled="ids.length != 1">
            <Lucide icon="Edit" class="w-4 h-4 mr-1" />
            修改
          </Button>
          <Button variant="primary" class="w-24 mb-2 mr-3 py-1 min-w-fit" @click="setroleModalPreview(true)" :disabled="ids.length != 1">
            <div class="h-4"></div>
            设置角色
          </Button>
          <Button variant="danger" class="w-24 mb-2 mr-3 py-1 min-w-fit" @click="setDeleteModalPreview(true)" :disabled="ids.length != 1">
            <div class="h-4"></div>
            删除
          </Button>
        </div>
      </div>
    </div>
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
                <span v-if="data.status != 0" class="switch-label !text-[0.6rem] whitespace-no-wrap font-bold dark:text-gray-500 ml-5 z-10 !text-gray-500 cursor-pointer">禁用</span>
                <span v-else class="switch-label !text-[0.6rem] whitespace-no-wrap font-bold dark:text-gray-200 !text-gray-200 z-10 cursor-pointer">启用</span>
                <FormSwitch.Input
                  type="checkbox"
                  :checked="!(data.status as any)"
                  class="w-[64px] h-[24px] before:checked:ml-[39px] before:checked:bg-white checked:bg-red-500"
                  :class="!data.status ? 'opacity-75' : ''"
                ></FormSwitch.Input>
              </FormSwitch>
            </Table.Td>
            <Table.Td v-html="getRoleName(data.roles)"></Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </div>
    <PagingDevice :total="table_user?.total" @handleChangePageSize="changePageSize" @handleChangePage="changePage" ref="pagingRef" :options="BaseOption" />
  </div>

  <Dialog
    :open="formModelPreview"
    @close="
      () => {
        setFormModalPreview(false);
      }
    "
  >
    <Dialog.Panel>
      <Dialog.Title>
        <h2 class="flex items-center text-base font-medium">
          <Lucide :icon="formDialogIcon" class="w-6 h-6 mr-1" />
          {{ controlType == 1 ? '添加' : '修改' }}系统用户信息
        </h2>
      </Dialog.Title>
      <Dialog.Description>
        <div class="space-y-5">
          <FormInline class="flex items-center">
            <FormLabel htmlFor="horizontal-form-1" class="w-1/4 required-label">系统用户名</FormLabel>
            <div class="relative w-3/4">
              <FormInput id="1" type="text" v-model="formData.username" placeholder="请输入系统用户名(可用于系统账号登录)" />
              <template v-if="errors.username.errors">
                <div v-for="(error, index) in errors.username.errors" :key="index" class="absolute text-danger">
                  {{ error.message }}
                </div>
              </template>
            </div>
          </FormInline>
          <FormInline class="flex items-center">
            <FormLabel htmlFor="horizontal-form-1" class="w-1/4 required-label">用户昵称</FormLabel>
            <div class="w-3/4 relative">
              <FormInput id="2" class="" type="text" v-model="formData.fullName" placeholder="请输入昵称" />
              <template v-if="errors.fullName.errors">
                <div v-for="(error, index) in errors.fullName.errors" :key="index" class="absolute text-danger">
                  {{ error.message }}
                </div>
              </template>
            </div>
          </FormInline>
          <FormInline class="flex items-center">
            <FormLabel htmlFor="horizontal-form-1" class="w-1/4 required-label">电子邮箱</FormLabel>
            <FormInput id="3" class="w-3/4" type="email" v-model="formData.email" placeholder="例如：test@example.com" />
          </FormInline>
          <FormInline class="flex items-center">
            <FormLabel htmlFor="horizontal-form-1" class="w-1/4 required-label">联系电话</FormLabel>
            <FormInput id="4" class="w-3/4" type="text" v-model="formData.phone" placeholder="请输入有效的联系电话" />
          </FormInline>
          <FormInline class="flex items-center">
            <FormLabel htmlFor="horizontal-form-1" class="w-1/4">是否启用</FormLabel>
            <FormInput id="5" class="w-3/4" type="text" v-model="formData.status" placeholder="启用或不启用" />
          </FormInline>
          <!-- <FormInline class="flex items-center">
            <FormLabel htmlFor="horizontal-form-1" class="w-1/4">用户角色</FormLabel>
            <FormInput id="6" class="w-3/4" type="text" v-model="formData.roles" placeholder="分配角色" />
          </FormInline> -->
          <FormInline class="flex items-center">
            <FormLabel htmlFor="horizontal-form-1" class="w-1/4 required-label">密码</FormLabel>
            <div class="w-3/4 relative">
              <FormInput id="7" :type="controlType == 1 ? 'password' : 'text'" v-model="formData.password" placeholder="设置登录密码" />
              <template v-if="errors.password.errors">
                <div v-for="(error, index) in errors.password.errors" :key="index" class="absolte text-danger">
                  {{ error.message }}
                </div>
              </template>
            </div>
          </FormInline>
        </div>
      </Dialog.Description>
      <Dialog.Footer class="flex justify-end space-x-4">
        <Button
          variant="primary"
          type="button"
          class="w-20"
          @click="
            () => {
              SaveUser();
            }
          "
        >
          确认
        </Button>
        <Button
          variant="secondary"
          type="button"
          class="w-20"
          @click="
            () => {
              setFormModalPreview(false);
            }
          "
        >
          取消
        </Button>
      </Dialog.Footer>
    </Dialog.Panel>
  </Dialog>

  <Dialog
    :open="deleteModalPreview"
    @close="
      () => {
        setDeleteModalPreview(false);
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
              setDeleteModalPreview(false);
            }
          "
          class="w-24 mr-1"
        >
          取消
        </Button>
        <Button variant="danger" type="button" class="w-24" @click="deleteUser()">确定</Button>
      </div>
    </Dialog.Panel>
  </Dialog>
</template>

<style scoped>
.required-label::before {
  content: '*';
  color: red;
  margin-left: 4px;
}

.table-td {
  @apply flex items-center mr-3 text-[#4E5969] text-[14px] min-w-fit h-[30px] dark:text-[#bfcdd9];
}

.table-th {
  @apply text-[14px] h-[22px];
}

/* 定义余数为 0 的行颜色 */
.tr-color-0 {
  @apply bg-[#f1f5f9];
}

/* 定义余数为 1 的行颜色 */
.tr-color-1 {
  /* background: #f7f9fb !important; */
  @apply bg-slate-100;
}

.switch-label {
  position: absolute;
  left: 4px;
  top: 50%;
  transform: translateY(-50%);
  color: #333;
}
.FormSwitch_Input {
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
}
</style>
