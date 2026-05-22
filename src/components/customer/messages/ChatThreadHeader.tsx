import { CustomerSectionHeader } from "@/components/customer/CustomerSectionHeader";

type Props = {
  title: string;
  online?: boolean;
};

export function ChatThreadHeader({ title, online = true }: Props) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <CustomerSectionHeader variant="cream" title={title} className="flex-1" />
      {online ? (
        <span className="customer-online-badge mb-2 mr-4 shrink-0 self-start rounded-full border px-2.5 py-0.5 font-dm-sans text-[10px] font-semibold leading-[15px] sm:mb-0 sm:self-center">
          Online
        </span>
      ) : null}
    </div>
  );
}
