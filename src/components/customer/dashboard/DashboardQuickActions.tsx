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
    iconBg: "bg-navy-800/7",
  },
  {
    label: "Browse Products",
    icon: "actionProducts",
    iconBg: "bg-orange-amber/7",
  },
  {
    label: "Message Installer",
    icon: "actionMessage",
    iconBg: "bg-success/7",
  },
  {
    label: "Schedule Visit",
    icon: "actionSchedule",
    iconBg: "bg-blue-slate/7",
  },
  {
    label: "Get Help",
    icon: "actionHelp",
    iconBg: "bg-warm-gray/7",
  },
];

export function DashboardQuickActions() {
  return (
    <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
      {ACTIONS.map((a) => (
        <button
          key={a.label}
          type="button"
          className="flex flex-col items-center gap-2 rounded-[10px] border border-warm-border bg-cream-50 px-2 py-[17px] text-center transition-colors hover:bg-cream-150"
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
            className="font-dm-sans text-[11px] font-semibold leading-[16.5px] text-warm-ink"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            {a.label}
          </span>
        </button>
      ))}
    </section>
  );
}
