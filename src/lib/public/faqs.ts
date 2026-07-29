import { FAQS_PAGE, type FaqCategoryId, type FaqItem } from "@/utils/constant";

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

export type FaqCategory = {
  id: FaqCategoryId;
  label: string;
  iconId: (typeof FAQS_PAGE.categories)[number]["iconId"];
};

type BackendFaqItem = {
  id: string;
  categoryId: string;
  categoryLabel: string;
  question: string;
  answer: string;
  iconId?: (typeof FAQS_PAGE.categories)[number]["iconId"] | null;
};

function toFaqItem(item: BackendFaqItem, index: number): FaqItem {
  return {
    id: item.id,
    categoryId: item.categoryId as FaqCategoryId,
    question: item.question,
    answer: item.answer,
    variant: index % 2 === 0 ? "gold" : "blue",
  };
}

export async function fetchPublicFaqs(): Promise<{
  categories: FaqCategory[];
  items: FaqItem[];
}> {
  const res = await fetch("/api/faqs?limit=200", { cache: "no-store" });
  const json = (await res.json()) as ApiEnvelope<BackendFaqItem[]>;
  if (!res.ok) throw new Error(json.message || "Failed to load FAQs");

  const rows = Array.isArray(json.data) ? json.data : [];
  const categories = rows.reduce<FaqCategory[]>((acc, item) => {
    if (acc.some((category) => category.id === item.categoryId)) return acc;
    acc.push({
      id: item.categoryId as FaqCategoryId,
      label: item.categoryLabel,
      iconId: item.iconId ?? "FaqCategoryGeneral",
    });
    return acc;
  }, []);

  return {
    categories,
    items: rows.map(toFaqItem),
  };
}
