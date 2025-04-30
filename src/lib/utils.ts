import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getEventColor = (index: number, isSelected: boolean) => {
  const colors = [
    "rgba(66, 133, 244, 0.8)", // Blue
    "rgba(219, 68, 55, 0.8)", // Red
    "rgba(15, 157, 88, 0.8)", // Green
    "rgba(244, 160, 0, 0.8)", // Yellow
    "rgba(171, 71, 188, 0.8)", // Purple
  ];

  if (isSelected) {
    return colors[index % colors.length].replace("0.8", "1");
  }

  return colors[index % colors.length];
};
