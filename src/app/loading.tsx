export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-6">
      <div className="py-20 text-center sm:py-28">
        <div className="mx-auto h-6 w-44 rounded-full skeleton" />
        <div className="mx-auto mt-6 h-12 w-2/3 max-w-2xl rounded-2xl skeleton" />
        <div className="mx-auto mt-4 h-5 w-1/2 max-w-md rounded-full skeleton" />
      </div>
      <div className="grid grid-cols-2 gap-4 py-16 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-white/10"
          >
            <div className="aspect-square skeleton" />
            <div className="space-y-2 p-4">
              <div className="h-4 w-2/3 rounded skeleton" />
              <div className="h-4 w-1/3 rounded skeleton" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
