import localFont from "next/font/local";
import Link from "next/link";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Alumni Association Platform",
  description: "Connect with your alma mater and fellow alumni",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-black">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-white flex flex-col min-h-screen`}
      >
        <header className="border-b border-gray-800">
          <nav className="container mx-auto flex justify-between items-center py-4 px-6">
            <Link href="/" className="text-2xl font-bold text-white hover:text-gray-300">
              Alumni Association
            </Link>
            <ul className="flex space-x-6">
              <li>
                <Link href="/dashboard" className="text-gray-300 hover:text-white">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-300 hover:text-white">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="text-gray-300 hover:text-white">
                  Jobs
                </Link>
              </li>
              <li>
                <Link href="/donations" className="text-gray-300 hover:text-white">
                  Donations
                </Link>
              </li>
            </ul>
          </nav>
        </header>
        <main className="flex-grow container mx-auto px-6 py-8">
          {children}
        </main>
        <footer className="border-t border-gray-800 text-center py-6 text-gray-400">
          <p>&copy; {new Date().getFullYear()} Alumni Association Platform. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
