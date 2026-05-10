import { FIRMWARE_PAGE } from "@/utils/constant";

export function FirmwarePageSection() {
  return (
    <section>
      <div className="mx-auto w-full max-w-[1224px] px-4 pt-36 sm:px-6 lg:px-10 lg:pt-40">
        <div className="mx-auto w-full max-w-[720px]">
          <h1 className="font-source-sans text-center text-4xl font-bold tracking-tight text-firmware-heading lg:text-5xl lg:leading-[1.15]">
            {FIRMWARE_PAGE.title}
          </h1>
          <div className="mt-10 space-y-4 lg:mt-12">
            {FIRMWARE_PAGE.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="text-left font-source-sans text-base leading-[1.75] text-firmware-body"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
