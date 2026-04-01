import Image from "next/image";

const products = [
  { name: "Solar Panels", image: "/images/home/product-solar-panels.png", icon: "/images/home/product-icon-solar.svg" },
  { name: "Batteries", image: "/images/home/product-batteries.png", icon: "/images/home/product-icon-battery.svg" },
  { name: "Inverters", image: "/images/home/product-inverters.png", icon: "/images/home/product-icon-inverter.svg" },
  { name: "Electric Vehicle Chargers", image: "/images/home/product-ev-chargers.png", icon: "/images/home/product-icon-ev.svg" },
  { name: "Heat Pumps", image: "/images/home/product-heat-pumps.png", icon: "/images/home/product-icon-heat.svg" },
  { name: "Emergency Backup", image: "/images/home/product-emergency.png", icon: "/images/home/product-icon-emergency.svg" },
  { name: "Outdoor Power", image: "/images/home/product-outdoor.png", icon: "/images/home/product-icon-outdoor.svg" },
  { name: "Portables", image: "/images/home/product-portables2.png", icon: "/images/home/product-icon-outdoor.svg" },
];

export function ProductsSection() {
  return (
    <section className="bg-faint/30 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-[1280px]">
        <div className="text-center">
          <h2 className="font-[family-name:var(--font-source-sans)] text-3xl font-bold tracking-[-0.9px] text-ink sm:text-4xl">
            Products
          </h2>
          <p className="mt-4 font-[family-name:var(--font-source-sans)] text-base text-muted">
            Complete range of solar and energy solutions for your home
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <div
              key={p.name}
              className="group relative h-[286px] overflow-hidden rounded-2xl bg-white shadow-[0_8px_32px_-8px_rgba(17,28,39,0.12)]"
            >
              <Image
                src={p.image}
                alt={p.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-xl bg-primary/20">
                  <Image src={p.icon} alt="" width={16} height={16} />
                </div>
                <span className="font-[family-name:var(--font-source-sans)] text-sm font-semibold tracking-[-0.35px] text-white">
                  {p.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
