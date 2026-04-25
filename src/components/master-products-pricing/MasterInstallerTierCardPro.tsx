import type { CSSProperties } from "react";
import Icon from "@/components/ui/Icons";
import {
  MASTER_INSTALLER_TIER_PRO_CARD,
  MASTER_INSTALLER_TIER_PRO_FEATURES,
  MASTER_INSTALLER_TIER_VOLUME_LABELS,
  type MasterInstallerTiersPricing,
} from "@/utils/constant";

type Props = {
  pricing: MasterInstallerTiersPricing;
};

export function MasterInstallerTierCardPro({ pricing }: Props) {
  const fillStyle = {
    ["--master-it-fill" as string]: `${pricing.proSliderFillPct}%`,
  } as CSSProperties;

  return (
    <article className="master-it-tier-card-pro">
      <div className="master-it-popular-ribbon" aria-hidden>
        <span className="master-it-popular-ribbon-text">
          {MASTER_INSTALLER_TIER_PRO_CARD.mostPopularLabel}
        </span>
      </div>
      <div className="master-it-tier-title-pro">
        <Icon name="Zap" className="size-4 shrink-0 text-gray-1" />
        <span>{MASTER_INSTALLER_TIER_PRO_CARD.title}</span>
      </div>
      <p className="master-it-tier-tagline-pro">
        {MASTER_INSTALLER_TIER_PRO_CARD.tagline}
      </p>
      <p className="master-it-tier-plan-note-pro">
        {MASTER_INSTALLER_TIER_PRO_CARD.planSubtitle}
      </p>
      <div className="master-it-tier-price-row">
        <span className="master-it-tier-price-amount-pro">
          {pricing.proPrice}
        </span>
        <span className="master-it-tier-price-suffix-pro">
          {MASTER_INSTALLER_TIER_PRO_CARD.priceSuffix}
        </span>
      </div>
      <div className="master-it-volume-block">
        <div
          className="master-it-volume-track-pro"
          style={fillStyle}
          aria-hidden
        />
        <div className="master-it-volume-ticks">
          {MASTER_INSTALLER_TIER_VOLUME_LABELS.map((label) => (
            <span
              key={label}
              className={
                label === pricing.proActiveVolumeLabel
                  ? "master-it-volume-tick-pro-active"
                  : "master-it-volume-tick-pro"
              }
            >
              {label}
            </span>
          ))}
        </div>
      </div>
      <div className="master-it-features-pro">
        {MASTER_INSTALLER_TIER_PRO_FEATURES.map((item) => (
          <div
            key={item.label}
            className={`master-it-feature-row-pro ${
              item.multiline ? "master-it-feature-row-pro-multiline" : ""
            }`}
          >
            <span className="master-it-feature-check-pro">
              <Icon name="Check" className="size-[10px]" />
            </span>
            <span
              className={`master-it-feature-label-pro ${
                item.multiline ? "master-it-feature-label-pro-multiline" : ""
              }`}
            >
              {item.label}
            </span>
            <button
              type="button"
              className="master-it-feature-info-btn master-it-feature-info-btn-pro"
              aria-label={`More about ${item.label}`}
            >
              <Icon name="Info" className="size-[14px]" />
            </button>
          </div>
        ))}
      </div>
      <button type="button" className="master-it-upgrade-btn">
        {MASTER_INSTALLER_TIER_PRO_CARD.upgradeLabel}
      </button>
    </article>
  );
}
