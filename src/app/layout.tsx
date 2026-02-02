import type { Metadata } from "next";
import { Orbitron, Rajdhani, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./tron-globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "System Entropy Visualizer | Controlled Chaos Dashboard",
  description: "A real-time dashboard exploring the sweet spot between order and chaos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Theme initialization script to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('project-ares-theme') || 'ares';
                const intensity = localStorage.getItem('project-ares-theme-intensity') || 'medium';
                document.documentElement.setAttribute('data-theme', theme);
                if (intensity !== 'none') {
                  document.documentElement.setAttribute('data-tron-intensity', intensity);
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${orbitron.variable} ${rajdhani.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
