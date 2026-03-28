"use client";

type Props = {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  id: string;
};

export function PreferenceToggle({ checked, onChange, label, id }: Props) {
  return (
    <div className="flex items-center justify-between gap-3">
      <label
        htmlFor={id}
        className="font-[family-name:var(--font-dm-sans)] text-xs leading-[18px] text-[#2a2622]"
        style={{ fontVariationSettings: "'opsz' 9" }}
      >
        {label}
      </label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors ${
          checked ? "justify-end bg-[#16a34a]" : "justify-start bg-[#dfd5c3]"
        }`}
      >
        <span className="size-4 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.1)]" />
      </button>
    </div>
  );
}
