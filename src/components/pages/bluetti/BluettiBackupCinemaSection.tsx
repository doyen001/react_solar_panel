import { BLUETTI_EP2000_BACKUP_CINEMA_SECTION } from "@/utils/constant";

export function BluettiBackupCinemaSection() {
  const { heading, body, footnote, videoSrcMp4, videoAriaLabel } =
    BLUETTI_EP2000_BACKUP_CINEMA_SECTION;

  return (
    <section
      className="relative isolate flex min-h-dvh w-full items-center justify-center overflow-hidden bg-black"
      aria-labelledby="bluetti-backup-cinema-heading"
    >
      <video
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-label={videoAriaLabel}
      >
        <source src={videoSrcMp4} type="video/mp4" />
      </video>

      <div
        className="pointer-events-none absolute inset-0 z-1 bg-bluetti-backup-cinema-overlay"
        aria-hidden
      />

      <div className="relative z-2 flex w-full max-w-4xl flex-col items-center px-4 py-16 text-center sm:px-6 lg:max-w-5xl">
        <h2 id="bluetti-backup-cinema-heading" className="bluetti-backup-cinema-heading">
          {heading}
        </h2>
        <p className="bluetti-backup-cinema-body">{body}</p>
        <p className="bluetti-backup-cinema-footnote">{footnote}</p>
      </div>
    </section>
  );
}
