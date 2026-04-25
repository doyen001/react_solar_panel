import { MasterSpecialPricingTable } from "./MasterSpecialPricingTable";
import { MasterSpecialPricingToolbar } from "./MasterSpecialPricingToolbar";

export function MasterSpecialPricingPanel() {
  return (
    <section className="space-y-0" aria-labelledby="master-special-pricing-heading">
      <h2 id="master-special-pricing-heading" className="sr-only">
        Special pricing
      </h2>
      <MasterSpecialPricingToolbar />
      <div className="master-sp-table-shell">
        <MasterSpecialPricingTable />
      </div>
    </section>
  );
}
