import "./globals.css";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import PageTransition from "../components/layout/PageTransition";
import SmoothScrollProvider from "../components/layout/SmoothScrollProvider";
import AmbientCanvas from "../components/layout/AmbientCanvas";

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
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600&family=Newsreader:ital,opsz,wght@0,6..72,400;1,6..72,400;1,6..72,500;1,6..72,600&family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-[#09090b] font-body antialiased selection:bg-emerald-100 selection:text-emerald-950">
        <SmoothScrollProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-emerald-600 focus:text-white focus:font-semibold focus:rounded-xl"
          >
            Skip to content
          </a>
          <AmbientCanvas>
            <Navbar />
            <main id="main-content" className="flex-1 flex flex-col pt-24 sm:pt-28">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
          </AmbientCanvas>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
