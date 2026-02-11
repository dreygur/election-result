import type { Metadata } from "next";
import { SearchView } from "@/views/search-view";

export const metadata: Metadata = {
  title: "Search",
  description:
    "Search constituencies, candidates, and parties from the 13th Bangladesh National Parliament Election.",
};

export default function SearchPage() {
  return <SearchView />;
}
