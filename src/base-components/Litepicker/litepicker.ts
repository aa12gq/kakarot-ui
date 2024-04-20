import dayjs from 'dayjs';
import Litepicker from 'litepicker';
import type { LitepickerProps, LitepickerEmit, LitepickerElement } from './Litepicker.vue';
import { useElementBounding, useWindowSize, watchOnce } from '@vueuse/core';
import { boolean } from 'yup';
import polarCreator from 'echarts/types/src/coord/polar/polarCreator';
import { watch } from 'vue';

interface Picker extends Litepicker {}

const getDateFormat = (format: string | undefined) => {
  return format !== undefined ? format : 'D MMM, YYYY';
};

const setValue = (props: LitepickerProps, emit: LitepickerEmit) => {
  const format = getDateFormat(props.options?.format);
  if (!props.modelValue.length) {
    let date = dayjs().format(format);
    date += !props.options?.singleMode && props.options?.singleMode !== undefined ? ` ${props.options.delimiter ? props.options.delimiter : '-'} ` + dayjs().add(1, 'month').format(format) : '';
    emit('update:modelValue', date);
  }
};

function positionFollow(picker: Picker, el: LitepickerElement) {
  let pickerEl: HTMLElement | null = null;
  const { left, bottom } = useElementBounding(el);
  const windowSize = useWindowSize();
  // y轴跟随
  watch(
    bottom,
    value => {
      if (pickerEl) {
        pickerEl.style.top = `${value}px`;
      }
    },
    {
      flush: 'sync',
    }
  );
  const getLeft = (originLeft: number) => {
    const pSize = useElementBounding(pickerEl);
    let leftValue = originLeft;
    const right = pSize.width.value + originLeft;
    if (right > windowSize.width.value) {
      leftValue = leftValue - (right - windowSize.width.value);
    }
    return leftValue;
  };
  // x轴跟随
  watch(
    left,
    value => {
      if (pickerEl) {
        const leftValue = getLeft(value);
        pickerEl.style.left = `${leftValue}px`;
      }
    },
    {
      flush: 'sync',
    }
  );
  picker.on('hide', () => {
    if (pickerEl) {
      pickerEl = null;
    }
  });
  picker.on('show', () => {
    if (pickerEl) {
      // render pickerEl替换后ref更新没这么快，需要在此获取一次
      const pSize = useElementBounding(pickerEl);
      let leftValue = left.value;
      const right = pSize.width.value + left.value;
      if (right > windowSize.width.value) {
        leftValue = leftValue - (right - windowSize.width.value);
      }
      pickerEl.style.left = `${leftValue}px`;
    }
  });
  picker.on('render', ui => {
    pickerEl = ui;
  });
}

const init = (
  el: LitepickerElement,
  props: LitepickerProps,
  emit: LitepickerEmit,
  option?: {
    positionFollow?: boolean;
  }
) => {
  const format = getDateFormat(props.options?.format);
  el.litePickerInstance = new Litepicker({
    ...props.options,
    element: el,
    format: format,
    setup: (picker: Picker) => {
      // 显示选择时间组件页面时动态跟随el组件的位置
      if (option && option.positionFollow) {
        positionFollow(picker, el);
      }
      if (true) {
        picker.on('selected', (startDate, endDate) => {
          let date = dayjs(startDate.dateInstance).format(format);
          if (endDate) {
            date += ` ${props.options.delimiter ? props.options.delimiter : '-'} ${dayjs(endDate.dateInstance).format(format)}`;
          }
          emit('update:modelValue', date);
          emit('onConfirm', startDate, endDate);
        });
      }
    },
  });
};

const reInit = (
  el: LitepickerElement,
  props: LitepickerProps,
  emit: LitepickerEmit,
  option?: {
    positionFollow?: boolean;
  }
) => {
  el.litePickerInstance.destroy();
  init(el, props, emit, option);
};

export { setValue, init, reInit };
