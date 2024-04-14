import {computed} from "vue";
import {ColorSchemes, useColorSchemeStore} from "@/stores/color-scheme";
import {useDarkModeStore} from "@/stores/dark-mode";

export const colorScheme = computed(() => useColorSchemeStore().colorScheme);
const darkMode = computed(() => useDarkModeStore().darkMode);

export const setColorSchemeClass = () => {
    const el = document.querySelectorAll("html")[0];
    el.setAttribute("class", colorScheme.value);
    darkMode.value && el.classList.add("dark");
};

export const switchColorScheme = (colorScheme: ColorSchemes) => {
    useColorSchemeStore().setColorScheme(colorScheme);
    setColorSchemeClass();
};