import type { Metadata } from "next";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "EventDrop",
  description: "24-hour neighborhood event board"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <header className="border-b border-line bg-paper">
            <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
              <a href="/" className="text-lg font-semibold text-ink">
                EventDrop
              </a>
              <div className="flex items-center gap-3">
                <a href="/events/new" className="rounded-ui bg-ink px-3 py-2 text-sm font-medium text-white">
                  Drop event
                </a>
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="rounded-ui border border-line px-3 py-2 text-sm">Sign in</button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </nav>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
