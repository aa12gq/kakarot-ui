import {defineStore} from "pinia";

const colorSchemes = [
    "default",
    "theme-1",
    "theme-2",
    "theme-3",
    "theme-4",
    "theme-5",
] as const;
const colorSchemeNames = {
    "default": "天蓝",
    "theme-1": "翠绿",
    "theme-2": "紫红",
    "theme-3": "青绿",
    "theme-4": "靛蓝",
    "theme-5": "玫红",
} as const;

export type ColorSchemes = typeof colorSchemes[number];

export const themeName = (key:ColorSchemes):string => {
    return colorSchemeNames[key];
}

interface ColorSchemeState {
    colorSchemeValue: ColorSchemes;
}

const getColorScheme = () => {
    const colorScheme = localStorage.getItem("colorScheme");
    return colorSchemes.filter((item, key) => {
        return item === colorScheme;
    })[0];
};

export const useColorSchemeStore = defineStore("colorScheme", {
    state: (): ColorSchemeState => ({
        colorSchemeValue:
            localStorage.getItem("colorScheme") === null
                ? "default"
                : getColorScheme(),
    }),
    getters: {
        colorScheme(state) {
            if (localStorage.getItem("colorScheme") === null) {
                localStorage.setItem("colorScheme", "default");
            }

            return state.colorSchemeValue;
        },
    },
    actions: {
        setColorScheme(colorScheme: ColorSchemes) {
            localStorage.setItem("colorScheme", colorScheme);
            this.colorSchemeValue = colorScheme;
        },
    },
});
