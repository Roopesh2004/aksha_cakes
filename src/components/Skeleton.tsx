export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-primary-dark/10 dark:bg-primary-light/10 ${className}`}
    />
  );
}

export function CakeCardSkeleton() {
  return (
    <div className="rounded-2xl border border-primary/10 bg-white/40 dark:bg-card-dark/40 p-4 shadow-sm space-y-4">
      <Skeleton className="aspect-square w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-9 w-1/3 rounded-full" />
      </div>
    </div>
  );
}
