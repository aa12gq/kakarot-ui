import { Timestamp } from "@/stores/grpc/google/protobuf/timestamp";
import { NumberFormat } from "@intlify/core-base";
import dayjs from "dayjs";
import * as cn from "dayjs/locale/zh-cn";
import { boolean } from "yup";
export function TimestampFromDate(date: Date | undefined): any {
  if (!date) {
    return null;
  }
  if (isNaN(date.getTime())) {
    return null;
  }
  return Timestamp.fromDate(date);
}

export function DateFromTimestamp(ts: Timestamp): Date {
  return ts && Timestamp.toDate(ts);
}

// 格式化日期时间，包含年月日时分秒
export function getDateTimeTs(date: Timestamp | undefined, rule?: string): string {
  if (!date) return "";
  if (date.seconds === 0n && date.nanos === 0) return "";
  // 将 Timestamp 转换为 Date 对象
  const d = new Date(Number(date.seconds) * 1000 + Math.floor(date.nanos / 1000000));
  // 默认格式为年-月-日 时:分:秒
  const defaultFormat = 'YYYY-MM-DD HH:mm:ss';
  // 如果提供了规则，则按规则格式化，否则使用默认格式
  return dayjs(d).format(rule || defaultFormat);
}



export function getDaysInRange(startDate: Date, endDate: Date) {
  const days = [];

  for (
    let date = startDate;
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    days.push(formattedDate);
  }

  return days;
}

export const formatDateRule = "YYYY-MM-DD";

//获得时间 年月日 格式 日-月-年
export function getDays(date: Date | number, rule?: string) {
  if (rule && rule != "") {
    return dayjs(date)?.format(rule);
  }
  return dayjs(date)?.format(formatDateRule);
}

//根据Timestamp获得时间 年月日 格式 年-月-日
export function getDaysTs(date: Timestamp | undefined, rule?: string) {
  if (!date) return "";
  if (date.seconds === 0n && date.nanos === 0) return "";
  const d = Timestamp.toDate(date);
  if (rule && rule != "") {
    return dayjs(d)?.format(rule);
  }
  return dayjs(d)?.format(formatDateRule);
}

export function checkTS(a: Timestamp | undefined, b: Timestamp | undefined) {
  if (a && b) {
    // 目前只使用秒级别的ts
    return a.seconds - b.seconds > 0;
  } else if (a) {
    return true;
  } else {
    return false;
  }
}

const leftHalfYear = ["一月", "二月", "三月", "四月", "五月", "六月"];
const rightHalfYear = ["七月", "八月", "九月", "十月", "十一月", "十二月"];

export function getHalfYear(date: Date | number) {
  const month = dayjs(date).month() + 1;
  if (month <= 6) {
    return leftHalfYear;
  } else {
    return rightHalfYear;
  }
}

export function getDaysInMonthsForHalfYear(date: Date): number[] {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstMonth = month < 6 ? 0 : 6; // 0 表示 1 月，6 表示 7 月
  const lastMonth = firstMonth + 5; // 半年有 6 个月

  const daysInMonths: number[] = [];

  for (let i = firstMonth; i <= lastMonth; i++) {
    // 创建日期对象，将月份设为 i+1，并将日设为 0
    const d = new Date(year, i + 1, 0);
    // 获取日期对象中的日期，即当月天数
    daysInMonths.push(d.getDate());
  }

  return daysInMonths;
}

export function getDayZero(date: Date) {
  if (!date) {
    date = new Date();
  }
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return dayjs(today).format(formatDateRule);
}

export function getDayZeroByCurrent() {
  const today = new Date();
  return dayjs(today).format(formatDateRule);
}

/**
 * 将YYYY-MM-DD类型的字符串转为Date类型
 * @param dateString YYYY-MM-DD
 * @returns 转换后的Date类型
 */
export function parseDateString(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/**
 * 计算开始的时间到结束的时间相差多少年
 * @param startDate 开始的时间
 * @param endDate 结束的时间
 * @returns 年数
 */
export function calculateYearDifference(
  startDate?: Date,
  endDate?: Date
): string {
  if (!startDate || !endDate) {
    return "";
  }
  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();
  const yearDifference = endYear - startYear;

  return yearDifference.toString();
}

/**
 * 验证Timestamp格式是否正确
 * @param ts
 */
export function ValidateTimestamp(ts: Timestamp | undefined): boolean {
  if (!ts) {
    return false;
  }
  if (ts.nanos <= 0) {
    return false;
  }
  if (ts.seconds <= 0) {
    return false;
  }
  return true;
}

// getFullDateTime 获得完整的日期时间
export function getFullDateTime(date: Date | Timestamp | undefined): string {
  if (!date) {
    return "";
  }

  if (date instanceof Date) {
    // 日期对象是 Date 类型
    return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
  } else {
    // 假定日期对象是 Timestamp 类型
    const dateObj = DateFromTimestamp(date as Timestamp); // 使用类型断言
    return dayjs(dateObj).format("YYYY-MM-DD HH:mm:ss");
  }
}

/**
 * 检查对象是否为Timestamp
 * @param obj 要检查的对象
 * @returns 如果是Timestamp返回true，否则返回false
 */

function isTimestamp(obj: any): obj is Timestamp {
  return (
    obj &&
    typeof obj.seconds !== "undefined" &&
    typeof obj.nanos !== "undefined"
  );
}
/**
 * 根据给定的时间戳，返回当天的开始时间和结束时间的时间戳
 * @param timestamp number | undefined
 * @returns { start: number, end: number } 包含当天开始和结束时间的时间戳
 */
export function getDayStartEnd(timestamp: number | undefined) {
  // 如果 timestamp 未定义，则使用当前日期
  const date = new Date(timestamp ? timestamp * 1000 : Date.now());

  // 设置为当天开始时间（0点）
  const startOfDay =
    new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() /
    1000;
  // 设置为当天结束时间（23:59:59）
  const endOfDay =
    new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      23,
      59,
      59
    ).getTime() / 1000;

  return { start: startOfDay, end: endOfDay };
}
