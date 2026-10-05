import { CustomerPortalProviders } from "@/components/providers/CustomerPortalProviders";

// Server Component on purpose: everything that actually needs the browser
// (session rehydration, the live notification poll) lives in
// CustomerPortalProviders below. Keeping this file server-only means every
// customer page nested under it is still *eligible* to be a Server
// Component too — a "use client" directly on this layout used to force the
// whole subtree client-side regardless of what any individual page needed.
export default function CustomersLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CustomerPortalProviders>
      <div className="min-h-screen font-dm-sans antialiased">{children}</div>
    </CustomerPortalProviders>
  );
}
