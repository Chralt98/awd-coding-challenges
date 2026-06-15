import "./globals.css";
import { Cherry_Bomb_One } from "next/font/google";

const cherryBomb = Cherry_Bomb_One({
  variable: "--font-cherry-bomb-one",
  weight: "400",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cherryBomb.variable}>
        <header>
          <h1>Kiki's Delivery Service</h1>
        </header>
        {children}
      </body>
    </html>
  );
}
