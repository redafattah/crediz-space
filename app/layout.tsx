import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Crediz | Espace Client",
  description:
    "Accédez à vos informations de prêt, suivez vos paiements et gérez votre profil dans votre espace client Crediz.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="bg-white">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen text-gray-900`}
      >
        <div className="min-h-screen flex flex-col">
          {/* You can insert a header or sidebar component here if needed */}
          <main className="flex-grow">{children}</main>
          {/* Optional footer here */}
        </div>
      </body>
    </html>
  );
}
