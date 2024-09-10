import localFont from "next/font/local";
import Navigation from "./components/Navigation.js";
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
        <header>
          <Navigation />
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
