import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cupones",
  description: "Cupones entre dos personas: una los solicita, la otra los cobra.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
