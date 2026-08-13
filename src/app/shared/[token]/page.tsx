import { SharedJourneyView } from "@/components/customer/design/SharedJourneyView";

type Props = {
  params: Promise<{ token: string }>;
  searchParams?: Promise<{ ref?: string | string[] }>;
};

/**
 * Public "share your solar journey" page. No authentication: the unguessable
 * token is the only credential, and the payload is trimmed to figures the owner
 * is happy to publish — no address, price or contact details.
 */
export default async function SharedDesignPage({ params, searchParams }: Props) {
  const { token } = await params;
  const sp = searchParams ? await searchParams : {};
  const rawRef = sp.ref;
  const referralCode = Array.isArray(rawRef) ? rawRef[0] : rawRef;

  return (
    <main className="customer-page-bg flex min-h-screen flex-col">
      <SharedJourneyView token={token} referralCode={referralCode ?? null} />
    </main>
  );
}
