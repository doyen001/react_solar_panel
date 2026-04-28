import type { Metadata } from "next";
import {
  DM_Sans,
  Geist,
  Geist_Mono,
  Inter,
  Outfit,
  Source_Sans_3,
} from "next/font/google";
import { EasylinkAiChatbot } from "@/components/ai-chat/EasylinkAiChatbot";
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

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sourceSans.variable} ${outfit.variable} ${inter.variable} ${dmSans.variable} antialiased`}
        suppressHydrationWarning
      >
        <ReduxProvider>
          {children}
          <EasylinkAiChatbot />
          <ToastProvider />
        </ReduxProvider>
      </body>
    </html>
  );
}
