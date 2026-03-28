type Props = {
  title: string;
  online?: boolean;
};

export function ChatThreadHeader({ title, online = true }: Props) {
  return (
    <div className="flex flex-col gap-2 border-b border-[#dfd5c3]/60 bg-gradient-to-b from-[rgba(245,159,10,0.15)] to-transparent pl-[18px] pr-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="border-l-2 border-[#ffef62] py-2.5 pl-4">
        <h2 className="font-[family-name:var(--font-inter)] text-xs font-bold uppercase leading-[18px] tracking-[0.3px] text-[#2a2622]">
          {title}
        </h2>
      </div>
      {online ? (
        <span className="mb-2 shrink-0 self-start rounded-full border border-[rgba(32,148,243,0.2)] bg-[rgba(32,148,243,0.1)] px-2.5 py-0.5 font-[family-name:var(--font-dm-sans)] text-[10px] font-semibold leading-[15px] text-[#2094f3] sm:mb-0 sm:self-center">
          Online
        </span>
      ) : null}
    </div>
  );
}
