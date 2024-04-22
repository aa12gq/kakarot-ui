<script setup lang="ts">
import FormInline from '@/base-components/Form/FormInline.vue';
import { FormLabel, FormInput } from '@/base-components/Form';
import { authStore } from '@/stores/components/auth';
import TomSelect from '@/components/TomSelect';
import { PoliticalStatus, MaritalStatus, DateFormat_1, Nationality, HumanRelations } from '@/utils/const';
import { Dialog } from '@/base-components/Headless';
import Button from '@/base-components/Button';
import { BasicUserInfo, ExtUserInfo, UpdateAvatar, UpdateBasicUserInfo } from '@/stores/apps/uc/uc';
import {DeleteFso, DeleteFsoByPath} from "@/stores/apps/fsosi/fsosi";
import { User } from '@/stores/grpc/system/v1/system';
import { type AlertMessage, SetAlertMessages, Alerts, ResetAlertMessages } from '@/base-components/Alert';
import { computed, onMounted, reactive, ref, toRefs } from 'vue';
import { formatDate, pbTimestamp2Date } from '@/utils/helper';
import Tippy from '@/base-components/Tippy';
import { userAvatar } from '@/stores/apps/uc';
import { ucStore } from '@/stores/apps/uc';
import { config } from '@/config';
import { yup } from '@/base-components/I18n-validators';
import { useRouter } from 'vue-router';
import {FilePond, get_file_pond} from "@/components/FilePond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';

const router = useRouter();
const warningAlerts = ref<AlertMessage[]>([]);
const infoAlerts = ref<AlertMessage[]>([]);
const plugins: any[] = [FilePondPluginImagePreview, FilePondPluginFileValidateType, FilePondPluginImageResize, FilePondPluginFileValidateSize, FilePondPluginImageTransform]
const formData = reactive<User>(User.create());
const extUserInfo = ref<ExtUserInfo>();

const loadFormData = (success?: () => void) => {
  BasicUserInfo(
    userInfo => {
      Object.assign(formData, userInfo.basicInfo);
      extUserInfo.value = userInfo.extInfo;
      if (success) {
        success();
      }
    },
    (why?: any) => {
      if (why) {
        SetAlertMessages(warningAlerts, [{ index: 0n, message: `获取基本信息失败: ${why.code}: ${why.message}` }]);
      }
    }
  );
};
const reloadFormData = () => {
  loadFormData(() => {
    SetAlertMessages(infoAlerts, [{ index: 0n, message: '个人信息刷新成功！' }]);
    ucStore().syncRemote();
  });
};

/***BEGIN: 文件上传**/
const uploadButtonRef = ref<HTMLButtonElement>();
const avatarModalOpen = ref(false);
const avatarUploadSuccess = (reText: any) => {
  let re = JSON.parse(reText);
  UpdateAvatar(re.fsoid, re.path, () => {
        SetAlertMessages(infoAlerts, [{index: 0n, message: "头像上传成功！"}]);
        // 更新本地用户中心数据(包括头像).
        ucStore().syncRemote();
        // 删除原头像
        if (extUserInfo.value && extUserInfo.value.avatarPath) {
          DeleteFsoByPath(extUserInfo.value.avatarPath, () => {
          }, (why: { code: any; message: any; }) => {
            SetAlertMessages(warningAlerts, [{index: 0n, message: `原头像清理失败: ${why.code} ${why.message}`}])
          }, () => {
            avatarModalOpen.value = false;
            // 刷新页面头像
            extUserInfo.value!.avatarPath = re.path;
          });
        }
      },
      (why) => {
        let errMessage = [{index: 0n, message: `头像信息保存失败: ${why.code} ${why.message}`}]
        DeleteFso(re.fsoid, undefined, (why: { code: any; message: any; }) => {
          errMessage.push({index: 1n, message: `临时头像清理失败: ${why.code} ${why.message}`})
        }, () => {
          SetAlertMessages(warningAlerts, errMessage);
          avatarModalOpen.value = false;
        });
      });
}
const avatarUploadFail = (re: any) => {
  SetAlertMessages(warningAlerts, [{index: 0n, message: `头像上传失败: ${re}`}]);
  avatarModalOpen.value = false;
}
const uploadServerConfig = computed(() => {
      return {
        process: {
          onload: avatarUploadSuccess,
          onerror: avatarUploadFail,
          url: config.fs?.uploadApi,
          withCredentials: true,
          timeout: 120000,
          headers: {
            // 目录
            dir: `/avatars/${authStore().Account?.UID}/`,
            // 分组
            bucket: "uc",
          }
        },
        revert: {
          url: config.fs?.deleteApi
        }
      }
    }
);
const avatarFilePond = ref<typeof FilePond>();
const doUploadAvatar = () => {
  if (get_file_pond().getFiles().length < 1) {
    return;
  }
  get_file_pond().processFile();
}
/***END: 文件上传**/
/***BEGIN: 保存基本信息**/
const validator = yup.object({
  phoneNumber: yup.string().label('联系电话').min(6).trim(),
  mailingAddress: yup.string().label('通讯地址').trim().min(2),
  emergencyContact: yup.string().label('紧急联系人').trim().required(),
  emergencyContactPhone: yup.string().label('紧急联系人电话').min(6).trim(),
});

const updateBasicInfo = async () => {
  const errMsg: AlertMessage[] = [];
  validator.validate(formData, { abortEarly: false }).then(
    () => {
      ResetAlertMessages(warningAlerts);
      const data = { userId: ucStore().BasicInfo!.id };
      UpdateBasicUserInfo(
        Object.assign(data, formData),
        () => {
          SetAlertMessages(infoAlerts, [{ index: 0n, message: '基本信息更新成功！' }]);
        },
        why => {
          SetAlertMessages(warningAlerts, [{ index: 0n, message: `更新失败: ${why.code} ${why.message}` }]);
        }
      );
    },
    err => {
      err.errors.map((e: string) => {
        errMsg.push({ index: BigInt(errMsg.length), message: e });
        SetAlertMessages(warningAlerts, errMsg);
      });
    }
  );
};
/***END: 保存基本信息**/

onMounted(() => {
  loadFormData();
});
</script>
<template>
 <!-- BEGIN: 头像上传对话面板 -->
 <Dialog :open="avatarModalOpen" :initialFocus="uploadButtonRef">
    <Dialog.Panel>
      <file-pond ref="avatarFilePond"
                 :plugins="plugins"
                 :acceptedFileTypes="['image/*']"
                 :allow-multiple="false"
                 :server="uploadServerConfig"
                 :instantUpload="false"
                 maxFileSize="10MB"
                 imageResizeTargetWidth="180"
      />
      <div class="flex space-x-4 justify-center py-2">
        <Button @click="avatarModalOpen=false" variant="secondary">关闭</Button>
        <Button @click="doUploadAvatar" variant="primary" ref="uploadButtonRef">上传</Button>
      </div>
    </Dialog.Panel>
  </Dialog>
  <!-- END: 头像上传对话面板 -->
  <div class="relative box py-2 flex flex-col gap-5 overflow-auto">
    <div class="flex flex-col gap-1">
      <Alerts variant="warning" icon="AlertTriangle" :with-close-icon="true" :messages="warningAlerts" class="flex mx-4 items-center" />
    </div>
    <div class="w-full absolute z-[66] top-[50%] sm:top-[30%] left-0 flex justify-center">
      <Alerts variant="primary" icon="AlertCircle" :with-close-icon="true" :auto-dismiss="2000" :messages="infoAlerts" class="bg-primary/50 inline-flex border-none mx-4 items-center mb-1" />
    </div>
    <div class="grid grid-cols-1 gap-y-1 xl:grid-cols-3 pr-5">
      <FormInline class="h-20">
        <FormLabel class="sm:w-[7rem]">头像:</FormLabel>
        <div @click="()=>{avatarModalOpen = true}"
             class="relative h-full cursor-pointer items-center flex justify-center">
          <div class="flex flex-col self-center">
            <img
                alt="头像"
                id="user-avatar"
                class="rounded-full max-w-[3.8rem] mx-h-[3.8rem]"
                :src="userAvatar"
            />
            <div class="text-2xs text-slate-500 text-center">点击更换</div>
          </div>
          <div
              class="absolute h-full w-20 top-0 shadow-cyan-500/50 hover:shadow-rounded-3 shadow-rounded-1 rounded-md"></div>
        </div>
      </FormInline>
      <FormInline>
        <FormLabel class="sm:w-[7rem]">姓名:</FormLabel>
        <span>{{ formData.fullName }}</span>
      </FormInline>
      <!-- <FormInline>
        <FormLabel class="sm:w-[7rem]">性别:</FormLabel>
        <span>{{ formData.gender }}</span>
      </FormInline> -->
    </div>
    <div class="grid grid-cols-1 gap-y-1 xl:grid-cols-3 pr-5">
      <FormInline>
        <FormLabel class="sm:w-[7rem]">登录次数:</FormLabel>
        <span>{{ formData.loginCount }}</span>
      </FormInline>
      <FormInline>
        <FormLabel class="sm:w-[7rem]">最后登录时间:</FormLabel>
        <span>{{ formData.lastLoginAt && formData.lastLoginAt.seconds > 0 ? formatDate(pbTimestamp2Date(formData.lastLoginAt), DateFormat_1) : '未知' }}</span>
      </FormInline>
    </div>
    <div class="grid grid-cols-1 gap-y-1 xl:grid-cols-3 pr-5">
      <FormInline>
        <FormLabel class="sm:w-[7rem]">联系电话:</FormLabel>
        <span>{{ formData.phone }}</span>
        <Tippy content="暂不支持自行更换手机号, 请联系管理员申请更换." :options="{ maxWidth: '10rem' }">
          <Button variant="soft-primary" class="inline-block ml-2 p-1 text-2xs rounded">更换</Button>
        </Tippy>
      </FormInline>
    </div>
    <div class="flex text-2xs sm:text-sm justify-center space-x-12 border-t pt-2">
      <Button variant="primary" @click="updateBasicInfo">保存个人信息</Button>
      <tippy content="刷新表单数据会丢失当前所有未保存的数据." :options="{ maxWidth: '8rem' }">
        <Button variant="danger" @click="reloadFormData">刷新个人信息</Button>
      </tippy>
      <Button
        variant="secondary"
        @click="
          () => {
            router.push({ name: 'uc' });
          }
        "
      >
        返回个人中心
      </Button>
    </div>
  </div>
</template>
