<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import _ from "lodash";
import { twMerge } from "tailwind-merge";
import {
  computed,
 type InputHTMLAttributes,
  useAttrs,
  inject,
  watch,
  ref,
} from "vue";
import type { ProvideFormInline } from "./FormInline.vue";
import type { ProvideInputGroup } from "./InputGroup/InputGroup.vue";

export interface FormInputProps extends /* @vue-ignore */ InputHTMLAttributes {
  modelValue?: InputHTMLAttributes["value"];
  formInputSize?: "sm" | "lg";
  rounded?: boolean;
  trim?: boolean;
}

interface FormInputEmit {
  (e: "update:modelValue", value: string): void;
}

const props = defineProps<FormInputProps>();

const attrs = useAttrs();

const formInline = inject<ProvideFormInline>("formInline", false);
const inputGroup = inject<ProvideInputGroup>("inputGroup", false);

const computedClass = computed(() =>
  twMerge([
    "disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-darkmode-800/50 dark:disabled:border-transparent",
    "[&[readonly]]:bg-slate-100 [&[readonly]]:cursor-not-allowed [&[readonly]]:dark:bg-darkmode-800/50 [&[readonly]]:dark:border-transparent",
    "transition duration-200 ease-in-out w-full text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary focus:border-opacity-40 dark:bg-darkmode-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:placeholder:text-slate-500/80",
    props.formInputSize == "sm" && "text-xs py-1.5 px-2",
    props.formInputSize == "lg" && "text-lg py-1.5 px-4",
    props.rounded && "rounded-full",
    formInline && "flex-1",
    inputGroup &&
      "rounded-none [&:not(:first-child)]:border-l-transparent first:rounded-l last:rounded-r z-10",
    typeof attrs.class === "string" && attrs.class,
  ])
);

const localValue = ref<InputHTMLAttributes["value"]>(props.modelValue);
const emit = defineEmits<FormInputEmit>();

watch(localValue, () => {
  emit("update:modelValue", localValue.value);
});

watch(props, () => {
  localValue.value = props.modelValue;
},{deep: true});

function changeHandler(e: any) {
  if (props.trim) {
    let value = e.target.value;
    localValue.value = String(value).trim()
  }
}
</script>

<template>
  <input
    :class="computedClass"
    :type="props.type"
    v-bind="_.omit(attrs, 'class')"
    v-model="localValue"
    @change="changeHandler"
  />
</template>
