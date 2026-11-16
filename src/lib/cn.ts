import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Our classes carry the `au:` prefix (see src/styles.css); `text-input` is our form field font size.
const twMerge = extendTailwindMerge({
  prefix: "au",
  extend: { classGroups: { "font-size": [{ text: ["input"] }] } },
});

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export { cn };
