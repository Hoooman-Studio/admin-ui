import {
  AvatarFallback,
  AvatarImage,
  Avatar as AvatarPart,
} from "@ui-sdk/react/avatar";
import { cn } from "../lib/cn";

const sizes = {
  sm: "size-6 text-2xs",
  md: "size-8 text-xs",
  lg: "size-10 text-sm",
};

interface AvatarProps {
  className?: string;
  /** The person's or team's name: the image's alt text, and the initials while it loads or if it fails. */
  name: string;
  size?: keyof typeof sizes;
  src?: string | null;
}

const whitespace = /\s+/u;

function initials(name: string) {
  return name
    .split(whitespace)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

/** A round picture of a person or team, with their initials as the fallback. */
function Avatar({ name, src, size = "md", className }: AvatarProps) {
  return (
    <AvatarPart
      className={cn(
        "border-alpha/10 relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border bg-gray-800 font-medium text-gray-50 select-none",
        sizes[size],
        className
      )}
    >
      {src ? (
        <AvatarImage alt={name} className="size-full object-cover" src={src} />
      ) : null}
      <AvatarFallback>
        <span aria-hidden="true">{initials(name)}</span>
        <span className="sr-only">{name}</span>
      </AvatarFallback>
    </AvatarPart>
  );
}

export type { AvatarProps };
export { Avatar };
