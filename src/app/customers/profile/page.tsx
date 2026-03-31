"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { CustomerAvatar } from "@/components/customer/CustomerAvatar";
import { CustomerDashboardHeader } from "@/components/customer/dashboard/CustomerDashboardHeader";
import { CustomerPanelCard } from "@/components/customer/profile/CustomerPanelCard";
import { PreferenceToggle } from "@/components/customer/profile/PreferenceToggle";
import { ProfileContactField } from "@/components/customer/profile/ProfileContactField";
import { ProfileDocumentRow } from "@/components/customer/profile/ProfileDocumentRow";
import { ProfileEntityRow } from "@/components/customer/profile/ProfileEntityRow";
import { profileAssets } from "@/components/customer/profile/profileAssets";
import { StatusBadge } from "@/components/customer/profile/StatusBadge";
import { useAppSelector } from "@/lib/store/hooks";

export default function CustomerProfilePage() {
  const user = useAppSelector((s) => s.customerAuth.user);

  const displayName = useMemo(() => {
    const fn = user?.firstName?.trim();
    const ln = user?.lastName?.trim();
    if (fn && ln) return `${fn} ${ln}`;
    if (fn) return fn;
    if (ln) return ln;
    return "James Wilson";
  }, [user]);

  const email = user?.email ?? "james.wilson@email.com";
  const phone = "0412 345 678";
  const address = user?.address?.trim() || "42 Bondi Rd, Bondi, NSW 2026";

  const [prefs, setPrefs] = useState({
    emailNotifications: true,
    smsAlerts: true,
    projectUpdates: true,
    marketingEmails: false,
    productAlerts: false,
  });

  return (
    <div className="flex min-h-screen flex-col bg-[#f0ebe2]">
      <CustomerDashboardHeader
        firstName={user?.firstName}
        lastName={user?.lastName}
        activeNav="profile"
      />

      <main className="flex-1 bg-[#081f43] px-4 py-5 md:px-5">
        <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:items-start">
          <CustomerPanelCard
            title="My Profile"
            icon={
              <Image
                src={profileAssets.user}
                alt=""
                width={16}
                height={16}
                unoptimized
              />
            }
            headerAction={
              <button
                type="button"
                className="flex items-center gap-1 font-dm-sans text-[10px] font-semibold leading-[15px] text-[#f78d00]"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                <Image
                  src={profileAssets.pencil}
                  alt=""
                  width={12}
                  height={12}
                  unoptimized
                />
                Edit
              </button>
            }
          >
            <div className="flex flex-col items-center gap-4">
              <CustomerAvatar
                size="lg"
                firstName={user?.firstName}
                lastName={user?.lastName}
              />
              <div className="text-center">
                <p className="font-inter text-base font-bold leading-6 text-[#2a2622]">
                  {displayName}
                </p>
                <p
                  className="mt-1 font-dm-sans text-[11px] font-normal leading-[16.5px] text-[#7c736a]"
                  style={{ fontVariationSettings: "'opsz' 9" }}
                >
                  Solar Customer
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              <ProfileContactField
                icon={
                  <Image
                    src={profileAssets.fieldEmail}
                    alt=""
                    width={12}
                    height={12}
                    unoptimized
                  />
                }
                label="Email"
                value={email}
              />
              <ProfileContactField
                icon={
                  <Image
                    src={profileAssets.fieldPhone}
                    alt=""
                    width={12}
                    height={12}
                    unoptimized
                  />
                }
                label="Phone"
                value={phone}
              />
              <ProfileContactField
                icon={
                  <Image
                    src={profileAssets.fieldAddress}
                    alt=""
                    width={12}
                    height={12}
                    unoptimized
                  />
                }
                label="Address"
                value={address}
              />
            </div>
          </CustomerPanelCard>

          <CustomerPanelCard
            title="Account Details"
            icon={
              <Image
                src={profileAssets.shield}
                alt=""
                width={16}
                height={16}
                unoptimized
              />
            }
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span
                  className="font-dm-sans text-[#7c736a]"
                  style={{ fontVariationSettings: "'opsz' 9" }}
                >
                  Account Created
                </span>
                <span
                  className="font-dm-sans font-medium text-[#2a2622]"
                  style={{ fontVariationSettings: "'opsz' 14" }}
                >
                  15 Jan 2026
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 text-xs">
                <span
                  className="font-dm-sans text-[#7c736a]"
                  style={{ fontVariationSettings: "'opsz' 9" }}
                >
                  Last Login
                </span>
                <span
                  className="font-dm-sans font-medium text-[#2a2622]"
                  style={{ fontVariationSettings: "'opsz' 14" }}
                >
                  4 Mar 2026
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 text-xs">
                <span
                  className="font-dm-sans text-[#7c736a]"
                  style={{ fontVariationSettings: "'opsz' 9" }}
                >
                  Account Status
                </span>
                <StatusBadge>Active</StatusBadge>
              </div>
              <div className="flex items-center justify-between gap-2 text-xs">
                <span
                  className="font-dm-sans text-[#7c736a]"
                  style={{ fontVariationSettings: "'opsz' 9" }}
                >
                  2FA
                </span>
                <StatusBadge>Enabled</StatusBadge>
              </div>
            </div>

            <div className="mt-4 border-t border-[#dfd5c3] pt-4">
              <p
                className="font-dm-sans text-[9px] font-normal uppercase leading-[13.5px] tracking-[0.3px] text-[#7c736a]"
                style={{ fontVariationSettings: "'opsz' 9" }}
              >
                Assigned Installer
              </p>
              <div className="mt-2">
                <ProfileEntityRow
                  initialsOverride="SM"
                  title="SolarMax Pro"
                  subtitle="CEC Accredited · Sydney, NSW"
                />
              </div>
            </div>

            <div className="mt-4 border-t border-[#dfd5c3] pt-4">
              <p
                className="font-dm-sans text-[9px] font-normal uppercase leading-[13.5px] tracking-[0.3px] text-[#7c736a]"
                style={{ fontVariationSettings: "'opsz' 9" }}
              >
                Platform
              </p>
              <div className="mt-2">
                <ProfileEntityRow
                  initialsOverride="ES"
                  title="Easylink Solar"
                  subtitle="Powered by Easylink Designer"
                  avatarVariant="gradient"
                />
              </div>
            </div>
          </CustomerPanelCard>

          <CustomerPanelCard
            title="Preferences"
            icon={
              <Image
                src={profileAssets.bell}
                alt=""
                width={16}
                height={16}
                unoptimized
              />
            }
          >
            <div className="flex flex-col gap-3">
              <PreferenceToggle
                id="pref-email"
                label="Email Notifications"
                checked={prefs.emailNotifications}
                onChange={(v) =>
                  setPrefs((p) => ({ ...p, emailNotifications: v }))
                }
              />
              <PreferenceToggle
                id="pref-sms"
                label="SMS Alerts"
                checked={prefs.smsAlerts}
                onChange={(v) => setPrefs((p) => ({ ...p, smsAlerts: v }))}
              />
              <PreferenceToggle
                id="pref-project"
                label="Project Updates"
                checked={prefs.projectUpdates}
                onChange={(v) =>
                  setPrefs((p) => ({ ...p, projectUpdates: v }))
                }
              />
              <PreferenceToggle
                id="pref-marketing"
                label="Marketing Emails"
                checked={prefs.marketingEmails}
                onChange={(v) =>
                  setPrefs((p) => ({ ...p, marketingEmails: v }))
                }
              />
              <PreferenceToggle
                id="pref-product"
                label="Product Alerts"
                checked={prefs.productAlerts}
                onChange={(v) =>
                  setPrefs((p) => ({ ...p, productAlerts: v }))
                }
              />
            </div>

            <div className="mt-4 border-t border-[#dfd5c3] pt-4">
              <p
                className="font-dm-sans text-[9px] font-normal uppercase leading-[13.5px] tracking-[0.3px] text-[#7c736a]"
                style={{ fontVariationSettings: "'opsz' 9" }}
              >
                Documents
              </p>
              <div className="mt-3 flex flex-col gap-3">
                <ProfileDocumentRow
                  name="Solar Design PDF"
                  sizeLabel="2.4 MB"
                />
                <ProfileDocumentRow
                  name="Contract Agreement"
                  sizeLabel="1.1 MB"
                />
                <ProfileDocumentRow
                  name="Invoice #INV-2026-047"
                  sizeLabel="340 KB"
                />
              </div>
            </div>
          </CustomerPanelCard>
        </div>
      </main>
    </div>
  );
}
