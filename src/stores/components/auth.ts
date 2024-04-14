import { defineStore } from 'pinia';

export class AccountInfo {
  UID?: number;
  Username?: string;
  JWT?: string;

  constructor(uid?: number, username?: string, jwt?: string) {
    this.UID = uid;
    this.Username = username;
    this.JWT = jwt;
  }
}

interface AuthState {
  Account?: AccountInfo;
  // 是否已登录. 防止多窗口时，其中一个退出登录后，其他字段别其他窗口的state持久化覆盖, 使用单独的key持久化.
  Active?: boolean;
}

class AuthState$Type {
  constructor(account?: AccountInfo) {
    if (account) {
      this.Account = account;
    }
  }
  Account?: AccountInfo;
  Active?: boolean;
}

const ST_KEY = 'auth';
const ST_KEY_ACTIVE = 'auth_active';
const PERSIST_STORAGE = localStorage;
export const authStore = defineStore('auth', {
  persist: {
    storage: PERSIST_STORAGE,
    key: ST_KEY,
    paths: ['Account'],
  },
  state: (): AuthState => {
    const state = new AuthState$Type();
    state.Active = PERSIST_STORAGE.getItem(ST_KEY_ACTIVE) === '1';
    return { ...state };
  },
  getters: {
    jwt: state => {
      if (state.Account) {
        return state.Account.JWT;
      }
      return '';
    },
  },
  actions: {
    isPersistedActive(): boolean {
      return PERSIST_STORAGE.getItem(ST_KEY_ACTIVE) === '1';
    },
    /**
     * 手动从持久存储中恢复active状态(因为Active被设置为不自动同步).
     */
    reloadActive() {
      this.Active = PERSIST_STORAGE.getItem(ST_KEY_ACTIVE) === '1';
    },
    saveJwt(token: string) {
      if (this.Account) {
        this.Account.JWT = token;
      }
    },
    setAccount(info: AccountInfo) {
      this.Account = info;
    },
    activate() {
      this.Active = true;
      PERSIST_STORAGE.setItem(ST_KEY_ACTIVE, '1');
    },
    deactivate() {
      this.Active = false;
      PERSIST_STORAGE.removeItem(ST_KEY_ACTIVE);
    },
    DeleteAccountInfo() {
      this.Account = undefined;
    },
  },
});
