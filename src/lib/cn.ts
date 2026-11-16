import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// `text-input` is the form field font size token (see styles/styles.css).
const twMerge = extendTailwindMerge({
  extend: { classGroups: { "font-size": [{ text: ["input"] }] } },
});

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export { cn };
