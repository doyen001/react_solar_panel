export interface SolarPanel {
  center: { lat: number; lng: number };
  orientation: "PORTRAIT" | "LANDSCAPE";
  segmentIndex: number;
  yearlyEnergyDcKwh: number;
}

export interface SolarEstimateResult {
  estimated: boolean;
  center: { lat: number; lng: number };
  boundingBox: {
    sw: { lat: number; lng: number };
    ne: { lat: number; lng: number };
  };
  imageryDate: string;
  maxPanelsCount: number;
  maxArrayAreaM2: number;
  maxSunshineHoursPerYear: number;
  panelCapacityWatts: number;
  panelDimensions: { heightM: number; widthM: number };
  yearlyEnergyDcKwh: number;
  co2SavingsKgPerYear: number;
  wholeRoofAreaM2: number;
  buildingAreaM2: number;
  roofSegments: {
    pitchDegrees: number;
    azimuthDegrees: number;
    areaM2: number;
    center: { lat: number; lng: number };
    boundingBox: {
      sw: { lat: number; lng: number };
      ne: { lat: number; lng: number };
    };
  }[];
  /** Individual panel positions from the API's maximum layout. */
  solarPanels: SolarPanel[];
}
