import dayjs from "dayjs";
import Litepicker from "litepicker";
import type{LitepickerProps, LitepickerEmit, LitepickerElement} from "./Litepicker.vue";

interface Picker extends Litepicker {
}

const getDateFormat = (format: string | undefined) => {
  return format !== undefined ? format : "D MMM, YYYY";
};

const setValue = (props: LitepickerProps, emit: LitepickerEmit) => {
  const format = getDateFormat(props.options?.format);
  if (!props.modelValue.length) {
    let date = dayjs().format(format);
    date +=
      !props.options?.singleMode && props.options?.singleMode !== undefined
        ? ` ${props.options.delimiter ? props.options.delimiter : "-"} ` + dayjs().add(1, "month").format(format)
        : "";
    console.log(date)
    emit("update:modelValue", date);
  }
};

const init = (
  el: LitepickerElement,
  props: LitepickerProps,
  emit: LitepickerEmit
) => {
  const format = getDateFormat(props.options?.format);
  el.litePickerInstance = new Litepicker({
    ...props.options,
    element: el,
    format: format,
    setup: (picker: Picker) => {
      if (true) {
        picker.on("selected", (startDate, endDate) => {
          let date = dayjs(startDate.dateInstance).format(format);
          if (endDate) {
            date += ` ${props.options.delimiter ? props.options.delimiter : "-"} ${dayjs(endDate.dateInstance).format(format)}`
          }
          emit("update:modelValue", date);
          emit("onConfirm", startDate, endDate)
        });
      }
    },
  });
};

const reInit = (
  el: LitepickerElement,
  props: LitepickerProps,
  emit: LitepickerEmit
) => {
  el.litePickerInstance.destroy();
  init(el, props, emit);
};

export { setValue, init, reInit };
