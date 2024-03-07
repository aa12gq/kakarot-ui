import { useDarkModeStore } from '@/stores/dark-mode';
import { computed } from 'vue';

export const strokeColor = computed(() => {
  return useDarkModeStore().darkModeValue ? '#9a9aa0' : '#2d3768';
});
