import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
TimeAgo.setDefaultLocale(en.locale);
TimeAgo.addLocale(en);

export function timeAgoFormatter(date: Date) {
  const timeAgo = new TimeAgo("en-US");
  return timeAgo.format(date);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
