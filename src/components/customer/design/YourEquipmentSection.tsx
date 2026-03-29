import { EQUIPMENT_CARDS } from "./designConstants";
import { EquipmentCard } from "./EquipmentCard";

export function YourEquipmentSection() {
  return (
    <section className="overflow-hidden rounded-[10px] border border-[#dfd5c3] bg-[#fcfbf8]">
      <div className="border-b border-[#dfd5c3]/60 bg-gradient-to-b from-[rgba(245,159,10,0.15)] to-transparent py-2.5 pl-[18px] pr-4">
        <h2 className="font-[family-name:var(--font-inter)] text-xs font-bold uppercase leading-[18px] tracking-[0.3px] text-[#2a2622]">
          Your Equipment
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 xl:grid-cols-4">
        {EQUIPMENT_CARDS.map((card) => (
          <EquipmentCard key={card.id} card={card} />
        ))}
      </div>
    </section>
  );
}
