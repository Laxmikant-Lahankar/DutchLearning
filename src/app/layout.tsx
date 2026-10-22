import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Dutch A1", template: "%s | Dutch A1" },
  description: "Learn Dutch from the beginning: reading, writing, listening and speaking.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
