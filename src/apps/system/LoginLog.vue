<script setup lang="ts">
import Lucide from '@/base-components/Lucide';
import { Alerts, type AlertMessage, SetAlertMessages } from '@/base-components/Alert';
import {LoginLogListRequest, LoginLogListReply } from '@/stores/grpc/system/v1/system';
import { ListSystemUserLoginLog } from '@/stores/apps/system/system';
import Table from '@/base-components/Table';
import { getDateTimeTs } from '@/utils/date';
import PagingDevice from '@/components/PagingDevice/PagingDevice.vue';
import { BaseOption } from '@/components/PagingDevice';
import { FormInput, FormLabel, FormSelect, FormInline, FormCheck, FormSwitch } from '@/base-components/Form';
import Button from '@/base-components/Button';
import { ref } from 'vue';

const warningAlerts = ref<AlertMessage[]>([]);
const infoAlerts = ref<AlertMessage[]>([]);
const pagingRef = ref<any>({
  page: 1,
  pageSize: 10,
});
// username关键词
const username = ref<string>('');
// fullName关键词
const fullName = ref<string>('');

// 登录日志列表
const loginLogList = ref<LoginLogListReply>(LoginLogListReply.create());

const RefreshLoginLogList = () => {
  ListSystemUserLoginLog(LoginLogListRequest.create({ page: pagingRef.value?.page, pageSize: pagingRef.value?.pageSize, userName: '', fullName: username.value }), (res: LoginLogListReply) => {
    loginLogList.value = LoginLogListReply.create()
    setTimeout(() => {
    loginLogList.value = res;
      
    }, 100);
  }),
    (why: any) => {
      SetAlertMessages(warningAlerts, [{ index: 0n, message: why.code + ': ' + why.message }]);
    };
};

RefreshLoginLogList();

const changePageSize = () => {
  RefreshLoginLogList();
};

const changePage = () => {
  RefreshLoginLogList();
};
</script>

<template>
  <div class="relative intro-y">
    <h2 class="mt-2 text-lg font-medium">系统用户登录日志</h2>
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

    <div class="box mt-3">
      <div class="mt-3 box p-2">
        <div class="pt-2">
          <FormInput class="inline w-80 mx-4" type="text" v-model="username" placeholder="请输入用户昵称" />
          <Button variant="primary" class="inline w-24 mb-2 mr-1" @click="RefreshLoginLogList()">搜索</Button>
        </div>
      </div>
      <div class="border-l-0 border-r-0 col-span-12 border-slate-200/60 dark:border-darkmode-400 overflow-auto intro-y lg:overflow-y-auto sm:overflow-y-auto">
        <Table class="border-spacing-y-[10px] overflow-auto border-y">
          <!-- head -->
          <Table.Thead class="whitespace-nowrap">
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>用户ID</Table.Th>
              <Table.Th>系统账号</Table.Th>
              <Table.Th>用户昵称</Table.Th>
              <Table.Th>登录时间</Table.Th>
              <Table.Th>登录IP</Table.Th>
              <Table.Th>设备信息</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody class="whitespace-nowrap">
            <Table.Tr class="intro-x" v-for="(data, index) in loginLogList.data" :key="index">
              <Table.Td class="td-center">
                {{ data.id }}
              </Table.Td>
              <Table.Td>{{ data.userId }}</Table.Td>
              <Table.Td>{{ data.userName }}</Table.Td>
              <Table.Td class="text-center">
                {{ data.fullName }}
              </Table.Td>
              <Table.Td>{{ getDateTimeTs(data.loginAt) }}</Table.Td>
              <Table.Td class="text-center">{{ data.ip }}</Table.Td>
              <Table.Td class="text-center">{{ data.device }}</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </div>
      <PagingDevice :total="loginLogList?.total" @handleChangePageSize="changePageSize" @handleChangePage="changePage" ref="pagingRef" :options="BaseOption" />
    </div>
  </div>
</template>
