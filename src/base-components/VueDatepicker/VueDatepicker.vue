<template>
  <VueDatePicker v-model="internalDateValue" v-bind="datePickerProps" />
</template>

<script setup>
import { ref, watch, computed } from "vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { format, isValid, parseISO } from "date-fns";

const props = defineProps({
  modelValue: String,
  type: {
    type: String,
    default: "single", // 提供默认值
  },
  locale: {
    type: String,
    default: "zh-CN",
  },
  placeholder: {
    type: String,
    default: "请选择日期",
  },
  selectText: {
    type: String,
    default: "确定",
  },
  cancelText: {
    type: String,
    default: "取消",
  },
  nowButtonLabel: {
    type: String,
    default: "当前",
  },
  initializeWithNull: {
    type: Boolean,
    default: true, // 默认为开启，初始为空
  },
});

const emit = defineEmits(["update:modelValue"]);

const internalDateValue = ref(props.initializeWithNull ? null : new Date());

const formatDate = computed(() => {
  switch (props.type) {
    case "single":
      return "yyyy-MM-dd HH:mm";
    case "range":
      return "yyyy-MM-dd HH:mm - yyyy-MM-dd HH:mm";
    case "month":
      return "MM/yyyy";
    case "time":
      return "HH:mm";
    case "timerange":
      return "HH:mm - HH:mm";
    case "week":
      return "RR-yyyy";
    default:
      return "yyyy-MM-dd HH:mm";
  }
});

function handleIncomingDate(value) {
  if (value) {
    const date = parseISO(value);
    if (isValid(date)) {
      internalDateValue.value = date; // 设置解析后的日期
    } else {
      console.error("无效的日期值:", value);
      internalDateValue.value = null;
    }
  } else {
    internalDateValue.value = null;
  }
}

watch(() => props.modelValue, handleIncomingDate, { immediate: true });

watch(
  internalDateValue,
  (newValue) => {
    if (newValue && isValid(newValue)) {
      const formatted = format(newValue, formatDate.value);
      emit("update:modelValue", formatted);
    } else if (newValue === null) {
      emit("update:modelValue", null); // 如果值为 null，发射 null
    } else {
      console.error("尝试格式化无效的日期");
    }
  },
  { immediate: true }
);

const datePickerProps = computed(() => ({
  ...props,
  format: formatDate.value,
  type: props.type, // 显式提供 type 属性
}));
</script>
