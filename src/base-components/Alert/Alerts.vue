<script setup lang="ts">
import {Alert, type AlertMessage} from "./Composite";
import Lucide, {type Icon} from "@/base-components/Lucide";
import type {Variant} from "@/base-components/Alert/Types";

interface AlertsProps {
  messages: AlertMessage[];
  icon?: Icon;
  iconClasses?: string;
  variant?: Variant;
  class?: string;
  withCloseIcon?: boolean;
  closeIconClass?: string;
  autoDismiss?: number;
}

const props = defineProps<AlertsProps>()

const updateMessagesRef = (index:bigint) => {
  for (let i = 0; i < props.messages.length; i++) {
    if (props.messages[i].index == index) {
      setTimeout(() => props.messages.splice(i, 1), 1500)
      break;
    }
  }
}
</script>
<template>
  <Alert v-for="{index, autoDismiss, message} in messages"
         @dismiss="()=>{updateMessagesRef(index)}"
         :variant="variant"
         :class="[$props.class, 'justify-between']"
         :autoDismiss="autoDismiss? autoDismiss : $props.autoDismiss"
         v-slot="{dismiss}"
         :key="Number(index)">
    <div class="flex items-center">
    <Lucide v-if="icon" :icon="icon" :class="iconClasses? iconClasses : 'w-6 h-6 mr-2'"/>
    <div>{{ decodeURIComponent(message) }} </div>
    </div>
    <Alert.DismissButton v-if="withCloseIcon" type="button"
                         :class="closeIconClass? closeIconClass : 'btn-close text-white'" aria-label="关闭"
                         @click="dismiss">
      <Lucide icon="X" class="w-4 h-4"/>
    </Alert.DismissButton>
  </Alert>
</template>
