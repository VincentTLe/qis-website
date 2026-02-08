import { cn } from "@/lib/utils";

type BadgeColor = "blue" | "green" | "purple" | "orange" | "cyan" | "gray";

interface BadgeProps {
  children: React.ReactNode;
  color?: BadgeColor;
  className?: string;
}

const colorMap: Record<BadgeColor, string> = {
  blue: "bg-accent-blue/10 text-accent-blue border-accent-blue/20",
  green: "bg-accent-green/10 text-accent-green border-accent-green/20",
  purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  gray: "bg-text-tertiary/10 text-text-secondary border-text-tertiary/20",
};

export function Badge({ children, color = "gray", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-wider",
        colorMap[color],
        className
      )}
    >
      {children}
    </span>
  );
}

// Map event types to badge colors
export function getEventBadgeColor(type: string): BadgeColor {
  const map: Record<string, BadgeColor> = {
    workshop: "blue",
    speaker: "purple",
    competition: "green",
    social: "orange",
    "info-session": "cyan",
  };
  return map[type] || "gray";
}
