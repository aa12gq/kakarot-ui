<script lang="ts">
export default {}
</script>
<script setup lang="ts">
interface Props {
  width?: string,
  height?: string,
  viewBox: string,
};
const props = withDefaults(defineProps<Props>(), {
  width: "100",
  height: "100",
});

</script>
<template>
  <svg :width="width" :height="height" :viewBox="viewBox" fill="none" xmlns="http://www.w3.org/2000/svg">
    <slot></slot>
  </svg>
</template>