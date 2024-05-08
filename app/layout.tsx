import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OTP with Nextjs",
  description: "An OTP demo website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} h-dvh dark:bg-slate-950 dark:text-white`}>
        <div className="mx-auto p-4 h-full max-w-2xl">
          {children}
        </div>
      </body>
    </html>
  );
}
