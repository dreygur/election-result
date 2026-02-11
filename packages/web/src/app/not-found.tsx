import Link from "next/link";
import { NotFoundIllustration } from "@/components/illustrations/not-found-illustration";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <NotFoundIllustration className="h-48 w-48" />
      <h1 className="mt-4 text-xl font-semibold">Page not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Go home
      </Link>
    </div>
  );
}
