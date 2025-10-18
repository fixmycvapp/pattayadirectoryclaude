import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), "PPP");
}

export function formatTime(time: string): string {
  return time;
}

export function formatPrice(price: number): string {
  if (price === 0) return "FREE";
  return `฿${price.toLocaleString()}`;
}