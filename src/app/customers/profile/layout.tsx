export default function CustomerProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen font-dm-sans antialiased">{children}</div>
  );
}
