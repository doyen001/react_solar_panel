import { ReadingTextDocumentSection } from "@/components/layouts/ReadingTextDocumentSection";
import { WARRANTY_PAGE } from "@/utils/constant";

export function WarrantyPageSection() {
  return (
    <ReadingTextDocumentSection
      title={WARRANTY_PAGE.title}
      paragraphs={WARRANTY_PAGE.paragraphs}
      titleClassName="text-warranty-heading"
      bodyClassName="text-warranty-body"
    />
  );
}
