<script setup lang="ts">
import Button from "@/base-components/Button";
import {Variant, Size} from "./index";

interface Props {
    variant?: Variant
    text?: string
    check?: boolean
    disabled?: boolean
    size?: Size
}
interface Emits {
    (e: 'update:check', check: boolean): void;
}

const props = withDefaults(defineProps<Props>(), {
    variant: 'secondary',
    text: '',
    size: 'default',
})
const emits = defineEmits<Emits>();

const primary = [
    "bg-primary border-primary text-white dark:border-primary", // Default
];
const secondary = [
    "bg-secondary/70 border-secondary/70 text-slate-500", // Default
    "dark:border-darkmode-400 dark:bg-darkmode-400 dark:text-slate-300", // Dark mode
    "[&:hover:not(:disabled)]:bg-slate-100 [&:hover:not(:disabled)]:border-slate-100", // On hover and not disabled
    "[&:hover:not(:disabled)]:dark:border-darkmode-300/80 [&:hover:not(:disabled)]:dark:bg-darkmode-300/80", // On hover and not disabled in dark mode
];
const success = [
    "bg-success border-success text-slate-900", // Default
    "dark:border-success", // Dark mode
];
const warning = [
    "bg-warning border-warning text-slate-900", // Default
    "dark:border-warning", // Dark mode
];
const pending = [
    "bg-pending border-pending text-white", // Default
    "dark:border-pending", // Dark mode
];
const danger = [
    "bg-danger border-danger text-white", // Default
    "dark:border-danger", // Dark mode
];
const dark = [
    "bg-dark border-dark text-white", // Default
    "dark:bg-darkmode-800 dark:border-transparent dark:text-slate-300", // Dark mode
    "[&:hover:not(:disabled)]:dark:dark:bg-darkmode-800/70", // On hover and not disabled in dark mode
];

// Social Media
const facebook = [
    "bg-[#3b5998] border-[#3b5998] text-white dark:border-[#3b5998]",
];
const twitter = [
    "bg-[#4ab3f4] border-[#4ab3f4] text-white dark:border-[#4ab3f4]",
];
const instagram = [
    "bg-[#517fa4] border-[#517fa4] text-white dark:border-[#517fa4]",
];
const linkedin = [
    "bg-[#0077b5] border-[#0077b5] text-white dark:border-[#0077b5]",
];

// Outline
const outlinePrimary = [
    "border-primary text-primary", // Default
    "dark:border-primary", // Dark mode
    "[&:hover:not(:disabled)]:bg-primary/10", // On hover and not disabled
];
const outlineSecondary = [
    "border-secondary text-slate-500", // Default
    "dark:border-darkmode-100/40 dark:text-slate-300", // Dark mode
    "[&:hover:not(:disabled)]:bg-secondary/20", // On hover and not disabled
    "[&:hover:not(:disabled)]:dark:bg-darkmode-100/10", // On hover and not disabled in dark mode
];
const outlineSuccess = [
    "border-success text-success", // Default
    "dark:border-success", // Dark mode
    "[&:hover:not(:disabled)]:bg-success/10", // On hover and not disabled
];
const outlineWarning = [
    "border-warning text-warning", // Default
    "dark:border-warning", // Dark mode
    "[&:hover:not(:disabled)]:bg-warning/10", // On hover and not disabled
];
const outlinePending = [
    "border-pending text-pending", // Default
    "dark:border-pending", // Dark mode
    "[&:hover:not(:disabled)]:bg-pending/10", // On hover and not disabled
];
const outlineDanger = [
    "border-danger text-danger", // Default
    "dark:border-danger", // Dark mode
    "[&:hover:not(:disabled)]:bg-danger/10", // On hover and not disabled
];
const outlineDark = [
    "border-dark text-dark", // Default
    "dark:border-darkmode-800 dark:text-slate-300", // Dark mode
    "[&:hover:not(:disabled)]:bg-darkmode-800/30", // On hover and not disabled
    "[&:hover:not(:disabled)]:dark:bg-opacity-30", // On hover and not disabled in dark mode
];

// Soft Color
const softPrimary = [
    "bg-primary border-primary bg-opacity-20 border-opacity-5 text-primary", // Default
    "dark:border-opacity-100 dark:bg-opacity-20 dark:border-primary", // Dark mode
    "[&:hover:not(:disabled)]:bg-opacity-10 [&:hover:not(:disabled)]:border-opacity-10", // On hover and not disabled
    "[&:hover:not(:disabled)]:dark:border-opacity-60", // On hover and not disabled in dark mode
];
const softSecondary = [
    "bg-slate-300 border-secondary bg-opacity-20 text-slate-500", // Default
    "dark:bg-darkmode-100/20 dark:border-darkmode-100/30 dark:text-slate-300", // Dark mode
    "[&:hover:not(:disabled)]:bg-opacity-10", // On hover and not disabled
    "[&:hover:not(:disabled)]:dark:bg-darkmode-100/10 [&:hover:not(:disabled)]:dark:border-darkmode-100/20", // On hover and not disabled in dark mode
];
const softSuccess = [
    "bg-success border-success bg-opacity-20 border-opacity-5 text-success", // Default
    "dark:border-success dark:border-opacity-20", // Dark mode
    "[&:hover:not(:disabled)]:bg-opacity-10 [&:hover:not(:disabled)]:border-opacity-10", // On hover and not disabled
];
const softWarning = [
    "bg-warning border-warning bg-opacity-20 border-opacity-5 text-warning", // Default
    "dark:border-warning dark:border-opacity-20", // Dark mode
    "[&:hover:not(:disabled)]:bg-opacity-10 [&:hover:not(:disabled)]:border-opacity-10", // On hover and not disabled
];
const softPending = [
    "bg-pending border-pending bg-opacity-20 border-opacity-5 text-pending", // Default
    "dark:border-pending dark:border-opacity-20", // Dark mode
    "[&:hover:not(:disabled)]:bg-opacity-10 [&:hover:not(:disabled)]:border-opacity-10", // On hover and not disabled
];
const softDanger = [
    "bg-danger border-danger bg-opacity-20 border-opacity-5 text-danger", // Default
    "dark:border-danger dark:border-opacity-20", // Dark mode
    "[&:hover:not(:disabled)]:bg-opacity-10 [&:hover:not(:disabled)]:border-opacity-10", // On hover and not disabled
];
const softDark = [
    "bg-dark border-dark bg-opacity-20 border-opacity-5 text-dark", // Default
    "dark:bg-darkmode-800/30 dark:border-darkmode-800/60 dark:text-slate-300", // Dark mode
    "[&:hover:not(:disabled)]:bg-opacity-10 [&:hover:not(:disabled)]:border-opacity-10", // On hover and not disabled
    "[&:hover:not(:disabled)]:dark:bg-darkmode-800/50 [&:hover:not(:disabled)]:dark:border-darkmode-800", // On hover and not disabled in dark mode
];
const VariantValue = {
    "primary": primary,
    "secondary": secondary,
    "success": success,
    "warning": warning,
    "pending": pending,
    "danger": danger,
    "dark": dark,
    "outline-primary": outlinePrimary,
    "outline-secondary": outlineSecondary,
    "outline-success": outlineSuccess,
    "outline-warning": outlineWarning,
    "outline-pending": outlinePending,
    "outline-danger": outlineDanger,
    "outline-dark": outlineDark,
    "soft-primary": softPrimary,
    "soft-secondary": softSecondary,
    "soft-success": softSuccess,
    "soft-warning": softWarning,
    "soft-pending": softPending,
    "soft-danger": softDanger,
    "soft-dark": softDark,
    "facebook": facebook,
    "twitter": twitter,
    "instagram": instagram,
    "linkedin": linkedin,
}
const size = computed(()=> {
    switch (props.size) {
        case "large":
            return ['h-[20px]', 'min-w-fit']
        case "small":
            return ['h-[10px]', 'min-w-fit']
      case "extra-small":
        return ['h-[5px]', 'min-w-fit']
      default:
            return ['h-[15px]', 'min-w-fit']
    }
})
</script>

<template>
    <Button size="lg" type="button" :class="[...VariantValue[props.variant], ...size]" :disabled="props.disabled" class="flex flex-row box-border items-center justify-center gap-3 mr-3 rounded-2xl dark:text-[#bfcdd9] p-3">
        <div class="text-[14px] max-w-full truncate">
            <slot>
                {{props.text}}
            </slot>
        </div>
    </Button>
</template>

<style scoped>

</style>