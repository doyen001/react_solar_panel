import type { Metadata } from "next";

import { FooterSection } from "@/components/modules/LandingFooter";
import { Header } from "@/components/modules/LandingHero";
import { ServicesPageSection } from "@/components/pages/services/ServicesPageSection";
import { SERVICES_PAGE } from "@/utils/constant";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://easylinksolar.com.au";

const { seo, faq, services, pricing, breadcrumb } = SERVICES_PAGE;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: seo.title,
  description: seo.description,
  keywords: [...seo.keywords],
  alternates: { canonical: seo.path },
  openGraph: {
    type: "website",
    url: seo.path,
    siteName: "EasyLink Solar",
    title: seo.title,
    description: seo.description,
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

/**
 * Three graphs in one array: the Service itself, the FAQ block, and the
 * breadcrumb trail. Emitted from the same source data as the visible page so
 * the markup can never drift from the copy.
 */
function buildJsonLd() {
  const provider = {
    "@type": "Organization",
    name: "EasyLink Solar",
    url: SITE_URL,
  };

  return [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Website Design & Development",
      serviceType: "Website Design & Development",
      description: seo.description,
      provider,
      areaServed: { "@type": "Country", name: "Australia" },
      url: `${SITE_URL}${seo.path}`,
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Website Design & Development Services",
        itemListElement: services.items.map((item) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: item.title,
            description: item.description,
          },
        })),
      },
      offers: pricing.tiers.map((tier) => ({
        "@type": "Offer",
        name: tier.name,
        description: tier.summary,
        priceCurrency: "AUD",
        priceSpecification: {
          "@type": "PriceSpecification",
          description: tier.priceLabel,
        },
        url: `${SITE_URL}${tier.ctaHref}`,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumb.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.label,
        item: `${SITE_URL}${crumb.href ?? seo.path}`,
      })),
    },
  ];
}

export default function ServicesPage() {
  return (
    <>
      {/* Static content must stay readable when JS is unavailable or still
          loading. Scroll reveals and the timeline choreography both start from
          a hidden state that only a client observer clears, so without this the
          page would render largely blank for no-JS visitors. */}
      <noscript>
        <style>{`.svc-reveal,.svc-step-marker-wrap,.svc-step-body{opacity:1 !important;transform:none !important;}.svc-rail-v-fill{height:100% !important;}.svc-rail-h-fill{width:100% !important;}.svc-step-pulse{display:none !important;}`}</style>
      </noscript>

      <a
        href="#services-main"
        className="svc-focusable sr-only rounded-lg bg-svc-ink px-4 py-2 font-inter text-sm font-semibold text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
      >
        Skip to main content
      </a>

      <Header />

      <main id="services-main" className="svc-page overflow-x-hidden">
        <ServicesPageSection />
      </main>

      {/* No footer CTA card — the final CTA section directly above already owns it. */}
      <FooterSection showReadyToControlCta={false} />

      <script
        type="application/ld+json"
        // Static, source-derived JSON. `<` is escaped so it can never break out.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildJsonLd()).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
