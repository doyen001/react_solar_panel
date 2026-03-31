import Image from "next/image";
import { profileAssets } from "./profileAssets";

type Props = {
  name: string;
  sizeLabel: string;
  onDownload?: () => void;
};

export function ProfileDocumentRow({ name, sizeLabel, onDownload }: Props) {
  return (
    <div className="flex items-center gap-2">
      <Image
        src={profileAssets.fileText}
        alt=""
        width={14}
        height={14}
        className="size-3.5 shrink-0"
        unoptimized
      />
      <p
        className="min-w-0 flex-1 truncate font-dm-sans text-[11px] font-normal leading-[16.5px] text-[#2a2622]"
        style={{ fontVariationSettings: "'opsz' 9" }}
      >
        {name}
      </p>
      <span
        className="shrink-0 font-dm-sans text-[9px] font-normal leading-[13.5px] text-[#7c736a]"
        style={{ fontVariationSettings: "'opsz' 9" }}
      >
        {sizeLabel}
      </span>
      <button
        type="button"
        aria-label={`Download ${name}`}
        onClick={onDownload}
        className="flex size-5 shrink-0 items-center justify-center rounded hover:bg-black/5"
      >
        <Image
          src={profileAssets.download}
          alt=""
          width={12}
          height={12}
          unoptimized
        />
      </button>
    </div>
  );
}
