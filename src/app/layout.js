import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PhotoCap - AI-Powered Photo Caption Generator",
  description:
    "Generate creative and engaging captions for your photos with PhotoCap. Simply enter your location, outfit colors, and time of day to get the perfect caption.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
