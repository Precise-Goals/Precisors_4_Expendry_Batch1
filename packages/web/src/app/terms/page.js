import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Terms of Service — Expendry",
  description:
    "Terms of Service governing the use of the Expendry manufacturing platform, EXPEN tokens on MST testnet, and Sarvam AI assistant.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 pt-16 selection:bg-emerald-100 selection:text-emerald-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="pb-8 border-b border-zinc-200 space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-700">
            Legal &amp; Compliance
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 font-montserrat">
            Terms of Service
          </h1>
          <p className="text-xs font-mono text-zinc-500">
            Last Updated: October 30, 2026 · Effective Date: Immediate
          </p>
        </div>

        {/* Content Document */}
        <div className="mt-8 space-y-8 text-sm text-zinc-700 leading-relaxed font-body">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-900 font-montserrat">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, or utilizing the Expendry platform (&quot;Expendry&quot;), including connecting
              your BridgeKey Web3 wallet, interacting with the Sarvam AI assistant, or placing orders on the Tooling
              Marketplace, you agree to be bound by these Terms of Service. If you do not agree to these terms,
              you must cease use of the platform immediately.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-900 font-montserrat">
              2. EXPEN Token Utility &amp; Non-Financial Status
            </h2>
            <p>
              The <strong>EXPEN</strong> token is an ERC-20 utility token deployed on the MST Testnet
              (Contract address: <code>0x59CB0de255eC111ff7959FE6889c8C521836e7d5</code>, Chain ID: 91562037).
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                EXPEN is designed exclusively as an in-ecosystem reputation and reward mechanism for verified
                machining tacit knowledge contributions and marketplace tooling discounts.
              </li>
              <li>
                EXPEN does not constitute a security, investment contract, currency, or promise of profit.
                Daily minting is strictly capped at 50 EXPEN per verified machinist wallet.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-900 font-montserrat">
              3. Machinist Knowledge Contributions &amp; Code of Conduct
            </h2>
            <p>
              Users submitting blueprints, speeds, feeds, and machining posts warrant that:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>The information represents authentic shop-floor experience or open-source tooling standards.</li>
              <li>No proprietary, classified, or trade-secret corporate CAD data is published without authorization.</li>
              <li>Submissions are free from malicious code, exploits, spam, or false parameters that could damage machine equipment.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-900 font-montserrat">
              4. Sarvam AI Disclaimer
            </h2>
            <p>
              The Sarvam AI machining assistant provides synthetic guidance derived from community tacit knowledge
              and LLM reasoning. While optimized for CNC shop-floor accuracy, machining recommendations
              (cutting speeds, depth of cut, tool overhang, and clamping forces) must always be independently
              verified by a qualified machinist before running production cycles. Expendry assumes no liability
              for tool breakage, workpiece scrap, or spindle crashes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-900 font-montserrat">
              5. Governing Law
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of Maharashtra,
              India, with exclusive jurisdiction in the courts of Pune, Maharashtra.
            </p>
          </section>
        </div>

        {/* Back Link */}
        <div className="mt-12 pt-6 border-t border-zinc-200">
          <Link
            href="/"
            className="text-xs font-mono font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
          >
            ← Back to Expendry Home
          </Link>
        </div>
      </div>
    </div>
  );
}
