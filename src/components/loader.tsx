import { cn } from "../lib/cn";

const sizes = {
  sm: { dot: "size-1.5", gap: "gap-1" },
  md: { dot: "size-2", gap: "gap-1" },
  lg: { dot: "size-3", gap: "gap-2" },
};

const delays = [
  "[animation-delay:0ms]",
  "[animation-delay:250ms]",
  "[animation-delay:500ms]",
];

interface LoaderProps {
  className?: string;
  /** What screen readers hear. */
  label?: string;
  size?: keyof typeof sizes;
}

/** The Hooman Studio three-dot loader. */
function Loader({ size = "md", label = "Loading", className }: LoaderProps) {
  return (
    <span
      aria-label={label}
      className={cn("inline-flex items-center", sizes[size].gap, className)}
      role="status"
    >
      {delays.map((delay) => (
        <span
          className={cn(
            "motion-safe:animate-loader-dot bg-gray-950 opacity-10",
            sizes[size].dot,
            delay
          )}
          key={delay}
        />
      ))}
    </span>
  );
}

export type { LoaderProps };
export { Loader };
