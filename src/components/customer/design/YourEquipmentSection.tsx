import { EQUIPMENT_CARDS } from "./designConstants";
import { EquipmentCard } from "./EquipmentCard";

export function YourEquipmentSection() {
  return (
    <section className="overflow-hidden rounded-[10px] border border-warm-border bg-cream-50">
      <div className="border-b border-warm-border/60 bg-gradient-to-b from-amber-hot/15 to-transparent py-2.5 pl-[18px] pr-4">
        <h2 className="font-inter text-xs font-bold uppercase leading-[18px] tracking-[0.3px] text-warm-ink">
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
