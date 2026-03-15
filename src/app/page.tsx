import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-center text-white">
      <div>
        <h1 className="text-4xl font-bold">EasyLink Solar</h1>
        <p className="mt-3 text-slate-300">Open the complete page at /contact-us.</p>
        <Link
          href="/contact-us"
          className="mt-6 inline-flex rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950"
        >
          Go to Contact Us
        </Link>
      </div>
    </main>
  );
}
