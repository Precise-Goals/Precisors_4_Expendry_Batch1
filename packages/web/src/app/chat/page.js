"use client";

import ChatInterface from "@/components/agent/ChatInterface";

export default function ChatPage() {
  return (
    <div className="chat-pulse-page flex flex-col items-center justify-start py-4 sm:py-6 px-3 sm:px-6 lg:px-8 bg-transparent">
      <div className="w-full max-w-5xl xl:max-w-6xl flex flex-col">
        <ChatInterface />
      </div>
    </div>
  );
}
