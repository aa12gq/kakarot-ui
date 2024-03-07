import {createI18n} from "vue-i18n";
import zh_cn from "@/assets/lang/zh-cn"
export const translations = {
    'zh-cn': zh_cn,
}

export const i18n = createI18n(
    {
       globalInjection: true,
       locale: "zh-cn",
       legacy: false,
       messages: translations,
    }
);