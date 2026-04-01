import Image from "next/image";

const features = [
  {
    icon: "/images/home/hero-feature-sun.svg",
    title: "Solar Generation",
    sub: "Harness the sun",
  },
  {
    icon: "/images/home/hero-feature-bolt.svg",
    title: "Smart Storage",
    sub: "EP760 & EP2000",
  },
  {
    icon: "/images/home/hero-feature-home.svg",
    title: "Home Power",
    sub: "24/7 backup",
  },
  {
    icon: "/images/home/hero-feature-ev.svg",
    title: "EV Ready",
    sub: "Charge overnight",
  },
  {
    icon: "/images/home/hero-feature-shield.svg",
    title: "Dual Core Safety Guard",
    sub: "Advanced protection",
  },
];

export function FeatureBarOfHero() {
  return (
    <div className="hidden gap-[15px] overflow-x-auto pb-1 md:flex">
      {features.map((f) => (
        <div
          key={f.title}
          className="flex shrink-0 items-center gap-4 rounded-[11px] border border-gray-7/50 bg-surface-50/60 px-4 py-3 backdrop-blur-[11px]"
          style={{ width: 247, height: 70 }}
        >
          <div
            className="flex size-[38px] items-center justify-center rounded-lg"
            style={{
              backgroundImage:
                "linear-gradient(135deg, var(--color-gold) 0%, color-mix(in srgb, var(--color-gold) 80%, transparent) 100%)",
            }}
          >
            <Image src={f.icon} alt="" width={19} height={19} />
          </div>
          <div>
            <p className="font-source-sans text-sm font-semibold text-slate-ink">
              {f.title}
            </p>
            <p className="font-source-sans text-xs text-slate-ink/60">
              {f.sub}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
