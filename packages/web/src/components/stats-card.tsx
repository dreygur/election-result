import { cn, formatNumber } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function StatsCard({
  label,
  value,
  description,
  icon: Icon,
  accentColor,
  className,
}: {
  label: string;
  value: number | string;
  description?: string;
  icon?: LucideIcon;
  accentColor?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border/50 bg-card p-3 sm:p-5 shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      {accentColor && (
        <div
          className="absolute left-0 top-0 h-full w-1 rounded-l-xl"
          style={{ backgroundColor: accentColor }}
        />
      )}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-muted-foreground truncate">
            {label}
          </p>
          <p className="mt-1 sm:mt-2 text-lg sm:text-2xl font-semibold tabular-nums tracking-tight truncate">
            {typeof value === "number" ? formatNumber(value) : value}
          </p>
          {description && (
            <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-muted-foreground truncate">{description}</p>
          )}
        </div>
        {Icon && (
          <div
            className="hidden sm:block rounded-lg p-2 shrink-0"
            style={accentColor ? { backgroundColor: `${accentColor}12` } : undefined}
          >
            <Icon
              className="h-4 w-4"
              style={accentColor ? { color: accentColor } : undefined}
            />
          </div>
        )}
      </div>
    </div>
  );
}
