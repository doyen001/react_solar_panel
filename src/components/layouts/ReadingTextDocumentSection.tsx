/**
 * Centered title + left-aligned body paragraphs for marketing / legal reading pages.
 */
export type ReadingTextDocumentSectionProps = {
  title: string;
  paragraphs: readonly string[];
  titleClassName: string;
  bodyClassName: string;
};

export function ReadingTextDocumentSection({
  title,
  paragraphs,
  titleClassName,
  bodyClassName,
}: ReadingTextDocumentSectionProps) {
  return (
    <section>
      <div className="pt-30 md:pt-36">
        <h1
          className={`mb-10 text-center font-source-sans text-4xl font-bold leading-tight tracking-tight md:mb-12 lg:text-5xl ${titleClassName}`}
        >
          {title}
        </h1>
        <div className="space-y-4">
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className={`text-left font-source-sans text-base leading-[1.75] ${bodyClassName}`}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
