import { cn } from "@/lib/utils";

interface PlaceholderImageProps {
  initials?: string;
  className?: string;
}

export function PlaceholderImage({ initials, className }: PlaceholderImageProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-xl bg-gradient-to-br from-surface via-surface-hover to-accent-blue/10 border border-border",
        className
      )}
    >
      {initials && (
        <span className="font-mono text-2xl font-bold text-text-tertiary">
          {initials}
        </span>
      )}
    </div>
  );
}
