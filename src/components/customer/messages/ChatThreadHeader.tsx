type Props = {
  title: string;
  online?: boolean;
};

export function ChatThreadHeader({ title, online = true }: Props) {
  return (
    <div className="flex flex-col gap-2 border-b border-warm-border/60 bg-linear-to-b from-amber-hot/15 to-transparent pl-[18px] pr-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="border-l-2 border-yellow-lemon py-2.5 pl-4">
        <h2 className="font-inter text-xs font-bold uppercase leading-[18px] tracking-[0.3px] text-warm-ink">
          {title}
        </h2>
      </div>
      {online ? (
        <span className="mb-2 shrink-0 self-start rounded-full border border-brand-blue/20 bg-brand-blue/10 px-2.5 py-0.5 font-dm-sans text-[10px] font-semibold leading-[15px] text-brand-blue sm:mb-0 sm:self-center">
          Online
        </span>
      ) : null}
    </div>
  );
}
