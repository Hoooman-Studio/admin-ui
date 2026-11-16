import {
  AvatarFallback,
  AvatarImage,
  Avatar as AvatarPart,
} from "@ui-sdk/react/avatar";
import { cn } from "../lib/cn";

const sizes = {
  sm: "au:size-6 au:text-2xs",
  md: "au:size-8 au:text-xs",
  lg: "au:size-10 au:text-sm",
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
        "au:border-alpha/10 au:relative au:inline-flex au:shrink-0 au:items-center au:justify-center au:overflow-hidden au:rounded-full au:border au:bg-gray-800 au:font-medium au:text-gray-50 au:select-none",
        sizes[size],
        className
      )}
    >
      {src ? (
        <AvatarImage
          alt={name}
          className="au:size-full au:object-cover"
          src={src}
        />
      ) : null}
      <AvatarFallback>
        <span aria-hidden="true">{initials(name)}</span>
        <span className="au:sr-only">{name}</span>
      </AvatarFallback>
    </AvatarPart>
  );
}

export type { AvatarProps };
export { Avatar };
