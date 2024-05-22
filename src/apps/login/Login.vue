<script setup lang="ts">
import logoUrl from '@/assets/images/logo.svg';
import illustrationUrl from '@/assets/images/illustration.svg';
import { FormInput, FormCheck } from '@/base-components/Form';
import Button from '@/base-components/Button';
import { Login, LoginMethod } from '@/components/Auth';
import { type AlertMessage, SetAlertMessages, ResetAlertMessages, Alerts } from '@/base-components/Alert';
import { computed, onMounted, reactive, ref, toRefs, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Dialog } from '../../base-components/Headless';
import Lucide from '@/base-components/Lucide';
import { yup } from '@/base-components/I18n-validators';
import { Tab } from '@/base-components/Headless';
import { showWelcome, Welcome } from '@/components/Auth';
import { ucStore } from '@/stores/apps/uc';
import { MainColorSwitcherStatic } from '@/components/MainColorSwitcher';
import { DarkModeSwitcher2 } from '@/components/DarkModeSwitcher';
import { getColor } from '@/utils/colors';
import { useColorSchemeStore } from '@/stores/color-scheme';
import { useDarkModeStore } from '@/stores/dark-mode';
import { ShowCaptcha, SendUsingPhone, GetToken } from '@/stores/apps/sms/sms';
import logo from '@/assets/svg/LogoLight.vue';
import * as pb from '@/stores/grpc/sms/v1/sms';
import { userLoginAccountInfo, setLoginInfoInput } from '@/stores/login-user-account-info';
import { message } from '@/utils/message';

const successModalOpen = ref(false);
const warningAlerts = ref<AlertMessage[]>([]);
const router = useRouter();
const loginRedirectCountDown = ref(3);
const rememberAccount = ref(false);
const submitBtnType = computed((): 'submit' | 'button' => {
  return rememberAccount.value ? 'submit' : 'button';
});

let uLoginMethod = LoginMethod.account;
const formData = reactive({
  username: '',
  password: '',
  phone_number: '',
  captcha: '',
  code: '',
});
const validator = yup.object({
  username: yup
    .string()
    .label('系统账号')
    .trim()
    .when({
      is: () => uLoginMethod == LoginMethod.account,
      then: s => s.required(),
    }),
  password: yup
    .string()
    .label('登录密码')
    .trim()
    .when({
      is: () => uLoginMethod !== LoginMethod.code,
      then: s => s.required(),
    }),
  phone_number: yup
    .string()
    .label('电话号码')
    .trim()
    .when({
      is: () => {
        return uLoginMethod == LoginMethod.tel || uLoginMethod == LoginMethod.code;
      },
      then: s => s.required(),
    }),
  captcha: yup
    .string()
    .label('图片验证码')
    .trim()
    .when({
      is: () => uLoginMethod == LoginMethod.code,
      then: s => s.required(),
    }),
  code: yup
    .string()
    .label('短信验证码')
    .trim()
    .when({
      is: () => uLoginMethod == LoginMethod.code,
      then: s => s.required(),
    }),
});

const phoneValidator = yup.object({
  phone_number: yup
    .string()
    .label('手机号')
    .trim()
    .matches(/^((13[0-9])|(14[5-9])|(15([0-3]|[5-9]))|(16[2567])|(17[0-8])|(18[0-9])|(19[89]))\d{8}$/, '请输入正确的手机号码'),
  captcha: yup.string().label('图形验证码').trim().required().min(6, '图形验证码不能少于6个字').max(6, '图形验证码不能大于6个字'),
});
const errors = yup.toSchemaErrors(validator, []);
const extraWarning = ref('');
const login = () => {
  validator.validate(formData, { abortEarly: false }).then(
    () => {
      yup.toSchemaErrors(validator, [], errors);
      doLogin();
    },
    err => {
      yup.toSchemaErrors(validator, err.inner, errors);
    }
  );
};

const deviceInfo = ref('');

// 获取当前设备的操作系统、浏览器等信息
const getBrowserInfo = () => {
  let info = {
    userAgent: navigator.userAgent, // 获取用户代理字符串，包含浏览器版本和操作系统信息
    language: navigator.language, // 获取浏览器设置的语言
    platform: navigator.platform, // 获取操作系统平台
    screenWidth: window.screen.width, // 获取屏幕宽度
    screenHeight: window.screen.height, // 获取屏幕高度
  };
  deviceInfo.value = JSON.stringify(info);
};

getBrowserInfo();
const LoginAccountInfo = userLoginAccountInfo();
const doLogin = () => {
  if (uLoginMethod == LoginMethod.code && !isSend.value) {
    message.Error(`登录失败: 请先获取验证码`);
    return;
  }
  Login(
    uLoginMethod,
    formData.username,
    formData.phone_number,
    formData.password,
    formData.code,
    deviceInfo.value,
    () => {
      ResetAlertMessages(warningAlerts);
      // 登录成功后，获取用户中心数据并同步到本地
      ucStore()
        .syncRemote()
        .then(
          () => {},
          why => {
            loginRedirectCountDown.value = 11;
            extraWarning.value = `获取用户信息失败，但您已登录成功，仍可继续使用系统，部分功能可能无法正常工作: ${why.code} ${why.message}`;
          }
        )
        .finally(() => {
          // 选择不记住账号时,修改password控件属性，避免浏览器询问记住密码.
          if (uLoginMethod !== LoginMethod.code) {
            // 当前的方式, safari始终无法询问是否记住密码.
            let pf = document.getElementById('field-password') as HTMLInputElement;
            let pf2 = document.getElementById('field-password2') as HTMLInputElement;
            pf.value = pf2.value = '*'.repeat(formData.password.length);
            pf.type = pf2.type = 'text';
            pf.disabled = pf2.disabled = true;
          }
          if (rememberAccount.value) {
            const loginInfoInput: setLoginInfoInput = {
              loginType: 'username',
              account: '',
            };
            switch (uLoginMethod) {
              case LoginMethod.account:
                loginInfoInput.loginType = 'username';
                loginInfoInput.account = formData.username;
                loginInfoInput.password = formData.password;
                break;
              case LoginMethod.tel:
                loginInfoInput.loginType = 'phone';
                loginInfoInput.account = formData.phone_number;
                loginInfoInput.password = formData.password;
                break;
              case LoginMethod.code:
                loginInfoInput.loginType = 'code';
                loginInfoInput.account = formData.phone_number;
                break;
            }
            LoginAccountInfo.setLoginInfo(loginInfoInput);
          } else {
            LoginAccountInfo.clearLoginInfo();
          }

          successModalOpen.value = true;
          // 倒计时跳转
          let cd = setInterval(() => {
            if (loginRedirectCountDown.value === 0) {
              clearInterval(cd);
              setTimeout(showWelcome, 3000);
              router.push('/');
              return;
            }
            loginRedirectCountDown.value--;
          }, 1000);
        });
    },
    why => {
      message.Error(`登录失败: ${why.code} ${why.message}`);
    }
  );
};
const bgColor = ref('');
const setBGColor = () => {
  if (useDarkModeStore().darkMode) {
    bgColor.value = getColor('darkmode.800');
  } else {
    bgColor.value = getColor('primary');
  }
};
function rememberLoginInfo() {
  const info = LoginAccountInfo.loginInfo;
  rememberAccount.value = info !== undefined;
  if (info) {
    switch (info.loginType) {
      case 'username':
        formData.username = info.account ?? '';
        formData.password = info.password ?? '';
        break;
      case 'phone':
        formData.phone_number = info.account ?? '';
        formData.password = info.password ?? '';
        break;
      case 'code':
        formData.phone_number = info.account ?? '';
        break;
    }
  }
}

onMounted(() => {
  setBGColor();
  watch(useColorSchemeStore(), () => {
    setBGColor();
  });
  watch(useDarkModeStore(), () => {
    setBGColor();
  });
  rememberLoginInfo();
});
const isVerifyCodeLogin = ref(false);
const changeVerifyCodeLogin = () => {
  isVerifyCodeLogin.value = !isVerifyCodeLogin.value;
  if (isVerifyCodeLogin.value && !captchaUrl.value?.captchaId) {
    RefreshCaptcha();
    uLoginMethod = LoginMethod.code;
  } else if (!isVerifyCodeLogin.value) {
    uLoginMethod = LoginMethod.tel;
  } else if (isVerifyCodeLogin.value) {
    uLoginMethod = LoginMethod.code;
  }
};
const captchaUrl = ref<pb.ShowCaptchaReply>();
const timer = ref(0);
const isSend = ref(false);

const intervalId = ref<number | null>(null);

const RefreshCaptcha = () => {
  ShowCaptcha(
    d => {
      captchaUrl.value = d;
    },
    why => {
      message.Error(`图片验证码刷新失败: ${why.code} ${why.message}`);
    }
  );
};

const SendCode = () => {
  phoneValidator.validate(formData, { abortEarly: false }).then(
    () => {
      yup.toSchemaErrors(validator, [], errors);
      if (timer.value === 0 && formData.captcha == '018888') {
        isSend.value = true;
        timer.value = 60;
        (intervalId.value as any) = setInterval(() => {
          if (timer.value > 0) {
            timer.value--;
          } else {
            clearInterval(intervalId.value as number);
            intervalId.value = null;
          }
        }, 1000);
        return;
      }
      if (timer.value === 0) {
        GetToken(
          pb.GetTokenRequest.create({
            businessType: 0,
            phone: formData.phone_number,
          }),
          re => {
            SendUsingPhone(
              pb.SendUsingPhoneRequest.create({
                phoneNumber: formData.phone_number,
                captchaId: captchaUrl.value?.captchaId,
                captchaAnswer: String(formData.captcha),
                token: re.jwt,
              }),
              re => {
                if (re.code == 200) {
                  isSend.value = true;
                  timer.value = 60;
                  (intervalId.value as any) = setInterval(() => {
                    if (timer.value > 0) {
                      timer.value--;
                    } else {
                      clearInterval(intervalId.value as number);
                      intervalId.value = null;
                    }
                  }, 1000);
                }
              },
              why => {
                message.Error(`短信验证码获取失败:  ${why.message}`);
              }
            );
          },
          why => {
            message.Error(`短信验证码获取失败:  ${why.message}`);
          }
        );
      }
    },
    err => {
      yup.toSchemaErrors(validator, err.inner, errors);
    }
  );
};
</script>
<style scoped></style>
<template>
  <Welcome />
  <Dialog :open="successModalOpen">
    <Dialog.Panel>
      <div class="p-5 text-center">
        <button class="mt-3 focus-visible:outline-none">
          <Lucide icon="CheckCircle" class="w-16 h-16 mx-auto text-success" />
        </button>
        <div class="mt-5 text-3xl pl-3">登录成功！</div>
        <div class="mt-2 text-slate-500">
          系统将带您跳转至管理面板.
          <div class="text-sky-700">使用完系统后，请及时退出登录，避免账号信息泄露!</div>
          <div class="text-warning">{{ extraWarning }}</div>
        </div>
        <div class="text-3xl text-slate-400">
          {{ loginRedirectCountDown }}
        </div>
      </div>
    </Dialog.Panel>
  </Dialog>
  <div :class="['flex xl:pr-8 relative h-screen lg:overflow-hidden bg-primary xl:bg-white dark:bg-darkmode-800 xl:dark:bg-darkmode-600', 'before:dark:bg-darkmode-400', 'after:dark:bg-darkmode-700']">
    <div class="absolute hidden xl:block w-2/4 h-full">
      <svg class="h-full" viewBox="0 0 983 982" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g>
          <path
            opacity="0.5"
            d="M-47.0382 -48.2346L-43.1993 990.265C-43.1993 990.265 551.316 1094.16 671.218 740.729C754.248 495.986 546.559 371.921 637.467 222.637C728.948 72.413 878.003 162.607 982.506 -48.2346L-47.0382 -48.2346Z"
            :fill="bgColor"
          />
          <path
            d="M-84.5643 -39.2346L-80.7253 999.265C-80.7253 999.265 501.61 1089.13 621.512 735.704C704.542 490.961 509.033 380.921 599.941 231.637C691.422 81.413 813.12 171.607 917.623 -39.2346L-84.5643 -39.2346Z"
            :fill="bgColor"
          />
        </g>
      </svg>
    </div>

    <div class="container relative z-10 sm:px-10">
      <div class="block grid-cols-2 gap-4 xl:grid">
        <!-- BEGIN: Login Info -->
        <div class="flex-col hidden min-h-screen pt-12 xl:flex">
          <a href="" class="flex items-center -intro-x" style="filter: alpha(0.3)">
            <!-- <logo width="80" height="77" /> -->
            <img src="@/assets/images/logo.png" class="w-12" />
            <span class="text-lg 2xl:text-xl text-white font-black">贝吉塔管理后台系统</span>
          </a>
          <div class="my-auto">
            <!-- <img alt="管理后台" class="w-1/2 -mt-0 ml-10 -intro-x" :src="illustrationUrl" /> -->
            <div class="mt-5 text-3xl font-medium leading-tight text-white -intro-x">即刻登录,</div>
            <div class="mt-5 w-[15rem] xl:-ml-[2rem] text-3xl font-medium text-white -intro-x">助您驾驭全局！</div>
          </div>
        </div>
        <!-- END: Login Info -->
        <!-- BEGIN: Login Form -->
        <form
          class="flex px-scale-2 h-screen overflow-hidden py-5 my-10 xl:h-auto xl:py-0 xl:my-0"
          @keydown="
            e => {
              if (e.keyCode === 13) {
                e.preventDefault();
                login();
              }
            }
          "
        >
          <div class="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:py-1 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto">
            <h2 class="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left">登录</h2>
            <div class="mt-2 text-center intro-x xl:hidden">即刻登录, 尽在掌控!</div>
            <Alerts variant="warning" icon="AlertTriangle" :with-close-icon="true" :messages="warningAlerts" class="flex mx-4 mt-3 items-center mb-0" />
            <div class="mt-5 intro-x">
              <Tab.Group>
                <Tab.List variant="boxed-tabs" class="mb-2">
                  <Tab v-slot="{ selected }">
                    <Tab.Button
                      @click="
                        () => {
                          uLoginMethod = LoginMethod.account;
                        }
                      "
                      :class="[
                        'rounded-r-none border-none py-2 text-center',
                        {
                          'bg-slate-100 text-slate-500 dark:bg-darkmode-400': !selected,
                        },
                      ]"
                    >
                      账号登录
                    </Tab.Button>
                  </Tab>
                  <Tab v-slot="{ selected }">
                    <Tab.Button
                      @click="
                        () => {
                          uLoginMethod = LoginMethod.tel;
                        }
                      "
                      :class="[
                        'rounded-l-none border-none py-2 text-center',
                        {
                          'bg-slate-100 text-slate-500 dark:bg-darkmode-400': !selected,
                        },
                      ]"
                    >
                      手机号登录
                    </Tab.Button>
                  </Tab>
                </Tab.List>
                <Tab.Panels>
                  <Tab.Panel :unmount="false">
                    <div class="relative intro-x">
                      <FormInput type="text" v-model="formData.username" class="block px-4 py-3 login__input min-w-full xl:min-w-[350px] font-black" placeholder="系统账号" />
                      <template v-if="errors.username.errors">
                        <div v-for="(error, index) in errors.username.errors" :key="index" class="mt-2 text-danger">
                          {{ error.message }}
                        </div>
                      </template>
                      <div class="relative">
                        <FormInput
                          type="password"
                          v-model="formData.password"
                          id="field-password"
                          class="relative block font-black px-4 py-3 mt-4 login__input min-w-full xl:min-w-[350px] placeholder:text-sm dark:bg-darkmode-900"
                          placeholder="登录密码"
                        />
                        <template v-if="errors.password.errors">
                          <div v-for="(error, index) in errors.password.errors" :key="index" class="mt-2 text-danger">
                            {{ error.message }}
                          </div>
                        </template>
                      </div>
                    </div>
                  </Tab.Panel>
                  <Tab.Panel :unmount="false">
                    <div class="relative intro-x">
                      <FormInput type="text" name="phone_number" v-model="formData.phone_number" class="block px-4 py-3 login__input min-w-full xl:min-w-[350px] font-black" placeholder="手机号码" />
                      <template v-if="errors.phone_number.errors">
                        <div v-for="(error, index) in errors.phone_number.errors" :key="index" class="mt-2 text-danger">
                          {{ error.message }}
                        </div>
                      </template>
                      <div class="flex flex-row items-center justify-end my-1 dark:text-slate-400">
                        <span class="flex flex-row items-center cursor-pointer" @click="changeVerifyCodeLogin">
                          <Lucide icon="Repeat" class="w-3 h-3 mr-[0.15rem]" />
                          <span>
                            {{ !isVerifyCodeLogin ? '验证码登录' : '密码登录' }}
                          </span>
                        </span>
                      </div>
                      <div class="relative" v-if="!isVerifyCodeLogin">
                        <FormInput
                          type="password"
                          v-model="formData.password"
                          id="field-password2"
                          class="relative block font-black px-4 py-3 login__input min-w-full xl:min-w-[350px] placeholder:text-sm dark:bg-darkmode-900"
                          placeholder="登录密码"
                        />
                        <template v-if="errors.password.errors">
                          <div v-for="(error, index) in errors.password.errors" :key="index" class="mt-2 text-danger">
                            {{ error.message }}
                          </div>
                        </template>
                      </div>
                      <div v-else>
                        <div class="relative flex flex-row md:flex-row md:items-center mb-2 intro-x">
                          <FormInput type="text" class="block px-4 py-3 login__input font-black" placeholder="图片验证码" v-model="formData.captcha" />
                          <div v-if="captchaUrl?.captchaImage">
                            <img class="w-[8rem] align-top xl:mt-0 ml-2 shadow" :src="captchaUrl?.captchaImage" @click="RefreshCaptcha" />
                          </div>

                          <div v-else class="w-[10.5rem] flex xl:mt-0 ml-2 items-center justify-center text-lg text-gray-500 cursor-pointer" @click="RefreshCaptcha">刷新一下</div>
                        </div>
                        <template v-if="errors.captcha.errors">
                          <div v-for="(error, index) in errors.captcha.errors.slice(0, 1)" :key="index" class="mt-2 text-danger">
                            {{ error.message }}
                          </div>
                        </template>
                        <div class="relative flex flex-row md:flex-row md:items-center my-3 intro-x">
                          <FormInput type="text" class="block px-4 py-3 login__input font-black" placeholder="短信验证码" v-model="formData.code" />
                          <Button
                            variant="outline-primary"
                            class="align-top w-[10.5rem] xl:mt-0 ml-2"
                            :class="timer > 0 ? 'w-[13rem]' : ''"
                            :disabled="timer > 0"
                            @click="
                              e => {
                                e.preventDefault();
                                SendCode();
                              }
                            "
                          >
                            {{ timer > 0 ? timer + '秒后重新获取' : '获取验证码' }}
                          </Button>
                        </div>
                        <template v-if="errors.code.errors">
                          <div v-for="(error, index) in errors.code.errors.slice(0, 1)" :key="index" class="mt-2 text-danger">
                            {{ error.message }}
                          </div>
                        </template>
                      </div>
                    </div>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </div>
            <div class="flex mt-4 text-xs intro-x text-slate-600 dark:text-slate-500 sm:text-sm">
              <div class="flex items-end">
                <div>主题风格:</div>
                <MainColorSwitcherStatic />
              </div>
              <div class="flex items-end ml-2">
                <div>暗夜模式:</div>
                <DarkModeSwitcher2 />
              </div>
            </div>
            <div class="flex mt-4 text-xs intro-x text-slate-600 dark:text-slate-500 sm:text-sm">
              <div class="flex items-center mr-auto">
                <FormCheck.Input id="remember-me" type="checkbox" class="mr-2 border" v-model="rememberAccount" />
                <label class="cursor-pointer select-none" htmlFor="remember-me">记住我的账号信息</label>
              </div>
              <a
                class="cursor-pointer"
                @click="
                  () => {
                    router.push('/forget');
                  }
                "
              >
                忘记密码?
              </a>
            </div>
            <div class="mt-5 text-center intro-x xl:mt-8 xl:text-left">
              <Button
                :type="submitBtnType"
                variant="primary"
                class="w-full px-4 py-3 align-top xl:w-32 xl:mr-3"
                @click="
                  e => {
                    e.preventDefault();
                    login();
                  }
                "
              >
                登录
              </Button>
              <Button
                @click="
                  () => {
                    router.push('/');
                  }
                "
                variant="outline-primary"
                class="w-full px-4 py-3 mt-3 align-top xl:w-32 xl:mt-0"
              >
                返回首页
              </Button>
            </div>
            <div class="mt-10 text-center intro-x xl:mt-24 text-slate-600 dark:text-slate-500 xl:text-left">
              开通账号登录系统并开始使用后即代表您同意我们的
              <a href="/page/AppTerms.html" class="text-primary dark:text-slate-200">《服务条款》</a>
              与
              <a href="/page/PrivacyPolicy.html" class="text-primary dark:text-slate-200">《隐私保护政策》</a>
              .
            </div>
          </div>
        </form>
        <!-- END: Login Form -->
      </div>
    </div>
  </div>
</template>
