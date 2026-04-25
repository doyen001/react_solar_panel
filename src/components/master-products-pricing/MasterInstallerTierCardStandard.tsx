import type { CSSProperties } from "react";
import Icon from "@/components/ui/Icons";
import {
  MASTER_INSTALLER_TIER_STANDARD_CARD,
  MASTER_INSTALLER_TIER_STANDARD_FEATURES,
  MASTER_INSTALLER_TIER_VOLUME_LABELS,
  type MasterInstallerTiersPricing,
} from "@/utils/constant";

type Props = {
  pricing: MasterInstallerTiersPricing;
};

export function MasterInstallerTierCardStandard({ pricing }: Props) {
  const fillStyle = {
    ["--master-it-fill" as string]: `${pricing.standardSliderFillPct}%`,
  } as CSSProperties;

  return (
    <article className="master-it-tier-card-standard">
      <h2 className="master-it-tier-title">
        {MASTER_INSTALLER_TIER_STANDARD_CARD.title}
      </h2>
      <p className="master-it-tier-tagline">
        {MASTER_INSTALLER_TIER_STANDARD_CARD.tagline}
      </p>
      <p className="master-it-tier-plan-note">
        {MASTER_INSTALLER_TIER_STANDARD_CARD.planSubtitle}
      </p>
      <div className="master-it-tier-price-row">
        <span className="master-it-tier-price-amount">
          {pricing.standardPrice}
        </span>
        <span className="master-it-tier-price-suffix">
          {MASTER_INSTALLER_TIER_STANDARD_CARD.priceSuffix}
        </span>
      </div>
      <div className="master-it-volume-block">
        <div
          className="master-it-volume-track-standard"
          style={fillStyle}
          aria-hidden
        />
        <div className="master-it-volume-ticks">
          {MASTER_INSTALLER_TIER_VOLUME_LABELS.map((label) => (
            <span
              key={label}
              className={
                label === pricing.standardActiveVolumeLabel
                  ? "master-it-volume-tick-standard-active"
                  : "master-it-volume-tick-standard"
              }
            >
              {label}
            </span>
          ))}
        </div>
      </div>
      <div className="master-it-features-standard">
        {MASTER_INSTALLER_TIER_STANDARD_FEATURES.map((label) => (
          <div key={label} className="master-it-feature-row-standard">
            <span className="master-it-feature-check-standard">
              <Icon name="Check" className="size-[10px]" />
            </span>
            <span className="master-it-feature-label-standard">{label}</span>
            <button
              type="button"
              className="master-it-feature-info-btn"
              aria-label={`More about ${label}`}
            >
              <Icon name="Info" className="size-[14px]" />
            </button>
          </div>
        ))}
      </div>
    </article>
  );
}
