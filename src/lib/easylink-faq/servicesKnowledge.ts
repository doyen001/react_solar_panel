import { Document } from "@langchain/core/documents";
import { SERVICES_PAGE } from "@/utils/constant";

function doc(section: string, content: string): Document {
  return new Document({
    pageContent: content.trim(),
    metadata: { source: "services-page", section },
  });
}

/**
 * Structured knowledge from `/services` ({@link SERVICES_PAGE}) for EasyLink AI retrieval.
 * Kept in sync with the public services page — do not duplicate copy elsewhere.
 */
export function buildServicesKnowledgeDocuments(): Document[] {
  const { hero, services, whyChooseUs, process, portfolio, techStack, benefits, testimonials, pricing, faq, finalCta } =
    SERVICES_PAGE;

  const docs: Document[] = [
    doc(
      "overview",
      `Website Design & Development Services (EasyLink Solar — ${SERVICES_PAGE.seo.path})

${hero.title}
${hero.subtitle}

${hero.trustNote}

Key stats: ${hero.stats.map((s) => `${s.value}${s.suffix} ${s.label}`).join(", ")}.`,
    ),
    doc(
      "offerings-intro",
      `${services.title}
${services.subtitle}

Service types we build:`,
    ),
    ...services.items.map((item) =>
      doc(
        `service-${item.id}`,
        `Website service: ${item.title}
${item.description}`,
      ),
    ),
    doc(
      "why-choose-us",
      `${whyChooseUs.title}
${whyChooseUs.subtitle}

${whyChooseUs.items.map((item) => `${item.title}: ${item.description}`).join("\n")}`,
    ),
    doc(
      "process",
      `${process.title}
${process.subtitle}

${process.steps.map((step) => `${step.step}. ${step.title} (${step.duration}): ${step.description}`).join("\n")}`,
    ),
    doc(
      "portfolio",
      `${portfolio.title}
${portfolio.subtitle}

${portfolio.items.map((item) => `${item.category} — ${item.title}: ${item.summary} Technologies: ${item.technologies.join(", ")}.`).join("\n")}`,
    ),
    doc(
      "tech-stack",
      `${techStack.title}
${techStack.subtitle}

${techStack.groups.map((group) => `${group.label}: ${group.items.map((item) => item.name).join(", ")}`).join("\n")}`,
    ),
    doc(
      "benefits",
      `${benefits.title}
${benefits.subtitle}

${benefits.items.map((item) => `${item.title}: ${item.description}`).join("\n")}`,
    ),
    doc(
      "testimonials",
      `${testimonials.title}
${testimonials.subtitle}

${testimonials.items.map((item) => `${item.name}, ${item.role} at ${item.company}: "${item.quote}"`).join("\n")}`,
    ),
    doc(
      "pricing-intro",
      `${pricing.title}
${pricing.subtitle}
${pricing.footnote}`,
    ),
    ...pricing.tiers.map((tier) =>
      doc(
        `pricing-${tier.id}`,
        `Website pricing tier: ${tier.name}
Price: ${tier.priceLabel} (${tier.cadence})
${tier.summary}

Includes:
${tier.features.map((f) => `- ${f}`).join("\n")}`,
      ),
    ),
    ...faq.items.map((item) =>
      doc(
        `faq-${item.id}`,
        `Website design & development FAQ

Question: ${item.question}
Answer: ${item.answer}`,
      ),
    ),
    doc(
      "contact",
      `${finalCta.title}
${finalCta.description}

Contact options:
${finalCta.contact.items.map((item) => `${item.label}${item.href ? ` (${item.href})` : ""}`).join("\n")}`,
    ),
  ];

  return docs;
}
