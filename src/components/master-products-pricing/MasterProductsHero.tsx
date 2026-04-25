import Icon from "@/components/ui/Icons";
import { MASTER_PRODUCTS_PRICING_PAGE } from "@/utils/constant";

export function MasterProductsHero() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
      <div className="master-pp-hero-icon" aria-hidden>
        <Icon name="Tag" className="size-4" />
      </div>
      <div className="min-w-0 space-y-1">
        <h1 className="master-pp-title">{MASTER_PRODUCTS_PRICING_PAGE.title}</h1>
        <p className="master-pp-subtitle max-w-[520px]">
          {MASTER_PRODUCTS_PRICING_PAGE.subtitle}
        </p>
      </div>
    </div>
  );
}
