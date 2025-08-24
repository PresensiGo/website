import { clsx, type ClassValue } from "clsx";
import { isAfter, startOfMinute } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const checkIsAfter = (date1: string, date2: string): boolean => {
  return isAfter(
    startOfMinute(new Date(date1)),
    startOfMinute(new Date(date2))
  );
};
