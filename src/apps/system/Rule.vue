<script setup lang="ts">
import { SyncMenuResources, MenuResource } from '@/stores/apps/system/auth';
import { Alerts, AlertMessage, SetAlertMessages } from '@/base-components/Alert';
import TreeSelect from '@/base-components/TreeSelect';
import { ref, watch } from 'vue';
interface Props {
  modelValue: bigint[];
}
const props = defineProps<Props>();
const warningAlerts = ref<AlertMessage[]>([]);

interface treeSelectNode {
  id: number;
  label: string;
  children?: treeSelectNode[];
}

const treeSelectNodes = ref<treeSelectNode[]>([]);

function convertTreeSelectNodes(nodes: MenuResource[], parent?: treeSelectNode) {
  // 第一次调用
  if (parent == undefined) {
    treeSelectNodes.value = [
      {
        id: 0,
        label: `超级管理员权限`,
      },
    ];
  }
  nodes.forEach(c => {
    let sn: treeSelectNode = {
      id: Number(c.id),
      label: c.name,
    };
    if (parent) {
      parent.children?.push(sn);
    } else {
      treeSelectNodes.value.push(sn);
    }
    if (c.submenu?.length > 0) {
      sn.children = [];
      convertTreeSelectNodes(c.submenu, sn);
    }
  });
}

SyncMenuResources(
  menus => {
    convertTreeSelectNodes(menus.submenu);
  },
  why => {
    SetAlertMessages(warningAlerts, [{ index: 0n, message: `权限列表加载失败: ${why.code} ${why.message}` }]);
  }
);

interface TreeSelectEmit {
  (e: 'update:modelValue', value: bigint[]): void;
}

const emits = defineEmits<TreeSelectEmit>();

const selectedNodes = ref<number[]>([]);
props.modelValue.forEach(v => {
  selectedNodes.value.push(Number(v));
});
watch(selectedNodes, n => {
  let ids: bigint[] = [];
  selectedNodes.value.forEach(i => {
    ids.push(BigInt(i));
  });
  emits('update:modelValue', ids);
});
const treeS = ref<typeof TreeSelect>();
defineExpose({
  // 提供重置选择
  reset() {
    treeS.value!.resetSelectedTreeNodes();
  },
});
</script>
<style scoped>
.sa-pri-notify:hover > div {
  display: block;
}
</style>
<template>
  <div>
    <Alerts
      variant="warning"
      icon="AlertTriangle"
      :with-close-icon="true"
      :messages="warningAlerts"
      class="absolute z-[61] bg-warning/90 border-none top-[10vh] w-[60vw] flex mx-4 mt-3 items-center mb-0"
    />
    <TreeSelect ref="treeS" :options="treeSelectNodes" v-model="selectedNodes" searchNested :multiple="true" searchPromptText="搜索..." showCount showCountOnSearch :always-open="true" />
  </div>
</template>
