"use client";

import {
  MASTER_INSTALLER_TIER_BILLING_OPTIONS,
  type MasterInstallerTierBilling,
} from "@/utils/constant";

type Props = {
  value: MasterInstallerTierBilling;
  onChange: (next: MasterInstallerTierBilling) => void;
};

export function MasterInstallerTiersBillingToggle({ value, onChange }: Props) {
  return (
    <div
      className="master-it-billing-shell"
      role="group"
      aria-label="Billing period"
    >
      <div className="master-it-billing-inner">
        {MASTER_INSTALLER_TIER_BILLING_OPTIONS.map((opt) => {
          const active = opt.id === value;
          return (
            <button
              key={opt.id}
              type="button"
              className={`master-it-billing-btn ${
                active ? "master-it-billing-btn-active" : "master-it-billing-btn-idle"
              }`}
              aria-pressed={active}
              onClick={() => onChange(opt.id)}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
