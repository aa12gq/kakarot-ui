import {useDarkModeStore} from "@/stores/dark-mode";
import {isDarkMode} from "@/components/DarkModeSwitcher/types";
import {computed} from "vue";
export const darkMode = computed(() => useDarkModeStore().darkMode);
export const setDarkModeClass = () => {
    const el = document.querySelectorAll("html")[0];
    darkMode.value ? el.classList.add("dark") : el.classList.remove("dark");
};

export const switchMode = () => {
    useDarkModeStore().setDarkMode(!darkMode.value);
    isDarkMode.value = darkMode.value;
    setDarkModeClass();
};