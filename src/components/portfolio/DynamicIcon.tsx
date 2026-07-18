/**
 * Renders a lucide-react icon by its name string, so content stored as JSON
 * can reference icons without importing components. Falls back to `Sparkles`.
 */
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

export function DynamicIcon({
  name,
  className,
}: {
  name?: string;
  className?: string;
}) {
  const key = (name ?? "Sparkles") as keyof typeof Icons;
  const Cmp = (Icons[key] as LucideIcon | undefined) ?? Icons.Sparkles;
  return <Cmp className={className} />;
}
