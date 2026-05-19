import { ABOUT_US_PAGE } from "@/utils/constant";

export function AboutUsMissionSection() {
  return (
    <section className="relative min-h-[782px] w-full overflow-hidden py-16 lg:py-0 lg:min-h-[782px]">
      <video
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-label={ABOUT_US_PAGE.mission.vidoSrc}
      >
        <source src={ABOUT_US_PAGE.mission.vidoSrc} type="video/mp4" />
      </video>
      <div className="relative z-1 mx-auto flex w-full max-w-[1260px] flex-col items-center gap-10 px-4 py-10 sm:px-6 lg:flex-row lg:items-start lg:justify-center lg:gap-[120px] lg:px-[88px] lg:pt-[398px]">
        {ABOUT_US_PAGE.mission.cards.map((card) => (
          <article
            key={card.title}
            className="flex min-h-[328px] w-full max-w-[572px] flex-col justify-center rounded-[60px] bg-about-mission-card-bg px-8 py-10 sm:px-12 lg:px-14"
          >
            <h2 className="mb-4 font-source-sans text-[32px] font-semibold leading-normal tracking-[-0.4px] text-about-mission-card-title sm:text-[40px]">
              {card.title}
            </h2>
            <div className="font-source-sans text-lg font-normal leading-normal tracking-[-0.4395px] text-about-mission-card-body sm:text-[22px]">
              {card.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
