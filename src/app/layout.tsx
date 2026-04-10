import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LexAI — L'intelligence juridique instantanée",
  description:
    "LexAI génère des documents juridiques professionnels pour les avocats et cabinets français. Contrats, mises en demeure, clauses sur mesure.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Syne:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
