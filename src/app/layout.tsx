import { LinkIcon } from "lucide-react";
import "./globals.css";

export const metadata = {
  title: "TinyLink - URL Shortener",
  description: "Fast and reliable URL shortening service",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen text-gray-900">
        <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <LinkIcon className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">TinyLink</h1>
                <p className="text-xs text-gray-500">Shorten URLs instantly</p>
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-white border-t mt-12">
          <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} TinyLink — Built with Next.js + Neon Postgres
          </div>
        </footer>
      </body>
    </html>
  );
}
