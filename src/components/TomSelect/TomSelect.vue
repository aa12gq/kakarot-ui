<script setup lang="ts">
import TomSelect, {type optionValue} from "@/base-components/TomSelect";

interface Props {
  modelValue?: optionValue;
  // 下拉选项列表
  optionList?: any[]
}

interface SelEmits {
  (e: "update:modelValue", value: optionValue): void;
}

const props = defineProps<Props>();
const currentValue = ref<optionValue>(props.modelValue == undefined ? "" : props.modelValue)
const emits = defineEmits<SelEmits>();
let optionType: string
if (props.optionList && (props.optionList[0] !== undefined && typeof props.optionList[0] == "object")) {
  optionType = "object"
}
watch(props, (o) => {
  currentValue.value = o.modelValue ? o.modelValue : "";
})

const updateV = () => {
  emits('update:modelValue', currentValue.value ? currentValue.value : "")
}
</script>
<template>
  <TomSelect class="flex-1" v-model="currentValue" @update:modelValue="updateV">
      <option v-if="props.optionList && optionType !== 'object'" v-for="(v, k) in props.optionList" :value="v" :key="k">{{ v }}</option>
      <option v-else-if="props.optionList" v-for="{id, name} in props.optionList" :value="id" :key="id">{{ name }}</option>
    <slot></slot>
  </TomSelect>
</template>