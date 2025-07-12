import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "../store/provider";
import Header from "../components/Header";
import { Toaster } from "sonner";


const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Blog",
  description: "Blog app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} antialiased`}
      >
        <Toaster position="top-center" richColors/>
        <ReduxProvider>
          <Header />
          <main className="max-w-7xl mx-auto py-8">
            {children}
          </main>
        </ReduxProvider>
      </body>
    </html>
  );
}
