import { ProductsPageSection } from "@/components/pages/products/ProductsPageSection";
import { FooterSection } from "@/components/modules/LandingFooter";
import { Header } from "@/components/modules/LandingHero";

export default function ProductsPage() {
  return (
    <>
      <Header />
      <main className="overflow-x-hidden bg-white">
        <ProductsPageSection />
      </main>
      <FooterSection />
    </>
  );
}
