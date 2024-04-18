<script setup lang="ts">
import Vue3TreeSelect from './JSTreeSelect.vue';
import 'vue3-treeselect/dist/vue3-treeselect.css';
import _ from 'lodash';
import { ref, useAttrs, watch } from 'vue';

type nodesType = any | any[];
const selectedNodes = ref<nodesType>();
let originSelectedNodes: nodesType;
const open = ref(true);
const resetSelectedTreeNodes = () => {
  // 重新生成树
  selectedNodes.value = originSelectedNodes;
  open.value = false;
  setTimeout(() => {
    open.value = true;
  }, 80);
};
defineExpose({ resetSelectedTreeNodes });

interface Props {
  modelValue: any;
}

const props = withDefaults(defineProps<Props>(), {});

interface TreeSelectEmit {
  (e: 'update:modelValue', value: bigint[]): void;
}

const emits = defineEmits<TreeSelectEmit>();
selectedNodes.value = [];
if (Array.isArray(props.modelValue)) {
  props.modelValue.forEach(v => {
    selectedNodes.value.push(Number(v));
    originSelectedNodes = selectedNodes.value;
  });
} else {
  selectedNodes.value = props.modelValue;
}
originSelectedNodes = selectedNodes.value;

watch(selectedNodes, n => {
  let ids: nodesType;
  if (Array.isArray(selectedNodes)) {
    selectedNodes.value.forEach((i: any) => {
      ids.push(i);
    });
  } else {
    ids = selectedNodes.value;
  }
  emits('update:modelValue', ids);
});
const attrs = useAttrs();
</script>

<template>
  <Vue3TreeSelect v-if="open" v-model="selectedNodes" v-bind="_.omit(attrs, 'modelValue')"></Vue3TreeSelect>
</template>
