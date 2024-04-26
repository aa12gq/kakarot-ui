<script setup lang="ts">
import { ref } from 'vue';
import Tag from './Tag.vue';
import { Variant } from './index';

interface Option {
  text: string;
  value: any;
}
interface Options extends Option {
  checkedVariant: Variant;
}

interface Props {
  data: Option[];
  defaultCheckIndex?: number;
  selectedColor?: Variant;
  unselectedColor?: Variant;
}
interface Emits {
  (e: 'onTagClickCallback', index: number, checked: boolean, value: any): void;
}

const props = withDefaults(defineProps<Props>(), {
  selectedColor: 'primary',
  unselectedColor: 'secondary',
});
const emits = defineEmits<Emits>();
const data = ref<Options[]>(
  props.data.map((item, index) => {
    return {
      ...item,
      checkedVariant: props.defaultCheckIndex === index ? props.selectedColor : props.unselectedColor,
    };
  })
);

function clickHandler(index: number, value: any) {
  // 单选，并且不可重复点击
  let currentIndex = -1;
  for (let i = 0; i < data.value.length; i++) {
    if (data.value[i].checkedVariant == props.selectedColor) {
      currentIndex = i;
      break;
    }
  }
  if (currentIndex === index) {
    return;
  }
  emits('onTagClickCallback', index, true, value);
  for (let i = 0; i < data.value.length; i++) {
    if (i === index) {
      data.value[i].checkedVariant = props.selectedColor;
      continue;
    }
    data.value[i].checkedVariant = props.unselectedColor;
  }
}
</script>

<template>
  <div style="display: flex; flex-direction: row">
    <Tag v-for="(item, index) in data" size="small" v-model:variant="item.checkedVariant" @click="clickHandler(index, item.value)">
      {{ item.text }}
    </Tag>
  </div>
</template>

<style scoped></style>
