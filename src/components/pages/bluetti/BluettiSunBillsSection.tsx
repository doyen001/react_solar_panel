import { BLUETTI_EP2000_SUN_BILLS_SECTION } from "@/utils/constant";

export function BluettiSunBillsSection() {
  const { heading, bodyIntro, bodyBold1, bodyMid, bodyBold2, footnote } =
    BLUETTI_EP2000_SUN_BILLS_SECTION;

  return (
    <section
      className="background-secondary-gradient w-full py-[8rem] sm:py-[14rem]"
      aria-labelledby="bluetti-sun-bills-heading"
    >
      <div className="container-large mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h2 id="bluetti-sun-bills-heading" className="bluetti-sun-bills-heading">
          {heading}
        </h2>
        <p className="bluetti-sun-bills-body">
          {bodyIntro}
          <strong>{bodyBold1}</strong>
          {bodyMid}
          <strong>{bodyBold2}</strong>*
        </p>
        <p className="bluetti-sun-bills-footnote">{footnote}</p>
      </div>
    </section>
  );
}
