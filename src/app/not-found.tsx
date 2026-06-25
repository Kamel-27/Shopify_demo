import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-32 text-center">
      <p className="text-6xl font-bold bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
        404
      </p>
      <h1 className="mt-4 text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-white/60">
        The product or page you’re looking for doesn’t exist.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:opacity-90"
      >
        Back to shop
      </Link>
    </div>
  );
}
