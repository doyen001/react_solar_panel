import type { ComponentType, SVGProps } from "react";
import AirConditioner from "@/components/ui/Icons/air-conditioner.svg?component";
import Dishwasher from "@/components/ui/Icons/dishwasher.svg?component";
import ElectricOven from "@/components/ui/Icons/electric-oven.svg?component";
import Freezer from "@/components/ui/Icons/freezer.svg?component";
import HeatPump from "@/components/ui/Icons/heat-pump.svg?component";
import Laptop from "@/components/ui/Icons/laptop.svg?component";
import Lighting from "@/components/ui/Icons/lighting.svg?component";
import PoolPump from "@/components/ui/Icons/pool-pump.svg?component";
import Router from "@/components/ui/Icons/router.svg?component";
import Television from "@/components/ui/Icons/television.svg?component";
import Vehicle from "@/components/ui/Icons/vehicle.svg?component";
import Washer from "@/components/ui/Icons/washer.svg?component";

type SvgIcon = ComponentType<SVGProps<SVGSVGElement>>;

export const BLUETTI_APPLIANCE_ICON_MAP = {
  lighting: Lighting,
  router: Router,
  freezer: Freezer,
  television: Television,
  washer: Washer,
  laptop: Laptop,
  air_conditioner: AirConditioner,
  dishwasher: Dishwasher,
  electric_oven: ElectricOven,
  heat_pump: HeatPump,
  pool_pump: PoolPump,
  vehicle: Vehicle,
} as const satisfies Record<string, SvgIcon>;

export type BluettiApplianceIconId = keyof typeof BLUETTI_APPLIANCE_ICON_MAP;
