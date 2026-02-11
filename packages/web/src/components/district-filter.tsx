"use client";

import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";

type District = { name_en: string; slug: string };

export function DistrictFilter({
  districts,
  currentDistrict,
}: {
  districts: District[];
  currentDistrict?: string;
}) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
      <select
        value={currentDistrict ?? ""}
        onChange={(e) => {
          const slug = e.target.value;
          router.push(slug ? `/constituencies?district=${slug}` : "/constituencies");
        }}
        className="h-9 rounded-lg border border-border bg-background px-3 pr-8 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="">All Districts ({districts.length})</option>
        {districts.map((d) => (
          <option key={d.slug} value={d.slug}>
            {d.name_en}
          </option>
        ))}
      </select>
    </div>
  );
}
