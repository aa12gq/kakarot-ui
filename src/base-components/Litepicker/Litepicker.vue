<script lang="ts">
import {ILPConfiguration} from "litepicker/dist/types/interfaces";
// type LitepickerConfig = Partial<ILPConfiguration>;
</script>
<script setup lang="ts">
import {onMounted, ref, watch, inject, onUnmounted} from "vue";
import { setValue, init, reInit} from "./litepicker";
import { FormInput } from "@/base-components/Form";
import {InputHTMLAttributes} from "vue";
import type LitepickerJs from "litepicker";
import _ from "lodash";
import {DateTime} from "litepicker/dist/types/datetime";

export interface LitepickerElement extends HTMLInputElement {
  litePickerInstance: LitepickerJs;
}

export interface LitepickerEmit {
  (e: "update:modelValue", value: string): void;
  (e: "onConfirm", date1: DateTime, date2: DateTime): void
}
export type ProvideLitepicker = (el: LitepickerElement) => void;
export interface LitepickerProps extends InputHTMLAttributes {
  modelValue: string;
  refKey?: string;
  options?: any;
  initValue?: boolean;
}

const props = withDefaults(defineProps<LitepickerProps>(), {
  options: {},
  initValue: true,
});
const defaultOptions = {
  buttonText: {"apply":"确定","cancel":"取消"},
  format: "YYYY-MM-DD",
  position: "right",
  lang: "zh-CN",
  showWeekNumbers: true,
  dropdowns: {
    minYear: new Date().getFullYear() - 80,
    maxYear:  new Date().getFullYear() + 10,
    months: true,
    years: true
  },
}
_.defaultsDeep(props.options, defaultOptions);
const litepickerRef = ref<LitepickerElement>();
const tempValue = ref(props.modelValue);
const emit = defineEmits<LitepickerEmit>();
const vLitepickerDirective = {
  mounted(el: LitepickerElement) {
    if (props.initValue) {
      setValue(props, emit);
    }
    if (el) {
      init(el, props, emit);
    }
  },
  updated(el: LitepickerElement) {
    if (tempValue.value !== props.modelValue && el !== null) {
      reInit(el, props, emit);
    }
  },
  unmounted(el: LitepickerElement){
    el.litePickerInstance.destroy();
  }
};

watch(props, () => {
  tempValue.value = props.modelValue;
});

const bindInstance = (el: LitepickerElement) => {
  if (props.refKey) {
    const bind = inject<ProvideLitepicker>(`bind[${props.refKey}]`);
    if (bind) {
      bind(el);
    }
  }
};

onMounted(() => {
  if (litepickerRef.value) {
    bindInstance(litepickerRef.value);
  }
});
</script>

<template>
  <FormInput
    ref="litepickerRef"
    type="text"
    :value="props.modelValue"
    :disabled="props.disabled"
    @change="(event) => {
      emit('update:modelValue', (event.target as HTMLSelectElement).value);
    }"
    v-litepicker-directive
  />
</template>
