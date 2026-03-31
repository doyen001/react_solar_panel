export default function CustomerDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#f0ebe2] font-dm-sans antialiased">
      {children}
    </div>
  );
}
