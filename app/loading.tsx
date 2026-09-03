export default function Loading() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          {/* Header */}
          <div className="h-4 w-28 rounded-full bg-zinc-900" />

          <div className="mt-6 h-12 max-w-xl rounded-2xl bg-zinc-900" />

          <div className="mt-3 h-5 max-w-md rounded-full bg-zinc-900" />

          {/* Content */}
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="overflow-hidden rounded-3xl border border-white/[0.04] bg-[#0b0b0b]">
              <div className="aspect-[16/10] bg-zinc-900" />

              <div className="space-y-4 p-6">
                <div className="h-3 w-24 rounded-full bg-zinc-900" />
                <div className="h-7 w-3/4 rounded-xl bg-zinc-900" />
                <div className="h-4 w-1/2 rounded-full bg-zinc-900" />
                <div className="mt-6 h-11 w-full rounded-xl bg-zinc-900" />
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/[0.04] bg-[#0b0b0b]">
              <div className="aspect-[16/10] bg-zinc-900" />

              <div className="space-y-4 p-6">
                <div className="h-3 w-24 rounded-full bg-zinc-900" />
                <div className="h-7 w-3/4 rounded-xl bg-zinc-900" />
                <div className="h-4 w-1/2 rounded-full bg-zinc-900" />
                <div className="mt-6 h-11 w-full rounded-xl bg-zinc-900" />
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/[0.04] bg-[#0b0b0b]">
              <div className="aspect-[16/10] bg-zinc-900" />

              <div className="space-y-4 p-6">
                <div className="h-3 w-24 rounded-full bg-zinc-900" />
                <div className="h-7 w-3/4 rounded-xl bg-zinc-900" />
                <div className="h-4 w-1/2 rounded-full bg-zinc-900" />
                <div className="mt-6 h-11 w-full rounded-xl bg-zinc-900" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}