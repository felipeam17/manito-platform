import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MANITO - Marketplace de Oficios",
  description: "Conectamos clientes con profesionales de confianza para todos tus oficios",
  keywords: ["oficios", "plomería", "electricidad", "pintura", "jardinería", "limpieza"],
  authors: [{ name: "MANITO Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "MANITO - Marketplace de Oficios",
    description: "Conectamos clientes con profesionales de confianza para todos tus oficios",
    type: "website",
    locale: "es_ES",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#1a9d9f",
                color: "#fff",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
