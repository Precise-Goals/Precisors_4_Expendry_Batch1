"use client";

import ChatInterface from "@/components/agent/ChatInterface";

export default function AgentPage() {
  return (
    <div className="agent-terminal-page min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center p-3 sm:p-6 lg:p-8 bg-transparent">
      <div className="w-full max-w-5xl h-[85vh] min-h-[640px] flex flex-col">
        <ChatInterface />
      </div>
    </div>
  );
}
