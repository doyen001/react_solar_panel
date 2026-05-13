"use client";

import { useState } from "react";
import { SolarMaintDateField } from "@/components/customer/solar-maintenance/SolarMaintDateField";
import { SolarMaintFormField } from "@/components/customer/solar-maintenance/SolarMaintFormField";
import { SolarMaintenanceStepper } from "@/components/customer/solar-maintenance/SolarMaintenanceStepper";
import { SOLAR_MAINTENANCE_CONTRACT } from "@/utils/constant";

type EquipmentId =
  (typeof SOLAR_MAINTENANCE_CONTRACT.equipmentRows)[number]["id"];

type EquipmentRow = {
  size: string;
  qty: string;
  installedIso: string;
};

function emptyEquipment(): Record<EquipmentId, EquipmentRow> {
  return {
    panels: { size: "", qty: "", installedIso: "" },
    inverter: { size: "", qty: "", installedIso: "" },
    battery: { size: "", qty: "", installedIso: "" },
    accessories: { size: "", qty: "", installedIso: "" },
  };
}

export function SolarMaintenanceContractCard() {
  const copy = SOLAR_MAINTENANCE_CONTRACT;

  const [companyName, setCompanyName] = useState("");
  const [agreementDateIso, setAgreementDateIso] = useState("");
  const [contractNumber, setContractNumber] = useState("");
  const [equipment, setEquipment] = useState(emptyEquipment);
  const [installationAddress, setInstallationAddress] = useState("");
  const [clientName, setClientName] = useState("");
  const [abn, setAbn] = useState("");
  const [clientDateIso, setClientDateIso] = useState("");
  const [secondClientDateIso, setSecondClientDateIso] = useState("");
  const [clientCompany, setClientCompany] = useState("");

  const patchEquipment = (id: EquipmentId, patch: Partial<EquipmentRow>) => {
    setEquipment((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...patch },
    }));
  };

  return (
    <section
      className="solar-maint-card-shadow w-full max-w-[1024px] rounded-[18px] border border-sm-panel-border bg-sm-card-surface p-8 backdrop-blur-xs"
      aria-labelledby="solar-maint-title"
    >
      <SolarMaintenanceStepper currentStepId={1} />

      <div className="mt-6 flex flex-col gap-[7px]">
        <h1
          id="solar-maint-title"
          className="font-inter text-[30px] font-bold leading-9 tracking-[0.42px] text-sm-heading"
        >
          {copy.pageTitle}
        </h1>
        <p className="font-inter text-sm leading-5 tracking-[-0.154px] text-sm-muted">
          {copy.pageSubtitle}
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-6">
          <FieldBlock label={copy.agreementDetailsLabel}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <SolarMaintFormField
                placeholder={copy.placeholders.companyName}
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                autoComplete="organization"
              />
              <SolarMaintDateField
                isoValue={agreementDateIso}
                onIsoChange={setAgreementDateIso}
                ariaLabel="Agreement date"
              />
            </div>
          </FieldBlock>

          <FieldBlock label={copy.labels.contractNumber}>
            <SolarMaintFormField
              placeholder={copy.placeholders.contractNumber}
              value={contractNumber}
              onChange={(e) => setContractNumber(e.target.value)}
            />
          </FieldBlock>

          <div className="flex flex-col gap-3">
            <p className="font-inter text-sm font-semibold leading-5 tracking-[-0.154px] text-sm-heading">
              {copy.labels.equipmentCovered}
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {copy.equipmentColumnHeaders.map((h) => (
                <p
                  key={h}
                  className="font-inter text-xs font-medium leading-4 text-sm-muted"
                >
                  {h}
                </p>
              ))}
            </div>
            {copy.equipmentRows.map((row) => {
              const rowData = equipment[row.id];
              return (
                <div
                  key={row.id}
                  className="grid grid-cols-2 gap-3 sm:grid-cols-4"
                >
                  <SolarMaintFormField readOnly value={row.typeLabel} />
                  <SolarMaintFormField
                    placeholder={copy.placeholders.equipmentSize}
                    value={rowData.size}
                    onChange={(e) =>
                      patchEquipment(row.id, { size: e.target.value })
                    }
                  />
                  <SolarMaintFormField
                    placeholder={copy.placeholders.equipmentQty}
                    value={rowData.qty}
                    onChange={(e) =>
                      patchEquipment(row.id, { qty: e.target.value })
                    }
                    inputMode="numeric"
                  />
                  <SolarMaintDateField
                    isoValue={rowData.installedIso}
                    onIsoChange={(iso) =>
                      patchEquipment(row.id, { installedIso: iso })
                    }
                    ariaLabel={`${row.typeLabel} installed date`}
                  />
                </div>
              );
            })}
          </div>

          <FieldBlock label={copy.labels.installationLocation}>
            <SolarMaintFormField
              placeholder={copy.placeholders.installationAddress}
              value={installationAddress}
              onChange={(e) => setInstallationAddress(e.target.value)}
            />
          </FieldBlock>
        </div>

        <div className="flex min-w-0 flex-col gap-6">
          <FieldBlock label={copy.labels.client}>
            <SolarMaintFormField
              placeholder={copy.placeholders.clientName}
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              autoComplete="name"
            />
          </FieldBlock>

          <FieldBlock label={copy.labels.abn}>
            <SolarMaintFormField
              placeholder={copy.placeholders.abn}
              value={abn}
              onChange={(e) => setAbn(e.target.value)}
            />
          </FieldBlock>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FieldBlock label={copy.labels.date}>
              <SolarMaintDateField
                isoValue={clientDateIso}
                onIsoChange={setClientDateIso}
                ariaLabel="Client primary date"
              />
            </FieldBlock>
            <FieldBlock label={copy.labels.date}>
              <SolarMaintDateField
                isoValue={secondClientDateIso}
                onIsoChange={setSecondClientDateIso}
                ariaLabel="Client secondary date"
              />
            </FieldBlock>
          </div>

          <FieldBlock label={copy.labels.companyNameRight}>
            <SolarMaintFormField
              placeholder={copy.placeholders.clientCompanyName}
              value={clientCompany}
              onChange={(e) => setClientCompany(e.target.value)}
            />
          </FieldBlock>
        </div>
      </div>

      <footer className="mt-8 flex flex-col gap-3 border-t border-sm-panel-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          className="inline-flex h-10 items-center justify-center rounded-lg border border-sm-panel-border px-5 font-inter text-sm font-medium leading-5 tracking-[-0.154px] text-sm-heading hover:bg-sm-input-bg"
        >
          {copy.buttons.saveDraft}
        </button>
        <button
          type="button"
          className="inline-flex h-10 min-w-[117px] items-center justify-center rounded-full bg-sm-accent px-6 font-inter text-sm font-semibold leading-5 tracking-[-0.154px] text-sm-button-label hover:brightness-110"
        >
          {copy.buttons.continue}
        </button>
      </footer>
    </section>
  );
}

function FieldBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className="font-inter text-sm font-semibold leading-5 tracking-[-0.154px] text-sm-heading">
        {label}
      </p>
      {children}
    </div>
  );
}
