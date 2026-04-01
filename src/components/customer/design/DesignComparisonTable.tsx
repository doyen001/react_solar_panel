import { COMPARISON_DESIGNS, COMPARISON_ROWS } from "./designConstants";

export function DesignComparisonTable() {
  const selectedIndex = COMPARISON_DESIGNS.findIndex((d) => d.selected);
  const colIdx = selectedIndex >= 0 ? selectedIndex : 0;

  return (
    <section className="overflow-hidden rounded-[10px] border border-warm-border bg-cream-50">
      <div className="border-b border-warm-border/60 bg-linear-to-b from-amber-hot/15 to-transparent py-2.5 pl-[18px] pr-4">
        <h2 className="font-inter text-xs font-bold uppercase leading-[18px] tracking-[0.3px] text-warm-ink">
          Compare All Designs
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="border-b border-warm-border">
              <th className="sticky left-0 z-10 bg-cream-50 px-4 py-2.5 font-dm-sans text-[9px] font-bold uppercase leading-[13.5px] tracking-[0.3px] text-warm-gray">
                Feature
              </th>
              {COMPARISON_DESIGNS.map((d) => (
                <th
                  key={d.id}
                  className={`px-3 py-2.5 text-center font-dm-sans text-[9px] font-bold uppercase leading-[13.5px] tracking-[0.3px] ${
                    d.selected ? "text-orange-amber" : "text-warm-gray"
                  }`}
                >
                  {d.label}
                  {d.selected ? " ✓" : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row, i) => {
              const rowBg = i % 2 === 1 ? "bg-cream-225" : "bg-cream-50";
              return (
                <tr
                  key={row.feature}
                  className={`border-b border-cream-300 ${rowBg}`}
                >
                  <td
                    className={`sticky left-0 z-10 px-4 py-2.5 font-dm-sans text-[11px] font-normal capitalize leading-[16.5px] text-warm-gray ${rowBg}`}
                  >
                    {row.feature}
                  </td>
                  {row.values.map((cell, j) => (
                    <td
                      key={`${row.feature}-${j}`}
                      className={`px-3 py-2.5 text-center font-dm-sans text-[11px] leading-[16.5px] text-warm-gray ${
                        j === colIdx
                          ? "font-semibold text-warm-ink"
                          : "font-medium"
                      }`}
                      style={{ fontVariationSettings: "'opsz' 14" }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
