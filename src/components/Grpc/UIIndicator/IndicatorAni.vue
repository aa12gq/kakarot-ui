<script lang="ts">
export default {
  name: "IndicatorAni"
}
</script>
<script setup lang="ts">
import {loadingIndicator} from "@/components/LoadingIndicator";
</script>
<template>
  <div id="vg-grpc-invoking-ani"
       class="fixed z-[999999] hidden top-[23vh] left-[50vw] flex flex-col">
    <div class="flex justify-center">
      <loadingIndicator.Puff />
    </div>
    <div class="text-2xs text-slate-900 dark:text-slate-300">云端通讯中...</div>
  </div>
</template>


