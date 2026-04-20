"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import { downloadProposalPdf } from "@/lib/proposal/generateProposalPdf";
import { useAppSelector } from "@/lib/store/hooks";
import { selectDesignProposal } from "@/lib/store/designProposalSlice";

export type DesignsProposalDownloadModalProps = {
  open: boolean;
  onClose: () => void;
  /** Override first name for “Dear …” (defaults from Redux `customer.name`). */
  letterFirstName?: string;
  /** Optional hook after a successful PDF download. */
  onConfirmDownload?: () => void;
};

const COMPANY_BLURB =
  "Easylink Solar Company is a leading provider of solar energy solutions based in Sydney. The company has been providing top-notch services to its customers and has received 5-star reviews from its happy customers. At Easylink Solar, the focus is on the customer, with a goal of reducing electricity bills and increasing solar feed-in credit. The company specializes in residential and commercial solar installations, providing top-quality and premium solar panels, inverters, and batteries. The team at Easylink Solar ensures a worry-free experience for its customers, both before and after the installation. With a focus on customer satisfaction, Easylink Solar is the ideal choice for anyone looking to switch to solar energy.";

function firstWordName(fullName: string): string {
  const t = fullName.trim();
  if (!t) return "Customer";
  return t.split(/\s+/)[0] ?? "Customer";
}

/**
 * Figma 20:22302 — proposal download confirmation / letter modal.
 * Download builds a multi-page PDF from Redux (`designProposal`) including the solar map screenshot when saved.
 */
export function DesignsProposalDownloadModal({
  open,
  onClose,
  letterFirstName,
  onConfirmDownload,
}: DesignsProposalDownloadModalProps) {
  const proposal = useAppSelector(selectDesignProposal);
  const [downloading, setDownloading] = useState(false);

  const dearName = useMemo(() => {
    if (letterFirstName?.trim()) return letterFirstName.trim();
    return firstWordName(proposal.customer.name);
  }, [letterFirstName, proposal.customer.name]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadProposalPdf(proposal);
      onConfirmDownload?.();
      onClose();
    } catch (err) {
      console.error("Proposal PDF download failed", err);
    } finally {
      setDownloading(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8 sm:px-8"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-[rgba(47,47,47,0.67)] backdrop-blur-[1px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="proposal-download-modal-title"
        className="relative z-[1] flex max-h-[min(841px,90vh)] w-full max-w-[948px] flex-col overflow-y-auto rounded-[16px] bg-white shadow-[0px_8px_40px_rgba(0,0,0,0.25)]"
      >
        <div className="flex flex-col px-6 pb-10 pt-10 sm:px-[78px] sm:pb-12 sm:pt-[69px]">
          <header className="flex flex-col items-center gap-[6px]">
            <Image
              src="/images/solarDesignLogo.png"
              alt="Solar Design Logo"
              width={54}
              height={54}
            />
            <h2
              id="proposal-download-modal-title"
              className="text-center font-source-sans text-[22px] font-medium uppercase leading-normal text-black sm:text-[26px]"
            >
              Solar Energy System Proposal
            </h2>
          </header>

          <section className="mt-10 flex max-w-[697px] flex-col gap-5 font-source-sans text-[18px] font-medium uppercase leading-normal text-black">
            <p>Dear {dearName},</p>
            <div className="flex flex-col gap-2">
              <p>
                Thank you for the opportunity to present your Solar Energy
                System Proposal.
              </p>
              <p>
                Best Regards,
                <br />
                Sujay Salvi
              </p>
            </div>
            <p className="font-bold">Easylink Solar</p>
          </section>

          <p className="mt-8 max-w-[793px] font-source-sans text-[18px] font-normal leading-normal text-black">
            {COMPANY_BLURB}
          </p>

          <div className="mt-10 flex max-w-full flex-col gap-4 font-source-sans text-black sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-[19px] sm:gap-y-2">
            <p className="text-[18px] font-normal leading-normal">
              Solar Proposal powered by OpenSolar Pty Ltd.
            </p>
            <p className="text-[0px] leading-[normal]">
              <span className="text-[14px] font-normal">
                By proceeding you agree to the{" "}
              </span>
              <a
                href="#"
                className="text-[14px] font-normal text-design-accent-cyan underline decoration-solid [text-decoration-skip-ink:none]"
                onClick={(e) => e.preventDefault()}
              >
                Terms &amp; Conditions
              </a>
              <span className="text-[14px] font-normal"> and </span>
              <a
                href="#"
                className="text-[14px] font-normal text-design-accent-cyan underline decoration-solid [text-decoration-skip-ink:none]"
                onClick={(e) => e.preventDefault()}
              >
                Privacy Notice
              </a>
            </p>
          </div>

          <button
            type="button"
            disabled={downloading}
            className="mx-auto mt-10 flex h-12 w-full max-w-[278px] shrink-0 items-center justify-center rounded-[12px] bg-[linear-gradient(147.99deg,#2094F3_0%,#17CFCF_100%)] font-source-sans text-[18px] font-semibold uppercase leading-6 text-white shadow-[0px_0px_40px_0px_rgba(140,140,140,0.3)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={() => void handleDownload()}
          >
            {downloading ? "Preparing PDF…" : "download your proposal"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
