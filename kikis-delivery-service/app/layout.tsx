import "./globals.css";
import { Cherry_Bomb_One, Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

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
    <html
      lang="en"
      className={cn("font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <body className={cherryBomb.variable}>
        <ThemeProvider attribute="class">
          <header>
            <h1>Kiki's Delivery Service</h1>
            <ThemeToggle />
          </header>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
