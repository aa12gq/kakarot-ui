<script setup lang="ts">
import { Slideover, type Size } from '@/base-components/Headless';
import { watch, ref, reactive, onMounted, onUnmounted, nextTick, defineProps, defineEmits, withDefaults, provide } from 'vue';
import { onClickOutside } from '@vueuse/core';
import Lucide from '@/base-components/Lucide';
import { useFullscreen } from '@vueuse/core';
import Tippy from '@/base-components/Tippy';

export interface Props {
  formTitle: string;
  width?: string;
  unmount?: boolean;
  size?: Size;
  open: boolean;
  backdrop?: boolean;
}

const MIN_WIDTH = 400;

const emits = defineEmits<{
  (e: 'update:open', value: boolean): void;
}>();

const props = withDefaults(defineProps<Props>(), {
  size: '2xl',
  backdrop: true,
  width: '50vw',
});

provide<Function>('closeSlideoverForm', () => {
  emits('update:open', false);
});

const slideoverRef = ref<HTMLElement | null>(null);
const { isFullscreen, toggle, exit } = useFullscreen(slideoverRef.value);
watch(
  () => props.width,
  newWidth => {
    const parsedWidth = parseFloat(newWidth!);
    if (parsedWidth >= MIN_WIDTH) {
      state.panelWidth = `${parsedWidth}px`;
      initialState.initialWidth = parsedWidth;
    }
  },
  { immediate: true } // 在挂载时立即监听宽度
);

const target = ref(null);
const excludedSelectors = ['.prevent-click'];

onClickOutside(target, event => {
  if (props.backdrop) return;
  if (state.resizing) return;

  for (let selector of excludedSelectors) {
    if ((event.target as Element).closest(selector)) {
      return;
    }
  }

  emits('update:open', false);
});

const initialState = reactive({
  initialMouseX: 0,
  initialWidth: 0,
});

const state = reactive({
  resizing: false,
  panelWidth: props.width,
});

function onMouseDown(e: MouseEvent) {
  e.preventDefault();

  state.resizing = true;
  // 记录初始鼠标位置和面板宽度
  initialState.initialMouseX = e.clientX;

  const pixelValueMatch = /(\d+)px/.exec(state.panelWidth!);
  if (pixelValueMatch) {
    initialState.initialWidth = parseInt(pixelValueMatch[1], 10);
  }
}

function onMouseMove(e: MouseEvent) {
  if (state.resizing) {
    requestAnimationFrame(() => {
      const dx = e.clientX - initialState.initialMouseX;
      let newWidth = initialState.initialWidth - dx;

      if (newWidth < MIN_WIDTH) {
        newWidth = MIN_WIDTH;
      }

      state.panelWidth = `${newWidth}px`;
      savedWidthBeforeFullscreen = newWidth;
    });
  }
}

function onMouseUp() {
  setTimeout(() => {
    state.resizing = false;
  }, 100);
}

function vwToPixels(vw: any) {
  return Math.round(window.innerWidth * (vw / 100));
}

onMounted(() => {
  nextTick(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    if (props.width) {
      if (props.width.endsWith('vw')) {
        const vw = parseFloat(props.width);
        state.panelWidth = `${vwToPixels(vw)}px`;
        initialState.initialWidth = vwToPixels(vw);
      } else {
        state.panelWidth = props.width;
        initialState.initialWidth = parseFloat(state.panelWidth) || MIN_WIDTH;
      }
    }
  });
});

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
});

let savedWidthBeforeFullscreen = 0;

watch(
  isFullscreen,
  newState => {
    if (newState) {
      // 进入全屏模式时，保存当前的面板宽度并将面板宽度设置为屏幕宽度
      savedWidthBeforeFullscreen = parseFloat(state.panelWidth);
      initialState.initialWidth = window.innerWidth;
      state.panelWidth = `${window.innerWidth}px`;
    } else {
      // 退出全屏模式时，将面板宽度恢复为进入全屏模式前的宽度
      state.panelWidth = `${savedWidthBeforeFullscreen}px`;
    }
  },
  { immediate: true }
);

watch(
  () => props.open,
  newOpen => {
    if (!newOpen && isFullscreen.value) {
      exit();
    }
  },
  { immediate: true }
);
</script>

<template>
  <Slideover :unmount="unmount" :size="size" :open="open" :backdrop="backdrop">
    <div ref="slideoverRef">
      <Slideover.Panel :unmount="unmount" class="rounded-l-xl overflow-hidden w-full relative" :style="{ width: state.panelWidth }">
        <Slideover.Title class="shadow-[0px_1px_3px_1px_#00000010] border-none prevent-click">
          <h2 class="mr-auto text-base font-medium">
            {{ formTitle }}
          </h2>
          <div class="ml-auto">
            <Tippy :content="!isFullscreen ? '点击进入全屏模式' : '点击退出全屏模式'" as="div" :options="{ maxWidth: '10rem' }" class="cursor-pointer">
              <Lucide @click="toggle" :icon="!isFullscreen ? 'Maximize' : 'Expand'" class="w-5 h-5 mx-auto text-success cursor-pointer" />
            </Tippy>
          </div>
        </Slideover.Title>
        <Slideover.Description class="px-0 py-0 bg-slate-100 dark:bg-transparent" ref="target">
          <slot></slot>
        </Slideover.Description>
        <Slideover.Footer class="px-0 py-0 bg-slate-100 dark:bg-transparent">
          <slot name="footer"></slot>
        </Slideover.Footer>
        <div class="resize-handle" @mousedown="onMouseDown"></div>
      </Slideover.Panel>
    </div>
  </Slideover>
</template>

<style scoped>
.resize-handle {
  position: absolute;
  top: 0;
  left: -5px;
  height: 100%;
  width: 10px;
  cursor: ew-resize;
  background-color: transparent;
}
</style>
