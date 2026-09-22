import Script from "next/script";

/**
 * Microsoft Clarity (session recordings + heatmaps). Only loads in
 * production, and only when a project ID is configured, so local/staging
 * traffic never pollutes the client's dashboard.
 *
 * Project-wide masking is left OFF (Clarity dashboard default) — instead,
 * sensitive elements are masked individually with `data-clarity-mask="true"`
 * wherever customer/installer personal data appears: name, email, phone,
 * address, and payment fields, whether as form inputs or read-only display
 * text. Search the codebase for `data-clarity-mask` to see everything
 * currently covered.
 */
export function ClarityAnalytics() {
  const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
  if (process.env.NODE_ENV !== "production" || !projectId) return null;

  return (
    <Script id="microsoft-clarity" strategy="afterInteractive">
      {`(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window,document,"clarity","script","${projectId}");`}
    </Script>
  );
}
