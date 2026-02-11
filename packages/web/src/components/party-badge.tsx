import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function PartyBadge({
  name,
  slug,
  shortName,
}: {
  name: string | null;
  slug: string | null;
  shortName: string | null;
}) {
  const label = shortName || name || "Independent";
  if (!slug) return <Badge variant="secondary">{label}</Badge>;
  return (
    <Link href={`/parties/${slug}`}>
      <Badge variant="secondary" className="hover:bg-muted-foreground/20">
        {label}
      </Badge>
    </Link>
  );
}
