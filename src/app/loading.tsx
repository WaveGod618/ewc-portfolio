export default function Loading() {
  return (
    <div className="grid gap-6">
      <div className="animate-pulse rounded-3xl border border-white/10 bg-white/5 p-10">
        <div className="h-5 w-48 rounded-full bg-white/10" />
        <div className="mt-4 h-10 w-80 rounded-full bg-white/10" />
      </div>
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            className="h-36 animate-pulse rounded-3xl border border-white/10 bg-white/5"
            key={index}
          />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,1fr)]">
        <div className="h-[420px] animate-pulse rounded-3xl border border-white/10 bg-white/5" />
        <div className="h-[420px] animate-pulse rounded-3xl border border-white/10 bg-white/5" />
      </div>
    </div>
  );
}
