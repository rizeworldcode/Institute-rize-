import "./globals.css";

export const metadata = {
  title: "Aetheris // Next-Generation Autonomous AI Marketing Agency",
  description: "Aetheris is an ultra-premium futuristic digital marketing agency powered by specialized autonomous systems. The infinite loop of smarter growth.",
  authors: [{ name: "Aetheris Studio" }],
  keywords: ["AI Marketing", "Digital Agency", "WebGL 3D", "Autonomous Growth", "Premium Design"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-black text-white">
        {children}
      </body>
    </html>
  );
}
