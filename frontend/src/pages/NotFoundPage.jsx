import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="text-center">
      <h1 className="text-5xl font-black">404</h1>
      <p className="mt-2 text-slate-600">Page not found.</p>
      <Link className="mt-6 inline-block rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white" to="/">
        Go Home
      </Link>
    </section>
  );
}
