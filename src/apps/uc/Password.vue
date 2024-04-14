<script setup lang="ts">
import {FormLabel, FormInput} from "@/base-components/Form";
import Button from "@/base-components/Button";
import {GetPasswordStrength, Strength as PasswordStrength} from "@/utils/password";
import {computed, onMounted, reactive, ref, toRefs} from "vue";
import {UpdatePassword} from "@/stores/apps/uc/uc";
import {type AlertMessage, SetAlertMessages, Alerts, ResetAlertMessages} from "@/base-components/Alert";
import {yup} from "@/base-components/I18n-validators";

const passwordStrengthIndicatorClass = computed(() => (matchStrength: PasswordStrength) => {
  let strength = GetPasswordStrength(formData.newPassword);
  if (strength < matchStrength) {
    return 'bg-slate-100 dark:bg-darkmode-100';
  }
  switch (matchStrength) {
    case PasswordStrength.Weak:
      return 'bg-success';
    case PasswordStrength.Normal:
      return 'bg-pending';
    case PasswordStrength.Strong:
      return 'bg-danger';
  }
})
const warningAlerts = ref<AlertMessage[]>([]);
const infoAlerts = ref<AlertMessage[]>([]);

const newPassword = ref("")
const formData = reactive({oldPassword: "", newPassword: newPassword, newPassword2: ""});
const validatorRules = {
  oldPassword: yup.string().label('旧密码').trim().required(),
  newPassword: yup.string().label('新密码').trim().min(6),
  newPassword2: yup.string().trim().oneOf([yup.ref("newPassword"), ""], "两次输入的新密码不一致！").required("请再次输入新密码!")
};
const validator = yup.object(validatorRules);
const errors = yup.toSchemaErrors(validator, []);

onMounted(() => {
  // 自动验证机更新错误数据绑定
  yup.autoWatch(validator, formData, errors);
})
const savePassword = () => {
  validator.validate(formData, {abortEarly: false}).then(() => {
        // 清空error
        yup.toSchemaErrors(validator, [], errors);
        UpdatePassword(formData.newPassword, formData.oldPassword, () => {
          SetAlertMessages(infoAlerts, [{message: "密码修改成功", index: 0n}]);
          ResetAlertMessages(warningAlerts);
        }, (why) => {
          SetAlertMessages(warningAlerts, [{message: `密码修改失败:(${why.code}) ${why.message}`, index: 0n}])
        })
      },
      (err) => {
        yup.toSchemaErrors(validator, err.inner, errors);
      }
  );
}
</script>
<template>
  <div class="-intro-y ">
    <div
        class="flex items-center p-3 border-b border-slate-200/60 dark:border-darkmode-400"
    >
      <h2 class="mr-auto text-base font-medium">修改密码</h2>
    </div>
    <div class="p-5">
      <Alerts variant="warning" icon="AlertTriangle" :with-close-icon="true" :messages="warningAlerts"
              class="flex mx-4 mb-3 items-center"/>

      <Alerts variant="primary" icon="AlertCircle" :with-close-icon="true" :auto-dismiss="5000" :messages="infoAlerts"
              class="flex mx-4 mb-3 items-center"/>
      <div>
        <FormLabel htmlFor="change-password-form-1">
          旧密码<span class="text-[red]">*</span>
        </FormLabel>
        <FormInput
            autocomplete="off"
            type="password"
            placeholder="请输入旧密码"
            v-model="formData.oldPassword"
        />
        <template v-if="errors.oldPassword.errors">
          <div
              v-for="(error, index) in errors.oldPassword.errors"
              :key="index"
              class="mt-2 text-danger"
          >
            {{ error.message }}
          </div>
        </template>
      </div>
      <div class="mt-3">
        <FormLabel htmlFor="change-password-form-2">
          新密码<span class="text-[red]">*</span>
          <div class="text-xs text-left pt-1 sm:ml-auto sm:mt-0 text-slate-500">
            密码建议大于6位，包含大小写及特殊字符.
          </div>
        </FormLabel>
        <FormInput
            autocomplete="off"
            v-model="formData.newPassword"
            type="password"
            placeholder="请输入新密码"
        />
        <template v-if="errors.newPassword.errors">
          <div
              v-for="(error, index) in errors.newPassword.errors"
              :key="index"
              class="mt-2 text-danger"
          >
            {{ error.message }}
          </div>
        </template>
      </div>
      <div class="grid w-full h-1 grid-cols-12 gap-4 mt-3">
        <div :class="['h-full col-span-4 rounded',passwordStrengthIndicatorClass(PasswordStrength.Weak)]"></div>
        <div :class="['h-full col-span-4 rounded',passwordStrengthIndicatorClass(PasswordStrength.Normal)]"></div>
        <div :class="['h-full col-span-4 rounded',passwordStrengthIndicatorClass(PasswordStrength.Strong)]"></div>
      </div>
      <div class="flex justify-around gap-4 mt-3">
        <div class="col-span-4 text-success">弱</div>
        <div class="col-span-4 text-pending">中</div>
        <div class="col-span-4 text-danger">强</div>
      </div>
      <div class="mt-3">
        <FormLabel htmlFor="change-password-form-3">
          再次输入新密码<span class="text-[red]">*</span>
        </FormLabel>
        <FormInput
            autocomplete="off"
            v-model="formData.newPassword2"
            type="password"
            placeholder="请输入新密码"
        />
        <template v-if="errors.newPassword2.errors">
          <div
              v-for="(error, index) in errors.newPassword2.errors"
              :key="index"
              class="mt-2 text-danger"
          >
            {{ error.message }}
          </div>
        </template>
      </div>
      <Button variant="primary" type="button" class="mt-4" @click="savePassword">
        保存
      </Button>
      <Button variant="secondary" type="button" class="mt-4 ml-4" @click="()=>{$router.back()}">
        放弃
      </Button>
    </div>
  </div>
</template>


<style scoped>

</style>