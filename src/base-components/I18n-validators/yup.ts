import { Schema, ValidationError } from "yup";
import { ref, Ref, WatchSource, watch } from "vue";
import * as yup from "yup";

class RuleError {
  constructor(errors?: ValidationError[]) {
    if (errors) {
      this.errors = errors;
    } else {
      this.errors = [];
    }
  }

  errors: ValidationError[];
}

/**
 * 根据验证规则/模式及错误数组，返回或修改对应的errorRef, errorRef可用于vue模板的数据绑定.
 * @param schema 由yun.object()生成.
 * @param errors 验证产生的错误数组
 * @param errorRef 如果errorRef不为空,则更新errorRef并返回, 否则返回一个新的.
 */
const toSchemaErrors = <
  R extends yup.AnyObject,
  K extends keyof R,
  E extends { [key in K]: RuleError }
>(
  schema: yup.ObjectSchema<R>,
  errors: ValidationError[],
  errorRef?: Ref<any>
): Ref<E> => {
  let schemaErrors: Ref<any>;
  if (errorRef) {
    schemaErrors = errorRef;
  } else {
    schemaErrors = ref({});
  }
  Object.keys(schema.fields).forEach((k) => {
    schemaErrors.value[k] = new RuleError();
    errors.forEach((e) => {
      if (e.path == k) {
        schemaErrors.value[k].errors.push(e);
      }
    });
  });
  return schemaErrors;
};
/**
 * 监听formData, 根据验证规则/schema, 自动更新errorRef.
 * @param schema yum object
 * @param formData 需验证的表单数据.
 * @param errorRef 验证结果错误引用, 用于vue数据绑定.
 */
const autoWatch = <
  R extends yup.AnyObject,
  K extends keyof R,
  E extends { [key in K]: RuleError }
>(
  schema: yup.ObjectSchema<R>,
  formData: any,
  errorRef: Ref<E>
) => {
  watch(formData, () => {
    schema.validate(formData, { abortEarly: false }).then(
      () => {
        // 验证无错误，则清空之前的错误
        toSchemaErrors(schema, [], errorRef);
      },
      (err: ValidationError) => {
        // 更新error引用：w
        toSchemaErrors(schema, err.inner, errorRef);
      }
    );
  });
};

yup.addMethod(yup.string, "phone", function () {
  return this.test("phone", "手机号格式不正确", (value: string | undefined) => {
    if (!value) {
      return true; // 允许为空
    }
    return /^1([3-9]\d|5[012356789]|8[02356789])\d{8}$/.test(value);
  });
});

yup.setLocale({
  mixed: {
    required: (o:any) => `${o.label}为必填项`,
  },
  string: {
    min: (o:any) => `${o.label}不能少于${o.min}字符`,
    max: (o:any) => `${o.label}不能大于${o.max}字符`,
    // 验证手机号
    matches: (o:any) => `${o.label}格式不正确`,
  },
  number: {
    min: (o:any) => `${o.label}不能小于${o.min}`,
    max: (o:any) => `${o.label}不能大于${o.max}`,
    integer: (o:any) => `${o.label}必须是整数`,
  },
  date: {
    min: (o:any) => `${o.label}不能小于${o.min}`,
    max: (o:any) => `${o.label}不能大于${o.max}`,
  },
});
const extYup = { autoWatch, toSchemaErrors, ...yup };
export { extYup as yup, RuleError };
