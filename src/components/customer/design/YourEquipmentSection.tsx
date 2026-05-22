import { CustomerSectionHeader } from "@/components/customer/CustomerSectionHeader";
import { EQUIPMENT_CARDS } from "./designConstants";
import { EquipmentCard } from "./EquipmentCard";

export function YourEquipmentSection() {
  return (
    <section className="customer-panel-border-dark overflow-hidden rounded-[10px] border bg-customer-panel-alt">
      <CustomerSectionHeader variant="dark" title="Your Equipment" />
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 xl:grid-cols-4">
        {EQUIPMENT_CARDS.map((card) => (
          <EquipmentCard key={card.id} card={card} />
        ))}
      </div>
    </section>
  );
}
