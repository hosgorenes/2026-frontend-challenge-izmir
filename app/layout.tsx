import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark">
      <body className="min-h-screen bg-[#0a0a0f] text-zinc-100 antialiased">
        {children}
      </body>
    </html>
  );
}
