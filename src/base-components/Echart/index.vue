//Components/VEcharts/index.vue
<template>
  <div ref="echartsRef" class="echarts-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import echarts, { ECOption } from './echart'; //引入配置文件
let myChart: echarts.ECharts;
const echartsRef = ref<HTMLElement>();

const props = defineProps({
  width: {
    type: String,
    default: '100%',
    required: true,
  },
  height: {
    type: String,
    default: '100%',
    required: true,
  },
  option: {
    type: Object,
    required: true,
    default: () => ({}),
  },
});

const debounce = (fn: Function, delay?: number) => {
  let delays = delay || 500;
  let timer: NodeJS.Timeout | null;
  return (...rest: Array<any>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(function () {
      timer = null;
      fn.apply(null, rest);
    }, delays);
  };
};
let debounceResize: any;

const init = (dom: HTMLElement) => {
  myChart = echarts.init(<HTMLElement>echartsRef.value);
  myChart.setOption(props.option);
};

onMounted(() => {
  if (echartsRef.value) {
    init(echartsRef.value);
    debounceResize = debounce(myChart.resize);
    window.addEventListener('resize', debounceResize);
  }
});
onBeforeUnmount(() => {
  if (myChart) myChart.dispose(); //销毁
  window.removeEventListener('resize', debounceResize);
});

const getDom = () => {
  if (myChart) return myChart.getDom();
};
const setOption = (option: ECOption) => {
  if (myChart) myChart.setOption(option);
};
defineExpose({
  getDom,
  setOption,
});
</script>

<style scoped>
.echarts-container {
  width: v-bind('props.width');
  height: v-bind('props.height');
}
</style>
