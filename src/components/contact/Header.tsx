import Image from "next/image";
import Link from "next/link";
import searchIcon from "@/components/ui/Icons/search.svg";
import userIcon from "@/components/ui/Icons/user.svg";
import shopIcon from "@/components/ui/Icons/shop.svg";

const navItems = [
  "Bluetti",
  "Products",
  "Customers",
  "Installers",
  "Blog",
  "About Us",
  "Contact",
];

export function Header() {
  return (
    <header className="top-0 z-30 w-full bg-white/75 fixed">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/contact-us"
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

        <nav className="hidden items-center gap-5 text-sm text-slate-800 lg:flex">
          {navItems.map((item) => (
            <a key={item} href="#" className="transition hover:text-cyan-700">
              {item}
            </a>
          ))}
        </nav>

        <div className="hidden flex-col items-end gap-1 xl:flex">
          <div className="flex items-center gap-3">
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

            <button className="rounded-xl border-2 border-cyan-500 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-cyan-50">
              Contact Us
            </button>
            <button className="rounded-xl bg-cyan-400 px-5 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500">
              Buy Now
            </button>
          </div>
          <p className="text-[11px] font-medium tracking-wide text-slate-800">
            Powered by{" "}
            <span className="font-semibold text-cyan-600">BLUETTI</span>
          </p>
        </div>

        <details className="relative md:hidden">
          <summary className="cursor-pointer rounded-md border border-slate-400/40 px-3 py-2 text-xs font-semibold text-slate-900 marker:content-['']">
            Menu
          </summary>
          <div className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-slate-950/95 p-3 shadow-2xl">
            <div className="mb-2 flex flex-col gap-2">
              {navItems.map((item) => (
                <a
                  key={item}
                  href="#"
                  className="rounded-md px-2 py-1 text-sm text-white/90 hover:bg-white/10"
                >
                  {item}
                </a>
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
