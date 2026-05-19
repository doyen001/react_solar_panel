import Image from "next/image";

import Icon from "@/components/ui/Icons";
import type { BlogDetailFeaturedQuote as FeaturedQuote } from "@/utils/constant";

type Props = {
  quote: FeaturedQuote;
};

export function BlogDetailFeaturedQuote({ quote }: Props) {
  return (
    <figure className="flex">
      <div
        aria-hidden
        className="blog-detail-featured-quote-accent w-[3.996px] shrink-0 self-stretch rounded-l-[16px]"
      />
      <blockquote className="blog-detail-gradient-card relative min-w-0 flex-1 overflow-hidden rounded-br-[16px] rounded-tr-[16px] px-[40px] py-[40px] shadow-[0_20px_12.5px_rgba(0,0,0,0.1),0_8px_5px_rgba(0,0,0,0.1)]">
        <Icon
          name="BlogDetailQuote"
          className="mb-[16px] size-[31.988px] text-primary"
        />
        <p className="max-w-[616px] font-source-sans text-[20px] font-medium italic leading-normal tracking-[0.0703px] text-blog-detail-grad-text sm:text-[24px]">
          {quote.quote}
        </p>
        <figcaption className="mt-[24px] flex items-center gap-[11.989px]">
          <div className="relative size-[39.997px] shrink-0 overflow-hidden rounded-full bg-blog-detail-grad-text">
            <Image
              src={quote.avatarSrc}
              alt={quote.avatarAlt}
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
          <div>
            <p className="font-source-sans text-[14px] font-bold uppercase leading-normal tracking-[0.5496px] text-blog-detail-grad-text">
              {quote.name}
            </p>
            <p className="mt-[2px] font-source-sans text-[12px] font-bold leading-normal text-blog-detail-accent">
              {quote.role}
            </p>
          </div>
        </figcaption>
      </blockquote>
    </figure>
  );
}
