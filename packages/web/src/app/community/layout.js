import React from "react";
import CommunityHeader from "@/components/community/CommunityHeader";

export const metadata = {
  title: "Community Knowledge Feed — Expendry",
  description:
    "Explore tacit machining knowledge, share workshop techniques, and earn EXPEN tokens on MST Testnet.",
};

export default function CommunityLayout({ children }) {
  return (
    <div className="flex-1 flex flex-col w-full">
      <CommunityHeader />
      {children}
    </div>
  );
}
