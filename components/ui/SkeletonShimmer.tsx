function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`shimmer-sweep bg-[var(--surface-700)] rounded-[10px] ${className}`} />
  );
}

export function SkeletonStatCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-[120px]" />
      ))}
    </div>
  );
}

export function SkeletonCallTable() {
  return (
    <div className="card-surface p-0 overflow-hidden">
      <Skeleton className="h-[50px] rounded-b-none" />
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="px-4 py-3 border-t border-[var(--surface-600)]">
          <Skeleton className="h-5 w-full" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonAgentList() {
  return (
    <div className="space-y-1 p-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-[60px]" />
      ))}
    </div>
  );
}

export function SkeletonAgentDetail() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex gap-4">
        <Skeleton className="h-14 w-14 rounded-[10px]" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-[100px]" />
        <Skeleton className="h-[100px]" />
      </div>
      <Skeleton className="h-[200px]" />
    </div>
  );
}
