import Badge from "./Badge";
import { DividerIslamic } from "@/components/common/IslamicPattern";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  badge: string;
  badgeVariant?: "maroon" | "gold" | "outline" | "muted";
  title: string | React.ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
  withDivider?: boolean;
}

export default function SectionHeader({
  badge,
  badgeVariant = "maroon",
  title,
  description,
  align = "center",
  className,
  withDivider = true,
}: SectionHeaderProps) {
  return (
    <div className={cn("max-w-3xl space-y-4", align === "center" ? "mx-auto text-center" : "text-left", className)}>
      <Badge variant={badgeVariant} className="mb-2">
        {badge}
      </Badge>
      <h2 className="text-3xl lg:text-[40px] font-bold tracking-tight leading-[1.15] text-foreground">
        {title}
      </h2>
      {description && (
        <p className={cn("text-[15px] lg:text-[17px] leading-relaxed text-muted-foreground", align === "center" ? "mx-auto" : "")}>
          {description}
        </p>
      )}
      {withDivider && align === "center" && <DividerIslamic className="mt-6" />}
    </div>
  );
}
