import Icon, { type IconType } from "@/components/ui/Icons";
import { MASTER_PRODUCTS_L1_TABS } from "@/utils/constant";

export type MasterProductsL1TabId = (typeof MASTER_PRODUCTS_L1_TABS)[number]["id"];

type Props = {
  activeId: MasterProductsL1TabId;
  onChange: (id: MasterProductsL1TabId) => void;
};

export function MasterProductsL1Tabs({ activeId, onChange }: Props) {
  return (
    <div
      className="master-pp-l1-shell w-full max-w-fit justify-start"
      role="tablist"
    >
      {MASTER_PRODUCTS_L1_TABS.map((tab) => {
        const active = tab.id === activeId;
        const iconName = tab.icon as IconType;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            className={
              active ? "master-pp-l1-tab-active" : "master-pp-l1-tab-inactive"
            }
            onClick={() => onChange(tab.id)}
          >
            <Icon name={iconName} className="size-4 shrink-0" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
