import Image from "next/image";

const contactItems = [
  { label: "Mobile", value: "04 818 575 08" },
  { label: "Phone", value: "+61 2 9909 6740" },
  { label: "Email", value: "sales@easylinksolar.com.au" },
  { label: "Website", value: "www.easylinksolar.com.au" },
];

export function SendUsAndPartnerSection() {
  return (
    <section className="relative mx-auto mt-[-120px] w-full max-w-7xl px-4 sm:px-6">
      <div className="overflow-hidden rounded-3xl border border-cyan-200/20 shadow-[0_20px_60px_rgba(2,8,23,0.4)]">
        <div className="grid lg:grid-cols-2">
          <div className="relative overflow-hidden p-6 text-white sm:p-10">
            <Image
              src="/images/partner-station.png"
              alt="Blue circuit style background"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,23,41,0.9)_0%,rgba(5,175,209,0.2)_100%)]" />
            <div className="relative z-10">
              <h2 className="text-4xl font-bold tracking-tight">
                Send us a message
              </h2>
              <p className="mt-2 text-sm text-slate-200">
                Fill out the form below and we&apos;ll get back to you shortly.
              </p>

              <form className="mt-8 grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-200">
                    First Name
                  </span>
                  <input
                    className="contact-input"
                    placeholder="Enter your first name"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-200">
                    Last Name
                  </span>
                  <input
                    className="contact-input"
                    placeholder="Enter your last name"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-200">
                    Mobile
                  </span>
                  <input
                    className="contact-input"
                    placeholder="Enter your mobile number"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-200">
                    Email
                  </span>
                  <input
                    className="contact-input"
                    placeholder="Enter your email"
                  />
                </label>
                <label className="grid gap-2 sm:col-span-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-200">
                    Address
                  </span>
                  <input
                    className="contact-input"
                    placeholder="Enter your address"
                  />
                </label>
                <div className="pt-2 sm:col-span-2">
                  <button className="rounded-xl bg-cyan-400 px-8 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300">
                    SUBMIT REQUEST
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-10">
            <h3 className="text-4xl font-bold tracking-tight text-slate-950">
              Contact Information
            </h3>
            <div className="mt-8 grid gap-5">
              {contactItems.map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <span className="inline-flex size-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                    {item.label.charAt(0)}
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {item.label}
                    </p>
                    <p className="font-semibold text-slate-800">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 mb-[115px] grid min-h-[470px] items-center overflow-hidden rounded-3xl bg-ink lg:grid-cols-2">
        <div className="relative min-h-[280px] self-stretch lg:min-h-[470px]">
          <Image
            src="/images/business-pattern.png"
            alt="Solar and EV partner station"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex min-h-[470px] items-center p-7 sm:p-10">
          <div>
            <h3 className="text-4xl font-bold tracking-tight text-white">
              Partner With Us
            </h3>
            <p className="mt-3 max-w-xl text-slate-300">
              Are you an installer or distributor? Join our network to access
              premium products, better pricing, and our dedicated installer
              platform.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-cyan-300">Installers</p>
                <p className="mt-1 text-sm text-slate-300">
                  Expand your business with our leads and tools.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-yellow-300">Distributors</p>
                <p className="mt-1 text-sm text-slate-300">
                  Exclusive territory and volume pricing.
                </p>
              </div>
            </div>
            <button
              type="button"
              className="cursor-pointer mt-6 rounded-xl bg-cyan-400 px-7 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-300"
            >
              Become a Partner
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
