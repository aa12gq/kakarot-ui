<template>
  <RouterView />
</template>

<script setup lang="ts">
import { Login } from "@/stores/apps/user/auth";

function login() {
  Login(
    (reply: any) => {
      console.log("通信成功!", reply);
    },
    (why: { message: any }) => {
      console.log("出错了", why.message);
    }
  );
}

login();
</script>
