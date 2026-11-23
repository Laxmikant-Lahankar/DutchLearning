import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { getUser } from "@/lib/user";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "DagNederlands", template: "%s | DagNederlands" },
  description: "Learn Dutch from A1, starting with Flemish Dutch: reading, listening, writing and speaking. Free to start.",
  applicationName: "DagNederlands",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <header className="nav">
          <div className="container nav-inner">
            <Link className="brand" href={user ? "/learn" : "/"}>DagNederlands</Link>
            <nav className="nav-links" aria-label="Main">
              <Link href="/pricing">Pricing</Link>
              {user ? (
                <>
                  <Link href="/learn">My lessons</Link>
                  <form action="/auth/signout" method="post">
                    <button type="submit">Sign out</button>
                  </form>
                </>
              ) : (
                <Link href="/login">Sign in</Link>
              )}
            </nav>
          </div>
        </header>
        <main id="main">{children}</main>
        <footer className="footer">
          <div className="container">
            <Link href="/privacy">Privacy</Link>
            <Link href="/pricing">Pricing</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
