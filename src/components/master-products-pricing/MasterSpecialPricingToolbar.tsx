import Icon from "@/components/ui/Icons";
import {
  MASTER_SPECIAL_PRICING_ADD_LABEL,
  MASTER_SPECIAL_PRICING_INTRO,
} from "@/utils/constant";

export function MasterSpecialPricingToolbar() {
  return (
    <div className="master-sp-toolbar">
      <p className="master-sp-intro">{MASTER_SPECIAL_PRICING_INTRO}</p>
      <button type="button" className="master-sp-add-btn self-start md:self-auto">
        <Icon name="Plus" className="size-3.5 shrink-0" />
        {MASTER_SPECIAL_PRICING_ADD_LABEL}
      </button>
    </div>
  );
}
