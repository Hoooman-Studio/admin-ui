import { cn } from "../lib/cn";
import { useMessages } from "./messages";

const sizes = {
  sm: { dot: "au:size-1.5", gap: "au:gap-1" },
  md: { dot: "au:size-2", gap: "au:gap-1" },
  lg: { dot: "au:size-3", gap: "au:gap-2" },
};

// Inline, because the `animation` shorthand in `animate-loader-dot` would reset a delay class.
const delays = ["0ms", "250ms", "500ms"];

interface LoaderProps {
  className?: string;
  /** What screen readers hear. */
  label?: string;
  size?: keyof typeof sizes;
}

/** The Hooman Studio three-dot loader. */
function Loader({ size = "md", label, className }: LoaderProps) {
  const messages = useMessages();
  return (
    <span
      aria-label={label ?? messages.loading}
      className={cn(
        "au:inline-flex au:items-center",
        sizes[size].gap,
        className
      )}
      role="status"
    >
      {delays.map((delay) => (
        <span
          className={cn(
            "au:motion-safe:animate-loader-dot au:bg-gray-950 au:opacity-10 au:motion-reduce:opacity-60",
            sizes[size].dot
          )}
          key={delay}
          style={{ animationDelay: delay }}
        />
      ))}
    </span>
  );
}

export type { LoaderProps };
export { Loader };
