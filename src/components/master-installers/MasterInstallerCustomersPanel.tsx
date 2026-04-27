import Link from "next/link";
import Icon from "@/components/ui/Icons";
import type {
  MasterInstallerCustomer,
  MasterInstallerDetail,
  MasterInstallerEntry,
} from "@/utils/constant";
import { MASTER_INSTALLER_EXPAND_ACTIONS } from "@/utils/constant";

function stageClass(stage: MasterInstallerCustomer["stage"]) {
  switch (stage) {
    case "Completed":
      return "master-ins-stage-pill master-ins-stage-completed";
    case "Negotiation":
      return "master-ins-stage-pill master-ins-stage-negotiation";
    case "Closed Won":
      return "master-ins-stage-pill master-ins-stage-closed-won";
    case "Site Visit":
      return "master-ins-stage-pill master-ins-stage-site-visit";
    default:
      return "master-ins-stage-pill master-ins-stage-completed";
  }
}

type Props = {
  installer: MasterInstallerEntry;
  detail: MasterInstallerDetail;
  customers: MasterInstallerCustomer[];
};

export function MasterInstallerCustomersPanel({
  installer,
  detail,
  customers,
}: Props) {
  const shown = customers.length;
  const total = installer.customers;

  return (
    <div className="master-ins-expand">
      <div className="master-ins-expand-toolbar">
        <div className="master-ins-expand-contacts">
          <span className="master-ins-expand-contact">
            <Icon name="Phone" className="master-ins-expand-contact-icon size-3" />
            <span>{detail.phone}</span>
          </span>
          <span className="master-ins-expand-contact">
            <Icon name="Mail" className="master-ins-expand-contact-icon size-3" />
            <span>{detail.email}</span>
          </span>
          <a
            href={detail.websiteHref}
            target="_blank"
            rel="noopener noreferrer"
            className="master-ins-expand-contact master-ins-expand-web"
          >
            <Icon name="ExternalLink" className="master-ins-expand-contact-icon size-3" />
            <span>{detail.websiteLabel}</span>
          </a>
        </div>
        <div className="master-ins-expand-actions">
          <Link
            href="/installers/dashboard/home"
            className="master-ins-expand-btn master-ins-expand-btn-primary"
          >
            <Icon name="Eye" className="size-3 shrink-0" aria-hidden />
            <span>{MASTER_INSTALLER_EXPAND_ACTIONS.viewPortal}</span>
          </Link>
          <Link
            href="/installers/dashboard/pipeline"
            className="master-ins-expand-btn master-ins-expand-btn-secondary"
          >
            <Icon name="BarChart3" className="size-3 shrink-0" aria-hidden />
            <span>{MASTER_INSTALLER_EXPAND_ACTIONS.pipelineStats}</span>
          </Link>
        </div>
      </div>

      <div className="master-ins-customers-scroll">
        <div className="master-ins-customers-head" aria-hidden>
          <span className="master-ins-customers-head-lead" />
          <span className="master-ins-customers-col-customer">Customer</span>
          <span className="master-ins-customers-col-contact">Contact</span>
          <span className="master-ins-customers-col-system">System</span>
          <span className="master-ins-customers-col-stage">Stage</span>
          <span className="master-ins-customers-col-price">Price</span>
          <span className="master-ins-customers-col-address">Address</span>
          <span className="master-ins-customers-col-date">Date</span>
        </div>

        {customers.map((c) => (
          <div key={c.id} className="master-ins-customer-row">
            <span className="master-ins-customer-avatar" aria-hidden>
              {c.initials}
            </span>
            <span className="master-ins-customer-name">{c.name}</span>
            <span className="master-ins-customer-contact">
              <span className="master-ins-customer-email">{c.email}</span>
              <span className="master-ins-customer-phone">{c.phone}</span>
            </span>
            <span className="master-ins-customer-system">{c.systemSize}</span>
            <span className="master-ins-customer-stage-cell">
              <span className={stageClass(c.stage)}>{c.stage}</span>
            </span>
            <span className="master-ins-customer-price">{c.price}</span>
            <span className="master-ins-customer-address">{c.address}</span>
            <span className="master-ins-customer-date">{c.date}</span>
          </div>
        ))}
      </div>

      <div className="master-ins-expand-footer">
        <p className="master-ins-expand-showing">
          Showing {shown} of {total} customers
        </p>
        <button type="button" className="master-ins-expand-view-all">
          {MASTER_INSTALLER_EXPAND_ACTIONS.viewAllCustomers}
        </button>
      </div>
    </div>
  );
}
