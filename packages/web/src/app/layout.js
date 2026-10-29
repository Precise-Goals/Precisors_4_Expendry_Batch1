import "./globals.css";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import PageTransition from "../components/layout/PageTransition";
import SmoothScrollProvider from "../components/layout/SmoothScrollProvider";

export const metadata = {
  title: "Expendry — Manufacturing Tacit Knowledge & Token Ecosystem",
  description:
    "Community-driven manufacturing ecosystem connecting veteran machinists to earn EXPEN tokens on MST testnet, consult a Sarvam AI RAG assistant, and inspect 3D tooling.",
  metadataBase: new URL("https://expendry.mstblockchain.com"),
  keywords: [
    "machining",
    "manufacturing",
    "tacit knowledge",
    "EXPEN",
    "MST blockchain",
    "Sarvam AI",
    "CNC tooling",
  ],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Poppins:wght@300;400;500;600;700&display=swap"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-[#09090b] font-body grain antialiased selection:bg-[#26d464]/25 selection:text-black">
        <SmoothScrollProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#26d464] focus:text-black focus:font-semibold focus:rounded"
          >
            Skip to content
          </a>
          <Navbar />
          <main id="main-content" className="flex-1 flex flex-col">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
