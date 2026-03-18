"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import searchIcon from "@/components/ui/Icons/search.svg";
import userIcon from "@/components/ui/Icons/user.svg";
import shopIcon from "@/components/ui/Icons/shop.svg";

const navItems = [
  { label: "Bluetti", link: "/bluetti" },
  { label: "Products", link: "/products" },
  { label: "Customers", link: "/customers" },
  { label: "Installers", link: "/installers" },
  { label: "Blog", link: "/blog" },
  { label: "About Us", link: "/about-us" },
  { label: "Contact", link: "/contact-us" },
];

export function Header() {
  const pathname = usePathname();
  return (
    <header className="fixed top-0 z-30 w-full bg-white/75 backdrop-blur-md">
      <div className="mx-auto flex h-20 w-full max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold text-slate-900 sm:text-base"
        >
          <Image
            src="/images/logo.png"
            alt="EasyLink Solar"
            width={40}
            height={40}
          />
          <span>EASYLINK SOLAR</span>
        </Link>

        <nav className="hidden items-center gap-4 text-sm text-slate-800 lg:flex xl:gap-5">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className={`transition hover:text-cyan-700 ${pathname === item.link ? "text-secondary" : "text-slate-800"}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex xl:gap-3">
          <div className="flex items-center gap-2 xl:gap-3">
            <button
              type="button"
              aria-label="Search"
              className="inline-flex size-9 items-center justify-center rounded-full text-slate-900 transition hover:bg-slate-900/10"
            >
              <Image src={searchIcon} alt="Search" width={16} height={16} />
            </button>
            <button
              type="button"
              aria-label="Account"
              className="inline-flex size-9 items-center justify-center rounded-full text-slate-900 transition hover:bg-slate-900/10"
            >
              <Image src={userIcon} alt="Account" width={16} height={16} />
            </button>
            <button
              type="button"
              aria-label="Cart"
              className="relative inline-flex size-9 items-center justify-center rounded-full text-slate-900 transition hover:bg-slate-900/10"
            >
              <Image src={shopIcon} alt="Cart" width={26} height={24} />
            </button>

            <button className="rounded-xl border-2 border-cyan-500 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-cyan-50 xl:px-5">
              Contact Us
            </button>
            <button className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500 xl:px-5">
              Buy Now
            </button>
          </div>
          <p className="hidden text-[11px] font-medium tracking-wide text-slate-800 2xl:block">
            Powered by{" "}
            <span className="font-semibold text-cyan-600">BLUETTI</span>
          </p>
        </div>

        <details className="relative lg:hidden">
          <summary className="cursor-pointer rounded-md border border-slate-400/40 px-3 py-2 text-xs font-semibold text-slate-900 marker:content-['']">
            Menu
          </summary>
          <div className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-slate-950/95 p-3 shadow-2xl">
            <div className="mb-2 flex flex-col gap-2">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.link}
                  className="rounded-md px-2 py-1 text-sm text-white/90 hover:bg-white/10"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="grid gap-2">
              <button className="rounded-md border border-cyan-300/80 px-3 py-2 text-xs font-semibold text-cyan-200">
                Contact Us
              </button>
              <button className="rounded-md bg-cyan-400 px-3 py-2 text-xs font-semibold text-slate-950">
                Buy Now
              </button>
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
