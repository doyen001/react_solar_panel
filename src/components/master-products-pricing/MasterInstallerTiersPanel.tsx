"use client";

import { useState } from "react";
import {
  MASTER_INSTALLER_TIERS_PRICING,
  MASTER_INSTALLER_TIERS_YEARLY_SAVE_LABEL,
  type MasterInstallerTierBilling,
} from "@/utils/constant";
import { MasterInstallerTierCardPro } from "./MasterInstallerTierCardPro";
import { MasterInstallerTierCardStandard } from "./MasterInstallerTierCardStandard";
import { MasterInstallerTiersBillingToggle } from "./MasterInstallerTiersBillingToggle";

export function MasterInstallerTiersPanel() {
  const [billing, setBilling] = useState<MasterInstallerTierBilling>("monthly");
  const pricing = MASTER_INSTALLER_TIERS_PRICING[billing];

  return (
    <section aria-labelledby="master-installer-tiers-heading">
      <h2 id="master-installer-tiers-heading" className="sr-only">
        Installer tiers
      </h2>
      <div className="master-it-billing-row">
        <MasterInstallerTiersBillingToggle value={billing} onChange={setBilling} />
        {billing === "yearly" ? (
          <span className="master-it-save-badge">
            {MASTER_INSTALLER_TIERS_YEARLY_SAVE_LABEL}
          </span>
        ) : null}
      </div>
      <div className="master-it-cards-grid">
        <MasterInstallerTierCardStandard pricing={pricing} />
        <MasterInstallerTierCardPro pricing={pricing} />
      </div>
    </section>
  );
}
