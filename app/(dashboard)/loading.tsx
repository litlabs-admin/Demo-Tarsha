export default function Loading() {
  return (
    <div className="space-y-6 p-6">
      <div className="h-7 w-52 rounded-lg shimmer-sweep" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl shimmer-sweep" />
        ))}
      </div>
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="h-80 flex-1 rounded-xl shimmer-sweep" />
        <div className="h-80 w-full rounded-xl shimmer-sweep lg:w-[280px]" />
      </div>
    </div>
  );
}
