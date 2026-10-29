import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — Expendry",
  description:
    "Privacy Policy for the Expendry manufacturing ecosystem, Sarvam AI tacit assistant, and MST blockchain interactions.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 pt-16 selection:bg-emerald-100 selection:text-emerald-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="pb-8 border-b border-zinc-200 space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-700">
            Legal &amp; Compliance
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 font-montserrat">
            Privacy Policy
          </h1>
          <p className="text-xs font-mono text-zinc-500">
            Last Updated: October 30, 2026 · Effective Date: Immediate
          </p>
        </div>

        {/* Content Document */}
        <div className="mt-8 space-y-8 text-sm text-zinc-700 leading-relaxed font-body">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-900 font-montserrat">
              1. Overview
            </h2>
            <p>
              Expendry (&quot;we&quot;, &quot;our&quot;, or &quot;the Platform&quot;) is committed to safeguarding
              the privacy of manufacturing engineers, machinists, and enterprise partners. This Privacy Policy
              describes how we collect, store, process, and protect your information when using our web portal,
              Sarvam AI tacit assistant, 3D CAD viewer, and MST blockchain smart contracts.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-900 font-montserrat">
              2. Information We Collect
            </h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Identity Credentials:</strong> Work email address, username/handle, machinist specialty,
                and company or workshop affiliation provided during account registration and onboarding.
              </li>
              <li>
                <strong>Web3 Wallet Address:</strong> Public cryptographic addresses on the MST Testnet
                (Chain ID 91562037) or BridgeKey wallet required for signing challenge nonces and receiving EXPEN token grants.
                <em>We never collect or store your private keys or seed phrases.</em>
              </li>
              <li>
                <strong>Shop-Floor Tacit Submissions:</strong> Machining parameters, speeds, feeds, tool wear observations,
                and technical blueprint documentation shared in the community feed.
              </li>
              <li>
                <strong>Sarvam AI Telemetry:</strong> Anonymized query logs and voice audio buffers sent for speech-to-text
                transcription and conversational recovery advice.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-900 font-montserrat">
              3. How We Use Your Information
            </h2>
            <p>We use the collected information for the following legitimate business purposes:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>To verify machinist identity credentials and authorize EXPEN token minting on MST Testnet.</li>
              <li>To index shop-floor tacit knowledge into our BM25 retrieval engine for real-time RAG consultation.</li>
              <li>To render interactive 3D GLB tooling models and CAD inspection telemetry.</li>
              <li>To detect and prevent replay attacks, unauthorized access, and malicious prototype pollution.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-900 font-montserrat">
              4. Blockchain Public Transparency
            </h2>
            <p>
              Please note that transactions executed on the MST Blockchain (including EXPEN token transfers,
              post reward mints, and contract interactions) are public by design. Your public wallet address,
              transaction hashes, and timestamped blocks are permanently visible on MSTScan and public explorers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-900 font-montserrat">
              5. Data Security &amp; Encryption
            </h2>
            <p>
              We enforce strict industry-standard security protocols, including TLS 1.3 encryption in transit,
              Content Security Policy (CSP) headers, OWASP injection guards, and DOMPurify sanitization.
              API keys and backend operator credentials are never exposed to client-side bundles.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-900 font-montserrat">
              6. Contact Us
            </h2>
            <p>
              For privacy inquiries, data deletion requests, or compliance auditing, please contact our
              compliance team at{" "}
              <a href="mailto:privacy@expendry.io" className="text-emerald-700 font-bold hover:underline">
                privacy@expendry.io
              </a>{" "}
              or write to our Pune engineering cluster.
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
