export default function CustomerMessagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-cream-100 font-dm-sans antialiased">
      {children}
    </div>
  );
}
