import { BLOG_PAGE } from "@/utils/constant";

export function BlogHeroSection() {
  return (
    <header className="mx-auto flex w-full max-w-[609px] flex-col items-center text-center">
      <h1 className="font-source-sans text-4xl font-bold leading-tight tracking-tight text-blog-hero-title sm:text-5xl lg:text-[56px] lg:leading-[68px]">
        {BLOG_PAGE.hero.title}
      </h1>
      <p className="mt-3 font-source-sans text-base font-normal leading-snug text-blog-hero-subtitle sm:text-lg lg:text-[22px] lg:leading-[22px]">
        {BLOG_PAGE.hero.subtitle}
      </p>
    </header>
  );
}
