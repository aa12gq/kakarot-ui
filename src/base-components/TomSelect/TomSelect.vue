<script setup lang="ts">
import _ from "lodash";
import {setValue, init, updateValue, optionValue} from "./tom-select";
import type {TomSettings, RecursivePartial} from "tom-select/src/types/index";
import type TomSelectPlugin from "tom-select";
import {
  type SelectHTMLAttributes,
  withDefaults,
  computed,
  onMounted,
  inject,
  ref,
} from "vue";

export interface TomSelectElement extends HTMLSelectElement {
  TomSelect: TomSelectPlugin;
}

export interface TomSelectProps extends SelectHTMLAttributes {
  modelValue: optionValue;
  options?: RecursivePartial<TomSettings>;
  refKey?: string;
}

export interface TomSelectEmit {
  (e: "update:modelValue", value: optionValue): void;

  (e: "optionAdd", value: optionValue): void;
}

export type ProvideTomSelect = (el: TomSelectElement) => void;

const props = withDefaults(defineProps<TomSelectProps>(), {});

const emit = defineEmits<TomSelectEmit>();

const tomSelectRef = ref<TomSelectElement>();

// Compute all default options
const computedOptions = computed(() => {
  let options: TomSelectProps["options"] = {
    plugins: {
      dropdown_input: {},
      ...props.options?.plugins,
    },
  };

  if (Array.isArray(props.modelValue)) {
    options = {
      persist: false,
      create: true,
      onDelete: function (values: optionValue[]) {
        return confirm(
            values.length > 1
                ? "确定删除此" +
                values.length +
                " 项吗?"
                : '确定删除 "' + values[0] + '"?'
        );
      },
      plugins: {
        remove_button: {
          title: "删除此项",
        },
        ...options.plugins,
      },
    };
  }
  options['render'] = {
    no_results: function (data: any, escape: any) {
      return '<div class="no-results">未搜索到: "' + escape(data.input) + '"</div>';
    }
  };
  options['placeholder'] = '请选择';
  Object.assign(options, props.options);
  return options;
});

const vSelectDirective = {
  mounted(el: TomSelectElement) {
    // Unique attribute
    el.setAttribute("data-id", "_" + Math.random().toString(36).substr(2, 9));

    // Clone the select element to prevent tom select remove the original element
    const clonedEl = el.cloneNode(true) as TomSelectElement;

    // Save initial classnames
    const classNames = el?.getAttribute("class");
    classNames && clonedEl.setAttribute("data-initial-class", classNames);

    // Hide original element
    el?.parentNode && el?.parentNode.appendChild(clonedEl);
    el.setAttribute("hidden", "true");

    // Initialize tom select
    setValue(clonedEl, props);
    init(el, clonedEl, props, computedOptions.value, emit);
  },
  updated(el: TomSelectElement) {
    const clonedEl = document.querySelectorAll(
        `[data-id='${el.getAttribute("data-id")}'][data-initial-class]`
    )[0] as TomSelectElement;
    if (!clonedEl) {
      return;
    }
    const value = props.modelValue;
    updateValue(el, clonedEl, value, props, computedOptions.value, emit);
  },
};

const bindInstance = (el: TomSelectElement) => {
  if (props.refKey) {
    const bind = inject<ProvideTomSelect>(`bind[${props.refKey}]`);
    if (bind) {
      bind(el);
    }
  }
};

onMounted(() => {
  if (tomSelectRef.value) {
    bindInstance(tomSelectRef.value);
  }
});
</script>

<template>
  <select
      ref="tomSelectRef"
      :value="props.modelValue"
      :disabled="props['disabled']"
      @change="
      (event) => {
        emit('update:modelValue', (event.target as HTMLSelectElement).value);
      }
    "
      v-select-directive
      class="tom-select"
  >
    <slot></slot>
  </select>
</template>
