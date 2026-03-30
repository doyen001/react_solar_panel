import type { Metadata } from "next";
import { Geist, Geist_Mono, Source_Sans_3, Outfit } from "next/font/google";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "EasyLink Solar",
  description: "Australia's trusted solar energy platform – EasyLink Solar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sourceSans.variable} ${outfit.variable} antialiased`}
      >
        <ReduxProvider>
          {children}
          <ToastProvider />
        </ReduxProvider>
      </body>
    </html>
  );
}
