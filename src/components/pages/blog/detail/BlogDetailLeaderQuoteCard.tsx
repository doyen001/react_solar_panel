import type { BlogDetailLeaderQuote } from "@/utils/constant";

type Props = {
  quote: BlogDetailLeaderQuote;
};

export function BlogDetailLeaderQuoteCard({ quote }: Props) {
  return (
    <blockquote className="blog-detail-gradient-card flex flex-col gap-[15.986px] rounded-[14px] px-[25.043px] pb-[25.043px] pt-[25.043px]">
      {quote.paragraphs.map((paragraph) => (
        <p
          key={paragraph.slice(0, 48)}
          className="font-source-sans text-[16px] font-normal italic leading-normal tracking-[-0.3125px] text-blog-detail-grad-text"
        >
          &ldquo;{paragraph}&rdquo;
        </p>
      ))}
      <footer className="font-source-sans text-[14px] font-bold leading-normal tracking-[-0.1504px] text-blog-detail-accent">
        {quote.attribution}
      </footer>
    </blockquote>
  );
}
