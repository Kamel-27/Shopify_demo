export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6 h-4 w-40 rounded skeleton" />
      <div className="grid gap-10 md:grid-cols-2">
        <div className="aspect-square rounded-2xl skeleton" />
        <div className="space-y-4">
          <div className="h-4 w-24 rounded skeleton" />
          <div className="h-9 w-3/4 rounded-xl skeleton" />
          <div className="h-7 w-32 rounded skeleton" />
          <div className="h-20 w-full rounded-xl skeleton" />
          <div className="h-12 w-full max-w-sm rounded-full skeleton" />
        </div>
      </div>
    </div>
  );
}
