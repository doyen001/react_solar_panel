import {
  COMPARISON_DESIGNS,
  COMPARISON_ROWS,
} from "./designConstants";

export function DesignComparisonTable() {
  const selectedIndex = COMPARISON_DESIGNS.findIndex((d) => d.selected);
  const colIdx = selectedIndex >= 0 ? selectedIndex : 0;

  return (
    <section className="overflow-hidden rounded-[10px] border border-[#dfd5c3] bg-[#fcfbf8]">
      <div className="border-b border-[#dfd5c3]/60 bg-gradient-to-b from-[rgba(245,159,10,0.15)] to-transparent py-2.5 pl-[18px] pr-4">
        <h2 className="font-inter text-xs font-bold uppercase leading-[18px] tracking-[0.3px] text-[#2a2622]">
          Compare All Designs
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[#dfd5c3]">
              <th className="sticky left-0 z-10 bg-[#fcfbf8] px-4 py-2.5 font-dm-sans text-[9px] font-bold uppercase leading-[13.5px] tracking-[0.3px] text-[#7c736a]">
                Feature
              </th>
              {COMPARISON_DESIGNS.map((d) => (
                <th
                  key={d.id}
                  className={`px-3 py-2.5 text-center font-dm-sans text-[9px] font-bold uppercase leading-[13.5px] tracking-[0.3px] ${
                    d.selected ? "text-[#f78d00]" : "text-[#7c736a]"
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
              const rowBg = i % 2 === 1 ? "bg-[#f5f2ec]" : "bg-[#fcfbf8]";
              return (
                <tr
                  key={row.feature}
                  className={`border-b border-[#ede8de] ${rowBg}`}
                >
                  <td
                    className={`sticky left-0 z-10 px-4 py-2.5 font-dm-sans text-[11px] font-normal capitalize leading-[16.5px] text-[#7c736a] ${rowBg}`}
                  >
                    {row.feature}
                  </td>
                  {row.values.map((cell, j) => (
                    <td
                      key={`${row.feature}-${j}`}
                      className={`px-3 py-2.5 text-center font-dm-sans text-[11px] leading-[16.5px] text-[#7c736a] ${
                        j === colIdx
                          ? "font-semibold text-[#2a2622]"
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
