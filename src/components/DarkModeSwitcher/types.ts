import {ref, type App, computed, type ComputedRef} from "vue";
import {useDarkModeStore} from "@/stores/dark-mode";

export const isDarkMode = ref<boolean | undefined>(undefined);
export const darkMode = {
    install: (app: App) => {
        const _m = computed(() => {
            // 第一访问时未初始化，则从store中获取。后续再直接使用ref的值.
            if (isDarkMode.value == undefined) {
                isDarkMode.value = useDarkModeStore().darkModeValue;
            }
            return isDarkMode.value;
        });
        app.config.globalProperties.$darkMode = _m;
        Object.defineProperty(app.config.globalProperties, '$darkMode', {
            enumerable: true,
            get: () => _m,
        })
    }
}

declare module '@vue/runtime-core' {
    export interface ComponentCustomProperties {
        $darkMode: ComputedRef<boolean>
    }
}