import Image from "next/image";
import { dashboardAssets } from "./assets";

const ACTIONS: {
  label: string;
  icon: keyof typeof dashboardAssets;
  iconBg: string;
}[] = [
  {
    label: "View Design PDF",
    icon: "actionPdf",
    iconBg: "bg-[rgba(9,35,74,0.07)]",
  },
  {
    label: "Browse Products",
    icon: "actionProducts",
    iconBg: "bg-[rgba(247,141,0,0.07)]",
  },
  {
    label: "Message Installer",
    icon: "actionMessage",
    iconBg: "bg-[rgba(22,163,74,0.07)]",
  },
  {
    label: "Schedule Visit",
    icon: "actionSchedule",
    iconBg: "bg-[rgba(48,69,102,0.07)]",
  },
  {
    label: "Get Help",
    icon: "actionHelp",
    iconBg: "bg-[rgba(124,115,106,0.07)]",
  },
];

export function DashboardQuickActions() {
  return (
    <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
      {ACTIONS.map((a) => (
        <button
          key={a.label}
          type="button"
          className="flex flex-col items-center gap-2 rounded-[10px] border border-[#dfd5c3] bg-[#fcfbf8] px-2 py-[17px] text-center transition-colors hover:bg-[#f5f0e8]"
        >
          <div
            className={`flex size-9 items-center justify-center rounded-[10px] ${a.iconBg}`}
          >
            <Image
              src={dashboardAssets[a.icon]}
              alt=""
              width={20}
              height={20}
              unoptimized
            />
          </div>
          <span
            className="font-dm-sans text-[11px] font-semibold leading-[16.5px] text-[#2a2622]"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            {a.label}
          </span>
        </button>
      ))}
    </section>
  );
}
