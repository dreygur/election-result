export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#006A4E] border-r-[#F42A41]" />
          <div className="absolute inset-1.5 animate-spin rounded-full border-2 border-transparent border-b-[#D4A017]" style={{ animationDirection: "reverse", animationDuration: "0.8s" }} />
        </div>
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
