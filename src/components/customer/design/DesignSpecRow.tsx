type Props = {
  label: string;
  value: string;
  valueEmphasis?: "gradient" | "default";
};

export function DesignSpecRow({
  label,
  value,
  valueEmphasis = "default",
}: Props) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-[#ede8de]/80 py-1.5 last:border-0">
      <span
        className="shrink-0 font-dm-sans text-xs font-normal leading-[18px] text-[#7c736a]"
        style={{ fontVariationSettings: "'opsz' 9" }}
      >
        {label}
      </span>
      {valueEmphasis === "gradient" ? (
        <span
          className="max-w-[60%] bg-clip-text text-right font-dm-sans text-xs font-semibold leading-[18px] text-transparent"
          style={{
            fontVariationSettings: "'opsz' 14",
            backgroundImage:
              "linear-gradient(172deg, rgb(32, 148, 243) 8.57%, rgb(23, 207, 207) 91.43%)",
          }}
        >
          {value}
        </span>
      ) : (
        <span
          className="max-w-[60%] text-right font-dm-sans text-xs font-medium leading-[18px] text-[#2a2622]"
          style={{ fontVariationSettings: "'opsz' 14" }}
        >
          {value}
        </span>
      )}
    </div>
  );
}
