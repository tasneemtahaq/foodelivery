"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, User } from "lucide-react";


interface Message {
  role:    "user" | "assistant";
  content: string;
}

interface MenuItem {
  id:          number;
  name:        string;
  price:       number;
  offerPrice:  number | null;
  description: string;
  category:    string;
}

interface AIAssistantProps {
  menuItems: MenuItem[];
}

export default function AIAssistant({ menuItems }: AIAssistantProps) {
  const [isOpen,   setIsOpen]   = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role:    "assistant",
      content: "السلام علیکم! 👋 I'm your Mama Soups assistant! I can help you explore our menu, suggest dishes, and answer any questions. What are you craving today? 🍜",
    },
  ]);
  const [input,    setInput]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const bottomRef              = useRef<HTMLDivElement>(null);
  

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: userMessage },
    ];

    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages:  newMessages.map((m) => ({
            role:    m.role,
            content: m.content,
          })),
          menuItems,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);

    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role:    "assistant",
          content: "Sorry, I'm having trouble right now. Please try again! 🙏",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* ── Floating Button ── */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
        style={{
          background: "linear-gradient(135deg, #F97316, #EA580C)",
          boxShadow:  "0 4px 24px rgba(249,115,22,0.5)",
        }}
        onClick={() => setIsOpen((o) => !o)}
        whileHover={{ scale: 1.1 }}
        whileTap={{  scale: 0.95 }}
        animate={isOpen ? {} : {
          y: [0, -6, 0],
        }}
        transition={isOpen ? {} : {
          duration: 2,
          repeat:   Infinity,
          ease:     "easeInOut",
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0,   opacity: 1 }}
              exit={{    rotate:  90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={22} color="white" />
            </motion.div>
          ) : (
            <motion.div
              key="bot"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0,  opacity: 1 }}
              exit={{    rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Bot size={22} color="white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ── Chat Window ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: "white",
              border:     "1px solid rgba(249,115,22,0.2)",
            }}
            initial={{ opacity: 0, y: 20,  scale: 0.95 }}
            animate={{ opacity: 1, y: 0,   scale: 1    }}
            exit={{    opacity: 0, y: 20,  scale: 0.95 }}
            transition={{ duration: 0.25 }}
          >
            {/* Header */}
            <div
              className="px-4 py-3 flex items-center gap-3"
              style={{ background: "linear-gradient(135deg, #F97316, #EA580C)" }}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.2)" }}
              >
                <Bot size={20} color="white" />
              </div>
              <div>
                <p className="font-bold text-white text-sm">Mama Soups Assistant</p>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.85)" }}>
                    Online — here to help!
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div
              className="flex flex-col gap-3 p-4 overflow-y-auto"
              style={{ height: "320px" }}
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0  }}
                >
                  {/* Avatar */}
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1"
                    style={{
                      background: msg.role === "assistant"
                        ? "linear-gradient(135deg, #F97316, #EA580C)"
                        : "#E5E7EB",
                    }}
                  >
                    {msg.role === "assistant"
                      ? <Bot  size={14} color="white" />
                      : <User size={14} color="#6B7280" />
                    }
                  </div>

                  {/* Bubble */}
                  <div
                    className="max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed"
                    style={{
                      padding: "6px 12px",
                      background: msg.role === "assistant"
                        ? "#FFF7ED"
                        : "#F97316",
                      color: msg.role === "assistant"
                        ? "#1F2937"
                        : "white",
                      borderBottomLeftRadius:  msg.role === "assistant" ? "4px" : "16px",
                      borderBottomRightRadius: msg.role === "user"      ? "4px" : "16px",
                    }}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {/* Loading dots */}
              {loading && (
                <div className="flex gap-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                    style={{padding: "4px 2px", background: "linear-gradient(135deg, #F97316, #EA580C)" }}
                  >
                    <Bot size={14} color="white" />
                  </div>
                  <div
                    className="px-4 py-3 rounded-2xl flex items-center gap-1"
                    style={{padding: "6px 12px", background: "#FFF7ED", borderBottomLeftRadius: "4px" }}
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full"
                        style={{ padding:"4px 2px",background: "#F97316" }}
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat:   Infinity,
                          delay:    i * 0.15,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Quick Suggestions */}
            {messages.length === 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {[
                  "What's popular? 🔥",
                  "Soup prices?",
                  "Delivery areas?",
                  "Opening hours?",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={async () => {
                    setInput(suggestion);
                    // Small delay to let state update
                    await new Promise(r => setTimeout(r, 50));
                    const userMessage = suggestion;
                    setInput("");
                    const newMessages: Message[] = [
                      ...messages,
                      { role: "user", content: userMessage },
                    ];
                    setMessages(newMessages);
                    setLoading(true);

                    try {
                      const response = await fetch("/api/chat", {
                        method:  "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          messages:  newMessages.map((m) => ({
                            role:    m.role,
                            content: m.content,
                          })),
                          menuItems,
                        }),
                      });
                      const data = await response.json();
                      setMessages((prev) => [
                        ...prev,
                        { role: "assistant", content: data.reply },
                      ]);
                    } catch {
                      setMessages((prev) => [
                        ...prev,
                        { role: "assistant", content: "Sorry, try again! 🙏" },
                      ]);
                    } finally {
                      setLoading(false);
                    }
                  }}
                    className="px-3 py-1 rounded-full text-xs font-medium border transition-all hover:bg-orange-50"
                    style={{
                      padding:     "6px 12px",
                      borderColor: "rgba(249,115,22,0.3)",
                      color:       "#F97316",
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div
              className="px-3 py-3 flex items-center gap-2"
              style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                className="flex-1 text-sm outline-none px-3 py-2 rounded-xl"
                style={{
                  padding:     "8px 12px",
                  background: "#F9FAFB",
                  border:     "1px solid rgba(0,0,0,0.08)",
                  color:      "#1F2937",
                }}
                disabled={loading}
              />
              <motion.button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  padding: "8px 10px",
                  background: input.trim()
                    ? "linear-gradient(135deg, #F97316, #EA580C)"
                    : "#E5E7EB",
                }}
                whileTap={{ scale: 0.9 }}
              >
                <Send size={16} color={input.trim() ? "white" : "#9CA3AF"} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}