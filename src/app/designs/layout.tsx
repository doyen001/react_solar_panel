import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Designs | EasyLink Solar",
  description:
    "Design your solar and battery system — maximise savings and end your energy bills.",
};

export default function DesignsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
