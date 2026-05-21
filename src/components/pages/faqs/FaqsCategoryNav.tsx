"use client";

import Icon from "@/components/ui/Icons";
import type { FaqCategoryId } from "@/utils/constant";
import { FAQS_PAGE } from "@/utils/constant";

type FaqsCategoryNavProps = {
  activeCategoryId: FaqCategoryId | "all";
  onSelect: (categoryId: FaqCategoryId | "all") => void;
};

export function FaqsCategoryNav({
  activeCategoryId,
  onSelect,
}: FaqsCategoryNavProps) {
  return (
    <nav
      aria-label="FAQ categories"
      className="w-full max-w-[272px] shrink-0"
    >
      <p className="mb-4 pl-3 font-inter text-sm font-bold uppercase leading-5 tracking-[0.5496px] text-faqs-category-label">
        Categories
      </p>
      <ul className="flex flex-col">
        {FAQS_PAGE.categories.map((category) => {
          const isActive = activeCategoryId === category.id;

          return (
            <li key={category.id}>
              <button
                type="button"
                onClick={() => onSelect(category.id)}
                className={`flex h-[44px] w-full items-center gap-3 rounded-[14px] px-4 font-inter text-sm font-medium leading-5 tracking-[-0.1504px] transition-colors ${
                  isActive
                    ? "faqs-category-active text-faqs-category-text"
                    : "text-faqs-category-text hover:bg-white/5"
                }`}
              >
                <Icon
                  name={category.iconId}
                  className="size-5 shrink-0 text-current"
                />
                <span className="truncate">{category.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
