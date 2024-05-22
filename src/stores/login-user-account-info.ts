import { defineStore } from "pinia";
import { StringToUint8Array, Uint8ArrayToString } from "@/utils/format";
import { base64decode, base64encode } from "@protobuf-ts/runtime";

export type LoginAccountInfo = {
  loginType?: "username" | "phone" | "code";
  account?: string;
  password?: string;
};

export type setLoginInfoInput = {
  loginType: "username" | "phone" | "code";
  account: string;
  password?: string;
};

export const userLoginAccountInfo = defineStore("loginAccountInfo", {
  persist: {
    storage: localStorage,
    key: "loginAccountInfo",
    paths: ["info"],
  },
  state: (): { info?: LoginAccountInfo } => {
    return {
      info: undefined,
    };
  },
  getters: {
    loginInfo(state): LoginAccountInfo | undefined {
      if (!state.info) return undefined;
      const info = { ...state.info };
      if (info && info.password) {
        info.password = Uint8ArrayToString(base64decode(info.password));
      }
      return info;
    },
  },
  actions: {
    setLoginInfo(info: setLoginInfoInput) {
      if (info.password) {
        info.password = base64encode(StringToUint8Array(info.password));
      }
      this.info = info;
    },
    clearLoginInfo() {
      this.info = undefined;
    },
  },
});
