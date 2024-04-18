<template>
  <!-- BEGIN：分页器 -->
  <div class="">
    <div class="flex flex-col sm:flex-row items-center col-span-12 sm:flex-nowrap box py-2">
      <div class="flex-1 flex flex-col sm:flex-row sm:items-center hidden-on-small-screens">
        <div v-if="options.length > 1 && pageSizeShow">
          <FormLabel class="ml-2 mt-3 mr-2">当前页数量</FormLabel>
          <FormSelect class="w-16 mt-3 !box sm:mt-0 text-center !border" v-model.number="pageSize" @change="handleChangePageSize()">
            <option v-for="(item, index) in options" :key="index">
              {{ item }}
            </option>
          </FormSelect>
        </div>
        <FormLabel class="ml-2 mt-3 mr-2" :class="pageSizeShow == false ? 'ml-4' : ''">共{{ total }}条数据</FormLabel>
      </div>
      <div class="flex flex-col sm:flex-row-reverse">
        <Pagination class="w-full sm:w-auto sm:mr-auto">
          <Pagination.Link @click="handleChangePage(1)" :disabled="isPrevDoubleDisabled">
            <Lucide icon="ChevronsLeft" class="w-4 h-4" />
          </Pagination.Link>
          <Pagination.Link @click="handleChangePage(page - 1)" :disabled="isPrevDisabled">
            <Lucide icon="ChevronLeft" class="w-4 h-4" />
          </Pagination.Link>

          <div v-for="(x, i) in pageMax" :key="i">
            <Pagination.Link v-show="getShow(x)" v-model="page" :active="getActive(x)" @click="handleChangePage(x)">
              {{ x }}
            </Pagination.Link>
          </div>
          <Pagination.Link @click="handleChangePage(page + 1)" :disabled="isNextDisabled">
            <Lucide icon="ChevronRight" class="w-4 h-4" />
          </Pagination.Link>
          <Pagination.Link @click="handleChangePage(pageMax)" :disabled="isNextDoubleDisabled">
            <Lucide icon="ChevronsRight" class="w-4 h-4" />
          </Pagination.Link>
        </Pagination>
      </div>
    </div>
  </div>
  <!-- END：分页器 -->
</template>

<script lang="ts" setup>
import Pagination from '@/base-components/Pagination';
import { FormSelect, FormLabel } from '@/base-components/Form';
import Lucide from '@/base-components/Lucide/Lucide.vue';
import { ref, computed, nextTick } from 'vue';

const props = defineProps({
  total: {
    type: Number,
    default: 0,
  },
  options: {
    type: Array,
    default: () => ['5'],
  },
  pageSizeShow: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['handleChangePageSize', 'handleChangePage']);
const pageSize = ref(5);
if (props.options && props.options.length > 0) {
  pageSize.value = Number(String(props.options[0]));
}

const page = ref(1);
const changePage = (value: number) => {
  page.value = value;
};

defineExpose({ page, pageSize, changePage });

const pageMax = computed(() => {
  return Number(props.total) / pageSize.value > 1 ? Math.ceil(Number(props.total) / pageSize.value) : 1;
});

const handleChangePageSize = () => {
  page.value = 1; // 同步更新当前页码为1
  nextTick(() => {
    emit('handleChangePageSize', pageSize.value, page.value);
  });
};

const handleChangePage = (index: number) => {
  if (index < 1 || index > pageMax.value) {
    return;
  }
  page.value = index;
  emit('handleChangePage', pageSize.value, page.value);
};

const getShow = (index: number) => {
  return page.value == index + 1 || page.value == index - 1 || page.value == index;
};
const getActive = (index: number) => {
  return page.value == index;
};

const isPrevDisabled = computed(() => {
  return page.value === 1;
});

const isPrevDoubleDisabled = computed(() => {
  return page.value === 1;
});

const isNextDisabled = computed(() => {
  return page.value === pageMax.value;
});

const isNextDoubleDisabled = computed(() => {
  return page.value === pageMax.value;
});
</script>

<style scoped>
@media (max-width: 640px) {
  .intro-y {
    flex-direction: column;
    align-items: stretch;
  }
  .flex-row-reverse {
    flex-direction: row-reverse;
  }
  .hidden-on-small-screens {
    display: none;
  }
}
</style>
