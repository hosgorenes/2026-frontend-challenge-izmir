import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kayıp Podo",
  description: "JotForm 2026 Frontend Challenge - Podo'nun İzini Sür",
  icons: {
    icon: "/podo_icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark" style={{ colorScheme: "dark" }}>
      <body className="min-h-screen bg-[#0a0a0f] text-zinc-100 antialiased">
        {children}
      </body>
    </html>
  );
}