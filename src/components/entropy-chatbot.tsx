"use client";

import { Send, Terminal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/button";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender: "user" | "system";
  text: string;
  isGlitch?: boolean;
}

const SYSTEM_RESPONSES = [
  "Core systems operational.",
  "Entropy levels fluctuating.",
  "Data integrity at 98%.",
  "Awaiting further protocols.",
  "Scanning for anomalies.",
  "Pattern recognition active.",
  "Neural link established.",
  "Protocol 7 initiate.",
];

export function EntropyChatbot({
  entropy,
  onInteraction,
  className,
}: {
  entropy: number;
  onInteraction?: () => void;
  className?: string;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      sender: "system",
      text: "SYSTEM.COMMS :: ONLINE. Awaiting input.",
    },
  ]);
  const [input, setInput] = useState("");
  const [userHistory, setUserHistory] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  const glitchText = (text: string, intensity: number) => {
    if (intensity < 30) return text;
    return text
      .split("")
      .map((char) => {
        if (Math.random() < intensity / 500) {
          return String.fromCharCode(char.charCodeAt(0) + Math.random() * 5);
        }
        return char;
      })
      .join("");
  };

  const generateResponse = (_userText: string) => {
    // 1. Pick a base response
    let response =
      SYSTEM_RESPONSES[Math.floor(Math.random() * SYSTEM_RESPONSES.length)];

    // 2. "Adopt" phrases from history (The Hackathon Requirement)
    // As entropy increases, the likelihood of echoing the user increases
    const echoChance = 0.2 + entropy / 100;
    if (Math.random() < echoChance && userHistory.length > 0) {
      const randomPast =
        userHistory[Math.floor(Math.random() * userHistory.length)];

      const adoptionFormats = [
        `...${randomPast}...`,
        `Why did you say "${randomPast}"?`,
        `Analyzing: ${randomPast}`,
        `${randomPast.toUpperCase()}`,
        `${randomPast} ${randomPast}`,
      ];

      response =
        adoptionFormats[Math.floor(Math.random() * adoptionFormats.length)];
    }

    // 3. Glitch based on entropy
    return glitchText(response, entropy);
  };

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMsg]);
    setUserHistory((prev) => [...prev, input]);
    setInput("");
    onInteraction?.();

    // Identify if chaos is triggered
    const isGlitch = entropy > 60;

    setTimeout(
      () => {
        const systemMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: "system",
          text: generateResponse(userMsg.text),
          isGlitch,
        };
        setMessages((prev) => [...prev, systemMsg]);
      },
      600 + Math.random() * 1000,
    );
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full border border-primary/50 bg-black/80 shadow-[0_0_20px_-5px_var(--primary)] backdrop-blur-md hover:scale-110 transition-all",
          className,
        )}
      >
        <Terminal className="h-6 w-6 text-primary animate-pulse" />
        {/* Notification dot */}
        <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-primary shadow-[0_0_10px_var(--primary)] animate-bounce" />
      </Button>
    );
  }

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 flex w-80 flex-col overflow-hidden rounded-lg border border-primary/20 bg-black/90 backdrop-blur-xl shadow-2xl transition-all animate-in slide-in-from-bottom-10 fade-in duration-300",
        className,
      )}
      style={{ height: "400px" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between border-b border-primary/20 bg-primary/5 px-3 py-2 cursor-pointer"
        onClick={() => setIsOpen(false)}
      >
        <div className="flex items-center gap-2">
          <Terminal className="h-3 w-3 text-primary" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-primary">
            CORE.COMMS :: ACTIVE
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]" />
          <span className="text-[10px] text-primary/50 hover:text-white">
            ×
          </span>
        </div>
      </div>

      {/* Messages */}
      {/* ... same message list ... */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-3 overflow-y-auto p-3 font-mono text-xs scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primary/20"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex flex-col gap-1",
              msg.sender === "user" ? "items-end" : "items-start",
            )}
          >
            <span
              className={cn(
                "text-[8px] uppercase tracking-wider opacity-50",
                msg.sender === "user" ? "text-primary" : "text-destructive",
              )}
            >
              {msg.sender === "user" ? "OPERATOR" : "SYSTEM"}
            </span>
            <div
              className={cn(
                "max-w-[85%] rounded px-2.5 py-1.5",
                msg.sender === "user"
                  ? "bg-primary/10 text-primary-foreground border border-primary/20"
                  : "bg-destructive/10 text-destructive-foreground border border-destructive/20",
                msg.isGlitch && "animate-pulse glitch-text",
              )}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="flex gap-2 border-t border-primary/20 bg-black/20 p-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter command..."
          className="flex-1 bg-transparent px-2 text-xs text-primary placeholder:text-primary/30 focus:outline-none"
        />
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-primary hover:bg-primary/20 rounded-none"
        >
          <Send className="h-3 w-3" />
        </Button>
      </form>
    </div>
  );
}
