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
        className="font-dm-sans text-xs leading-[18px] text-warm-ink"
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
          checked ? "justify-end bg-success" : "justify-start bg-warm-border"
        }`}
      >
        <span className="size-4 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.1)]" />
      </button>
    </div>
  );
}
