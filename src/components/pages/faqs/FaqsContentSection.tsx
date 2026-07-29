"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import Icon from "@/components/ui/Icons";
import type { FaqCategoryId, FaqItem } from "@/utils/constant";
import { FAQS_PAGE } from "@/utils/constant";
import { fetchPublicFaqs, type FaqCategory } from "@/lib/public/faqs";

import { FaqsAccordionItem } from "./FaqsAccordionItem";
import { FaqsCategoryNav } from "./FaqsCategoryNav";

function filterFaqs(
  items: readonly FaqItem[],
  categoryId: FaqCategoryId | "all",
  searchQuery: string,
) {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return items.filter((item) => {
    const matchesCategory =
      normalizedQuery.length > 0 ||
      categoryId === "all" ||
      item.categoryId === categoryId;
    const matchesSearch =
      normalizedQuery.length === 0 ||
      item.question.toLowerCase().includes(normalizedQuery) ||
      item.answer.toLowerCase().includes(normalizedQuery);

    return matchesCategory && matchesSearch;
  });
}

type FaqsContentSectionProps = {
  searchQuery: string;
};

export function FaqsContentSection({ searchQuery }: FaqsContentSectionProps) {
  const [categories, setCategories] = useState<FaqCategory[]>([]);
  const [items, setItems] = useState<FaqItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<
    FaqCategoryId | "all"
  >("general");
  const [openItemId, setOpenItemId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchPublicFaqs()
      .then((result) => {
        if (cancelled) return;
        setCategories(result.categories);
        setItems(result.items);
        setActiveCategoryId(result.categories[0]?.id ?? "general");
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load FAQs");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredItems = useMemo(
    () => filterFaqs(items, activeCategoryId, searchQuery),
    [activeCategoryId, items, searchQuery],
  );

  return (
    <section className="relative overflow-hidden bg-faqs-page-bg pb-16 pt-10 sm:pb-20 sm:pt-14 lg:px-[90px] lg:pb-24 lg:pt-[115px]">
      <div className="pointer-events-none absolute inset-0 opacity-24" aria-hidden>
        <Image
          src={FAQS_PAGE.content.backgroundImageSrc}
          alt=""
          fill
          className="object-cover"
        />
      </div>

      <div className="relative mx-auto w-full max-w-[1262px] px-4 sm:px-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-[61px]">
          <div className="hidden lg:block">
            <FaqsCategoryNav
              categories={categories}
              activeCategoryId={activeCategoryId}
              onSelect={(categoryId) => {
                setActiveCategoryId(categoryId);
                setOpenItemId(null);
              }}
            />
          </div>

          <div className="faqs-title-banner flex min-h-[160px] w-full flex-1 items-center justify-center rounded-[40px] px-6 py-10 sm:min-h-[200px] lg:min-h-[230px]">
            <h2 className="text-center font-source-sans text-[28px] font-bold leading-tight text-faqs-title-banner-text sm:text-[34px] lg:text-[40px]">
              {FAQS_PAGE.content.titleBanner}
            </h2>
          </div>
        </div>

        <div className="mt-6 lg:hidden">
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((category) => {
              const isActive = activeCategoryId === category.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => {
                    setActiveCategoryId(category.id);
                    setOpenItemId(null);
                  }}
                  className={`inline-flex h-[44px] shrink-0 items-center gap-2 rounded-[14px] px-4 font-inter text-sm font-medium leading-5 tracking-[-0.1504px] ${
                    isActive
                      ? "faqs-category-active text-faqs-category-text"
                      : "border border-white/10 text-faqs-category-text"
                  }`}
                >
                  <Icon
                    name={category.iconId}
                    className="size-5 shrink-0 text-current"
                  />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-7 lg:mt-[60px] lg:gap-[28px]">
          {error ? (
            <div className="rounded-2xl border border-white/10 bg-slate-ink/60 px-6 py-10 text-center">
              <p className="font-inter text-base leading-relaxed text-gray-1">
                {error}
              </p>
            </div>
          ) : filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <FaqsAccordionItem
                key={item.id}
                item={item}
                isOpen={openItemId === item.id}
                onToggle={() =>
                  setOpenItemId((current) =>
                    current === item.id ? null : item.id,
                  )
                }
              />
            ))
          ) : (
            <div className="rounded-2xl border border-white/10 bg-slate-ink/60 px-6 py-10 text-center">
              <p className="font-inter text-base leading-relaxed text-gray-1">
                No questions match your search. Try another keyword or category.
              </p>
            </div>
          )}
        </div>

        <div className="mt-12 flex justify-center lg:mt-16">
          <Link
            href={FAQS_PAGE.content.downloadHref}
            download
            className="faqs-download-btn inline-flex h-[58px] min-w-[272px] items-center justify-center gap-1 rounded-[14px] px-6 font-inter text-xl font-medium leading-5 tracking-[-0.1504px] text-faqs-download-text transition-opacity hover:opacity-95"
          >
            <Icon name="FaqDownload" className="size-[22px] text-current" />
            {FAQS_PAGE.content.downloadLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
