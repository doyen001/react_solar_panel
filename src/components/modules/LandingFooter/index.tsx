import Image from "next/image";
import Link from "next/link";

import { LANDING_FOOTER_COLUMNS } from "@/utils/constant";

export function FooterSection() {
  return (
    <footer className="bg-gray-8 pb-6">
      <div className="mx-auto w-full px-4 pt-14 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[280px] w-full max-w-[1224px] flex-col justify-center rounded-3xl border border-sky-100 bg-white px-6 py-10 text-center shadow-sm footer-card">
          <h3 className="text-4xl font-bold tracking-tight text-slate-900">
            Ready to Take Control of Your Energy?
          </h3>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Join thousands of homeowners already saving with Easylink Solar and
            BLUETTI products.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button className="rounded-xl bg-linear-to-r from-fuchsia-500 to-red-400 px-7 py-3 text-sm font-semibold text-white">
              Get Your Quote
            </button>
            <button className="rounded-xl border border-sky-300 px-7 py-3 text-sm font-semibold text-slate-900">
              Contact Sales
            </button>
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-[1226px] gap-10 lg:grid-cols-[1.3fr_3fr] lg:px-6">
          <div>
            <div className="flex items-center gap-2">
              <Image
                src="/images/logo.webp"
                alt="EasyLink Solar"
                unoptimized
                width={40}
                height={40}
              />
              <p className="text-lg font-bold text-slate-950">EASYLINK SOLAR</p>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              Your Local Solar Energy Partner
            </p>
            <p className="text-sm text-slate-600">
              Authorised BLUETTI Distributor
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {LANDING_FOOTER_COLUMNS.map((column) => (
              <div key={column.title}>
                <h4 className="font-semibold text-slate-900">{column.title}</h4>
                <ul className="mt-3 grid gap-2 text-sm text-slate-600">
                  {column.items.map((item) => (
                    <li key={`${column.title}-${item.label}`}>
                      <Link
                        href={item.href}
                        className="transition hover:text-slate-900"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-slate-200 pt-4 text-sm text-slate-500 sm:flex-row sm:items-center lg:px-6">
          <p>© 2025 EasyLink Solar. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
