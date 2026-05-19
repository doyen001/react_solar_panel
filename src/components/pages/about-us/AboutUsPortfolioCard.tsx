import Image from "next/image";

import Icon from "@/components/ui/Icons";
import type { AboutUsPortfolioItem } from "@/utils/constant";

type Props = {
  item: AboutUsPortfolioItem;
};

export function AboutUsPortfolioCard({ item }: Props) {
  return (
    <article className="about-us-portfolio-card-shell mx-auto w-full max-w-[407px] overflow-hidden rounded-[40px] p-[7px]">
      <div className="relative h-[536.818px] w-full overflow-hidden rounded-[16.759px]">
        <div className="relative h-[266.651px] w-full overflow-hidden rounded-tl-[35px] rounded-tr-[35px]">
          <Image
            src={item.imageSrc}
            alt={item.imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 407px"
          />
          <div className="absolute left-[14px] top-[14px] flex items-center gap-4">
            <span className="flex items-center gap-2">
              <span className="size-[7px] rounded-full bg-white/40" aria-hidden />
              <span className="size-[7px] rounded-full bg-white/40" aria-hidden />
            </span>
            <span className="inline-flex items-center gap-2 font-inter text-sm font-medium tracking-[0.36px] text-about-portfolio-card-category">
              <Icon name="AboutUsPortfolioCategory" className="size-4" />
              {item.category}
            </span>
          </div>
          <span className="absolute right-3 top-3 rounded bg-about-portfolio-card-date-bg px-2 py-1 font-inter text-xs font-bold leading-4 text-about-portfolio-card-date-text">
            {item.date}
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-[1px] top-[257.36px] rounded-bl-[35px] rounded-br-[35px] bg-about-portfolio-card-body-bg px-[22px] pb-6 pt-12">
          <h3 className="font-source-sans text-[23.941px] font-bold leading-normal tracking-[-1.1971px] text-about-portfolio-card-title">
            {item.title}
          </h3>
          <div className="mt-[15.562px] flex flex-col gap-[26.335px]">
            <p className="line-clamp-4 max-w-[324.403px] font-source-sans text-[19.153px] font-normal leading-normal tracking-[-1.1971px] text-about-portfolio-card-excerpt">
              {item.excerpt}
            </p>
            <div className="flex flex-col gap-[14.153px]">
              <div className="h-px w-full bg-about-portfolio-card-divider" />
              <div className="flex h-[38.291px] items-center justify-between">
                <div className="flex items-center gap-[14.352px]">
                  <div className="relative size-[38.291px] shrink-0 overflow-hidden rounded-[11.971px] bg-blog-card-avatar-fallback">
                    <Image
                      src={item.authorAvatarSrc}
                      alt={item.authorAvatarAlt}
                      fill
                      className="object-cover"
                      sizes="38px"
                    />
                  </div>
                  <span className="font-inter text-[16.759px] font-medium leading-[23.941px] tracking-[-0.18px] text-about-portfolio-card-author">
                    {item.authorName}
                  </span>
                </div>
                <span
                  aria-hidden
                  className="inline-flex size-6 items-center justify-center text-about-portfolio-card-arrow"
                >
                  <Icon name="BlogDetailViewAllArrow" className="size-3" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
