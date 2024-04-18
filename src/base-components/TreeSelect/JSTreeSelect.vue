<script setup lang="jsx">
import Vue3TreeSelect from 'vue3-treeselect';
import 'vue3-treeselect/dist/vue3-treeselect.css';
</script>

<template>
  <Vue3TreeSelect
    noChildrenText="无可用选项"
    noResultsText="无匹配的结果"
    retryText="重试?"
    retryTitle="点击重试"
    searchNested
    :multiple="false"
    searchPromptText="输入您想搜索的关键字..."
    showCount
    showCountOnSearch
    placeholder="搜索..."
    noOptionsText="尚未有可用选项..."
    class="-intro-y"
    :maxHeight="'500'"
  ></Vue3TreeSelect>
</template>
