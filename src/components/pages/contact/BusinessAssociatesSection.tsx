import Image from "next/image";
import logoIcon from "@/components/ui/Icons/bluettiLogo.svg";
export function BusinessAssociatesSection() {
  return (
    <section>
      <div className="w-full">
        <div className="relative min-h-[414px] overflow-hidden px-[90px]">
          <Image
            src="/images/partner-station.png"
            alt="Business associates background"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-linear-to-r from-slate-950/90 via-blue-950/85 to-blue-900/60" />
          <div className="relative z-10 grid min-h-[414px] max-w-7xl mx-auto items-center gap-10 py-7 md:grid-cols-[1.1fr_1.9fr]">
            <div>
              <p className="text-base text-cyan-300">Business Associates</p>
              <h3 className="mt-2 text-3xl font-bold text-white">
                BLUETTI Official Distributor
              </h3>
              <div className="mt-8 inline-flex items-centerpy-2 text-xl font-semibold tracking-[0.25em] text-slate-200">
                <Image src={logoIcon} alt="Logo" width={260} height={62} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 max-w-[828px]">
              {Array.from({ length: 15 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-14 w-[146px] rounded-2xl border border-white/15 bg-white/8"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-hidden">
          <video
            className="h-auto w-full object-cover"
            src="/videos/solarWall.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
      </div>
    </section>
  );
}
