import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Newsreader } from "next/font/google";
import Link from "next/link";
import { getUser } from "@/lib/user";
import "./globals.css";

// Self-hosted at build time by next/font: no request to Google from the learner's browser.
// Placeholder choices until the brand guidelines confirm typography.
const newsreader = Newsreader({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-newsreader", display: "swap" });
const instrument = Instrument_Sans({ subsets: ["latin"], variable: "--font-instrument", display: "swap" });

export const metadata: Metadata = {
  title: { default: "DagNederlands", template: "%s | DagNederlands" },
  description: "Learn Dutch from A1, starting with Flemish Dutch: reading, listening, writing and speaking. Free to start.",
  applicationName: "DagNederlands",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  return (
    <html lang="en" className={`${newsreader.variable} ${instrument.variable}`}>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <header className="nav">
          <div className="container nav-inner">
            <Link className="wordmark" href={user ? "/learn" : "/"}>
              Dag<span>Nederlands</span>
            </Link>
            <nav className="nav-links" aria-label="Main">
              {user ? (
                <>
                  <Link href="/learn">My lessons</Link>
                  <form action="/auth/signout" method="post">
                    <button type="submit">Sign out</button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/pricing">Pricing</Link>
                  <Link href="/login">Sign in</Link>
                </>
              )}
            </nav>
          </div>
        </header>
        <main id="main">{children}</main>
        <footer className="footer">
          <div className="container footer-inner">
            <span>DagNederlands</span>
            <nav aria-label="Footer">
              <Link href="/pricing">Pricing</Link>
              <Link href="/privacy">Privacy</Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
