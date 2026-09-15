import Image from "next/image";
import logoIcon from "@/components/ui/Icons/bluettiLogo.svg";

/**
 * Starter list — swap for real logo assets whenever they're supplied; until
 * then this is a placeholder set the client asked us to seed and revise later.
 */
const TECH_PARTNER_NAMES = [
  "Google",
  "Microsoft",
  "Amazon Web Services",
  "Meta",
  "Apple",
  "NVIDIA",
  "OpenAI",
  "Anthropic",
  "IBM",
  "Salesforce",
  "Oracle",
  "Samsung",
  "Intel",
  "Qualcomm",
  "Tesla",
] as const;

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
              <div className="mt-8 inline-flex items-centerpy-2 text-xl font-semibold tracking-[0.25em] text-slate-200">
                <Image src={logoIcon} alt="Logo" width={260} height={62} />
              </div>
            </div>
            <div
              className="max-w-[828px] overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
              aria-label="Partner and distributor logos"
            >
              <div className="ba-logo-track flex w-max gap-3">
                {Array.from({ length: 2 }).map((_, trackIdx) => (
                  <div
                    key={trackIdx}
                    aria-hidden={trackIdx === 1}
                    className="grid grid-flow-col grid-rows-3 gap-3"
                  >
                    {TECH_PARTNER_NAMES.map((name) => (
                      <div
                        key={name}
                        className="flex w-[148px] items-center justify-center px-2 text-center"
                        style={{ aspectRatio: "148/76" }}
                      >
                        <span className="font-inter text-[20px] font-semibold leading-tight text-white/85">
                          {name}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
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
