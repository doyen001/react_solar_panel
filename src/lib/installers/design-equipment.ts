export const EQUIPMENT_CARD_KEYS = [
  "solar",
  "battery",
  "equipment",
  "evCharger",
  "heatPump",
  "site",
] as const;

export type EquipmentCardKey = (typeof EQUIPMENT_CARD_KEYS)[number];

export type EquipmentRow = { label: string; value: string };

export type InstallerHomeEquipment = Record<EquipmentCardKey, EquipmentRow[]>;

export type DesignEquipmentWizardData = {
  equipmentCards?: Partial<Record<EquipmentCardKey, EquipmentRow[]>>;
  equipmentCardsHidden?: EquipmentCardKey[];
};

export function parseDesignEquipmentWizardData(
  wizardData: unknown,
): DesignEquipmentWizardData {
  if (!wizardData || typeof wizardData !== "object") return {};
  const raw = wizardData as Record<string, unknown>;
  const equipmentCards = raw.equipmentCards;
  const equipmentCardsHidden = raw.equipmentCardsHidden;

  const parsedCards: Partial<Record<EquipmentCardKey, EquipmentRow[]>> = {};
  if (equipmentCards && typeof equipmentCards === "object") {
    for (const key of EQUIPMENT_CARD_KEYS) {
      const rows = (equipmentCards as Record<string, unknown>)[key];
      if (Array.isArray(rows)) {
        parsedCards[key] = rows
          .filter(
            (row): row is EquipmentRow =>
              !!row &&
              typeof row === "object" &&
              typeof (row as EquipmentRow).label === "string" &&
              typeof (row as EquipmentRow).value === "string",
          )
          .map((row) => ({
            label: row.label.trim(),
            value: row.value.trim(),
          }));
      }
    }
  }

  const hidden = Array.isArray(equipmentCardsHidden)
    ? equipmentCardsHidden.filter((key): key is EquipmentCardKey =>
        (EQUIPMENT_CARD_KEYS as readonly string[]).includes(key as string),
      )
    : undefined;

  return {
    ...(Object.keys(parsedCards).length ? { equipmentCards: parsedCards } : {}),
    ...(hidden?.length ? { equipmentCardsHidden: hidden } : {}),
  };
}

export function mergeEquipmentWithWizardData(
  base: InstallerHomeEquipment,
  wizardData: unknown,
): { equipment: InstallerHomeEquipment; hidden: Set<EquipmentCardKey> } {
  const parsed = parseDesignEquipmentWizardData(wizardData);
  const hidden = new Set(parsed.equipmentCardsHidden ?? []);

  const equipment = Object.fromEntries(
    EQUIPMENT_CARD_KEYS.map((key) => [
      key,
      parsed.equipmentCards?.[key] ?? base[key],
    ]),
  ) as InstallerHomeEquipment;

  return { equipment, hidden };
}

export function buildEquipmentWizardPatch(
  currentWizardData: unknown,
  patch: {
    cardKey?: EquipmentCardKey;
    rows?: EquipmentRow[];
    hideCardKey?: EquipmentCardKey;
  },
): Record<string, unknown> {
  const base =
    currentWizardData && typeof currentWizardData === "object"
      ? { ...(currentWizardData as Record<string, unknown>) }
      : {};

  const equipmentState = parseDesignEquipmentWizardData(currentWizardData);
  const equipmentCards = { ...(equipmentState.equipmentCards ?? {}) };
  let equipmentCardsHidden = [...(equipmentState.equipmentCardsHidden ?? [])];

  if (patch.cardKey && patch.rows) {
    equipmentCards[patch.cardKey] = patch.rows;
    equipmentCardsHidden = equipmentCardsHidden.filter(
      (key) => key !== patch.cardKey,
    );
  }

  if (patch.hideCardKey) {
    if (!equipmentCardsHidden.includes(patch.hideCardKey)) {
      equipmentCardsHidden.push(patch.hideCardKey);
    }
  }

  return {
    ...base,
    equipmentCards,
    equipmentCardsHidden,
  };
}
