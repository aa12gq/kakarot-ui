import { ucStore } from '@/stores/apps/uc';

export { showWelcome, default as Welcome } from './Welcome.vue';
import { GetClient } from '@/components/Grpc/grpc';
import { AuthClient } from '@/stores/grpc/system/v1/auth.client';
import { RenewTokenRequest, RenewTokenReply, LoginRequest, LoginReply, LoginMethod } from '@/stores/grpc/system/v1/auth';
import { GrpcStatusCode } from '@protobuf-ts/grpcweb-transport';
import { config } from '@/config';
import { authStore, AccountInfo } from '@/stores/components/auth';

const DEFAULT_AUTO_RENEW_JWT_INTERVAL = 50;
export const AutoRenewJWT = (interval?: number) => {
  if (!interval || interval <= 0) {
    if (config.auth.jwt_auto_renew_interval && config.auth.jwt_auto_renew_interval > 0) {
      interval = config.auth.jwt_auto_renew_interval;
    } else {
      interval = DEFAULT_AUTO_RENEW_JWT_INTERVAL;
    }
  }
  setInterval(() => {
    try {
      RenewJWT();
    } catch (e) {
      console.log(e);
    }
  }, interval * 1000);
  // 跟踪持久化活动状态标识.
  setInterval(() => {
    if (!authStore().isPersistedActive()) {
      if (authStore().Active) {
        console.log(Date() + ' 其他页面已注销登录，执行登出操作清空所有登录信息...');
        Logout()
          .then()
          .catch(why => {
            throw why;
          });
      }
    }
  }, 2000);
};

const authenticate = (loginType: LoginMethod, userName: string, phoneNum: string, password: string, code: string, device: string): Promise<AccountInfo> => {
  return new Promise((success, fail) => {
    GetClient(AuthClient)
      .login(
        LoginRequest.create({
          method: loginType,
          phoneNum: phoneNum,
          username: userName,
          password: password,
          code: code,
          device: device,
        })
      )
      .response.then(
        (re: LoginReply) => {
          success(new AccountInfo(Number(re.uid), re.username, re.jwt));
        },
        why => {
          fail({ message: '认证异常: ' + decodeURIComponent(why.message), code: why.code });
        }
      )
      .catch(fail);
  });
};

export { LoginMethod };
/**
 *
 * @param loginType
 * @param userName
 * @param phoneNum
 * @param password
 * @param success
 * @param fail
 * @constructor
 */
export const Login = (
  loginType: LoginMethod,
  userName: string,
  phoneNum: string,
  password: string,
  code: string,
  device: string,
  success?: (userinfo: AccountInfo) => void,
  fail?: (reason?: any) => void
) => {
  authenticate(loginType, userName, phoneNum, password, code, device)
    .then(info => {
      authStore().setAccount({ JWT: info.JWT, UID: info.UID, Username: info.Username });
      authStore().activate();
      if (success) {
        success(info);
      }
    }, fail)
    .catch(why => {
      if (fail) fail(why);
    });
};
export const Logout = (): Promise<void> => {
  return new Promise((success, fail?: (why?: any) => void) => {
    try {
      authStore().DeleteAccountInfo();
      authStore().deactivate();
      ucStore().clear();
      if (success) {
        success();
      }
    } catch (e) {
      if (fail) {
        fail(e);
      }
    }
  });
};

export const RenewJWT = (): Promise<void> | void => {
  if (!authStore().jwt || !authStore().isPersistedActive()) {
    // 已经或从其他页面注销.
    return;
  }
  return GetClient(AuthClient)
    .renewToken(RenewTokenRequest.create({ jwt: authStore().jwt }), { disableUIIndicator: true })
    .response.then(
      (re: RenewTokenReply) => {
        authStore().saveJwt(re.jwt);
      },
      why => {
        // jwt 失效，强制注销登录信息
        if (GrpcStatusCode[why.code] == GrpcStatusCode.UNAUTHENTICATED.toString()) {
          Logout()
            .then()
            .catch(why => {
              throw why;
            });
        }
        throw { message: Date() + ' 自动更新认证信息异常: ' + decodeURIComponent(why.message), code: why.code };
      }
    );
};
