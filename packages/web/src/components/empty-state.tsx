import { EmptyBoxIllustration } from "@/components/illustrations/empty-box";

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center py-10">
      <EmptyBoxIllustration className="h-32 w-32" />
      <p className="mt-3 text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
