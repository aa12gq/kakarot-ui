/**
 * 将字符串补充至指定长度
 * @param s 需要填充的字符串
 * @param n 填充的数字
 * @param lenght 需要的字符串长度
 * @returns 填充后的字符串
 */
const StringReplenishBeforeNumber = (
  s: string | undefined,
  n: number,
  lenght: number
): string => {
  if (!s || s === "") return "";
  if (s.length >= lenght) return s;
  if (lenght <= 0) return "";
  const len = lenght - s.length;
  for (let i = 0; i < len; i++) {
    s = `${n}${s}`;
  }
  return s;
};

/**
 * 将数字或数字字符串格式化为带千分位的字符串
 * @param value 要格式化的数字或数字字符串
 * @param decimals 保留几位小数，默认不保留小数
 * @param dec_point 小数点符号，默认“.”
 * @param thousands_sep 千分位符号，默认英文逗号
 * @returns 格式化后的字符串
 */
const formatWithThousandsSeparator = (
  value: number | string,
  decimals: number = 0,
  dec_point: string = ".",
  thousands_sep: string = ","
): string => {
  // 确保输入是一个有效的数字
  const number = Number(value);
  if (isNaN(number)) {
    return "无效的输入";
  }

  // 格式化小数部分
  const fixed = number.toFixed(decimals);
  // 分割整数和小数部分
  const parts = fixed.split(".");
  // 将整数部分分隔为每三位一个逗号
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousands_sep);
  // 如果有小数部分，加上小数点和小数
  const decimalPart = parts.length > 1 ? dec_point + parts[1] : "";
  // 返回结果
  return integerPart + decimalPart;
};

// 去除Markdown格式
function stripMarkdown(markdownText: string) {
  // 将Markdown链接转换为纯文本
  let text = markdownText.replace(/$$([^$$]+)\]\((.*?)\)/g, "$1");
  // 去除强调、加粗等Markdown语法
  text = text.replace(/__([\s\S]+?)__|[*_]{1,2}([\s\S]+?)[*_]{1,2}/g, "$1$2");
  // 去除代码块和行内代码
  text = text.replace(/```[\s\S]+?```|`[\s\S]+?`/g, "");
  // 去除图片 ，包括处理可选的标题
  text = text.replace(/!\[([^\]]+)]\(([^)]+)\)/g, "");
  // 去除HTML标签
  text = text.replace(/<[^>]*>/g, "");
  // 去除其他Markdown符号
  text = text.replace(/[#>+\-*~]/g, "");
  // 去除多余的空格
  text = text.replace(/\s+/g, " ");
  return text;
}

/**
 * Uint8Array转字符串
 * @param data Uint8Array
 * @returns 字符串
 */
function Uint8ArrayToString(data: Uint8Array): string {
  let str = "";
  for (let i = 0; i < data.length; i++) {
    str += String.fromCharCode(data[i]);
  }
  return str;
}

/**
 * 字符串转Uint8Array
 * @param str 字符串
 * @returns Uint8Array
 */
function StringToUint8Array(str: string): Uint8Array {
  const arr = [];
  for (let i = 0; i < str.length; i++) {
    arr.push(str.charCodeAt(i));
  }
  return new Uint8Array(arr);
}

export {
  StringReplenishBeforeNumber,
  formatWithThousandsSeparator,
  stripMarkdown,
  Uint8ArrayToString,
  StringToUint8Array,
};
