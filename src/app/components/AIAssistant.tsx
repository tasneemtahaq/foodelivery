"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, User } from "lucide-react";
import { BUSINESS } from "@/lib/business";

interface Message {
  role:    "user" | "assistant";
  content: string;
}

const FIRST_MESSAGE =
  "Assalam o Alaikum! 👋 Welcome to Mama Soups. Hot soup, crispy fries or fresh puri — what are you craving today? I can suggest something tasty in seconds! 🍜";

const QUICK_REPLIES = [
  "What's popular? 🔥",
  "Soup + fries combo?",
  "Delivery to my area?",
  "Are you open today?",
];

const orangeGradient = "linear-gradient(135deg, #F97316, #EA580C)";

// The menu now loads from the database on the server, so this prop is no
// longer needed. It is still accepted so existing pages keep working.
export default function AIAssistant(_props: { menuItems?: unknown }) {
  const [isOpen,     setIsOpen]     = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const [messages,   setMessages]   = useState<Message[]>([
    { role: "assistant", content: FIRST_MESSAGE },
  ]);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Greet visitors with a small bubble, once per visit
  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout> | undefined;

    const showTimer = setTimeout(() => {
      try {
        if (sessionStorage.getItem("mamaGreeted")) return;
        sessionStorage.setItem("mamaGreeted", "1");
      } catch {
        // storage blocked: show the greeting anyway
      }
      setShowTeaser(true);
      hideTimer = setTimeout(() => setShowTeaser(false), 14000);
    }, 2500);

    return () => {
      clearTimeout(showTimer);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, []);

  // Scroll to the newest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, isOpen]);

  const openChat = () => {
    setShowTeaser(false);
    setIsOpen(true);
  };

  const send = async (text: string) => {
    const clean = text.trim();
    if (!clean || loading) return;

    const next: Message[] = [...messages, { role: "user", content: clean }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ messages: next.slice(-12) }),
      });
      const data = await res.json();

      if (!res.ok || !data.reply) throw new Error(data.error ?? "Failed");

      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role:    "assistant",
          content: `Sorry, I'm having a little trouble right now 🙏 You can still order from our Menu page, or call us on ${BUSINESS.phone}.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const bubble = {
    padding:    "9px 13px",
    fontSize:   "13px",
    lineHeight: 1.5,
    maxWidth:   "80%",
    whiteSpace: "pre-wrap",
    wordBreak:  "break-word",
  } as const;

  return (
    <>
      {/* ── Greeting bubble ── */}
      <AnimatePresence>
        {showTeaser && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            style={{
              position:     "fixed",
              right:        "24px",
              bottom:       "96px",
              zIndex:       60,
              width:        "min(270px, calc(100vw - 48px))",
              padding:      "14px 16px",
              borderRadius: "20px 20px 6px 20px",
              background:   "white",
              border:       "1px solid rgba(249,115,22,0.35)",
              boxShadow:    "0 14px 36px rgba(61,47,29,0.25)",
            }}
          >
            <button
              type="button"
              onClick={() => setShowTeaser(false)}
              aria-label="Close greeting"
              style={{
                position:   "absolute",
                top:        "8px",
                right:      "10px",
                background: "none",
                border:     "none",
                color:      "#9a9189",
                cursor:     "pointer",
              }}
            >
              <X size={14} />
            </button>

            <p style={{ fontSize: "13px", lineHeight: 1.5, color: "#222", paddingRight: "14px" }}>
              Assalam o Alaikum! 👋 Hungry? Tell me what you&apos;re in the mood
              for and I&apos;ll pick the perfect soup, fries or puri for you!
            </p>

            <button
              type="button"
              onClick={openChat}
              style={{
                marginTop:    "10px",
                padding:      "8px 16px",
                borderRadius: "999px",
                border:       "none",
                background:   orangeGradient,
                color:        "white",
                fontSize:     "12px",
                fontWeight:   700,
                cursor:       "pointer",
              }}
            >
              Chat with us 🍜
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Round chat button ── */}
      <button
        type="button"
        onClick={() => (isOpen ? setIsOpen(false) : openChat())}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        style={{
          position:       "fixed",
          right:          "24px",
          bottom:         "24px",
          zIndex:         60,
          width:          "60px",
          height:         "60px",
          borderRadius:   "50%",
          border:         "none",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          background:     orangeGradient,
          color:          "white",
          boxShadow:      "0 8px 26px rgba(249,115,22,0.55)",
          cursor:         "pointer",
        }}
      >
        {isOpen ? <X size={24} /> : <Bot size={26} />}
      </button>

      {/* ── Chat window ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            style={{
              position:      "fixed",
              right:         "24px",
              bottom:        "96px",
              zIndex:        60,
              width:         "min(390px, calc(100vw - 32px))",
              borderRadius:  "24px",
              overflow:      "hidden",
              background:    "#fffaf3",
              border:        "1px solid rgba(249,115,22,0.3)",
              boxShadow:     "0 24px 60px rgba(61,47,29,0.35)",
              display:       "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding:    "14px 18px",
                background: orangeGradient,
                display:    "flex",
                alignItems: "center",
                gap:        "12px",
              }}
            >
              <span
                style={{
                  width:          "38px",
                  height:         "38px",
                  borderRadius:   "50%",
                  background:     "rgba(255,255,255,0.22)",
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                  color:          "white",
                }}
              >
                <Bot size={20} />
              </span>
              <div>
                <p style={{ fontSize: "14px", fontWeight: 700, color: "white" }}>
                  Mama Soups Assistant
                </p>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.9)" }}>
                  Ask me anything — I&apos;ll help you order 🍜
                </p>
              </div>
            </div>

            {/* Messages */}
            <div
              style={{
                height:        "min(360px, 48vh)",
                overflowY:     "auto",
                padding:       "16px",
                display:       "flex",
                flexDirection: "column",
                gap:           "12px",
              }}
            >
              {messages.map((msg, i) => {
                const mine = msg.role === "user";
                return (
                  <div
                    key={i}
                    style={{
                      display:       "flex",
                      gap:           "8px",
                      flexDirection: mine ? "row-reverse" : "row",
                      alignItems:    "flex-start",
                    }}
                  >
                    <span
                      style={{
                        width:          "28px",
                        height:         "28px",
                        borderRadius:   "50%",
                        flexShrink:     0,
                        display:        "flex",
                        alignItems:     "center",
                        justifyContent: "center",
                        background:     mine ? "#e5e7eb" : orangeGradient,
                        color:          mine ? "#6B7280" : "white",
                      }}
                    >
                      {mine ? <User size={14} /> : <Bot size={14} />}
                    </span>
                    <div
                      style={{
                        ...bubble,
                        background:   mine ? orangeGradient : "white",
                        color:        mine ? "white" : "#222",
                        border:       mine ? "none" : "1px solid rgba(137,115,95,0.2)",
                        borderRadius: mine ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                      }}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })}

              {loading && (
                <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                  <span
                    style={{
                      width:          "28px",
                      height:         "28px",
                      borderRadius:   "50%",
                      display:        "flex",
                      alignItems:     "center",
                      justifyContent: "center",
                      background:     orangeGradient,
                      color:          "white",
                    }}
                  >
                    <Bot size={14} />
                  </span>
                  <div
                    style={{
                      ...bubble,
                      background:   "white",
                      border:       "1px solid rgba(137,115,95,0.2)",
                      borderRadius: "18px 18px 18px 4px",
                      color:        "#9a9189",
                    }}
                  >
                    Typing...
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* One-tap questions (only before the customer has chatted) */}
            {messages.length === 1 && (
              <div
                style={{
                  padding:  "0 16px 12px",
                  display:  "flex",
                  flexWrap: "wrap",
                  gap:      "8px",
                }}
              >
                {QUICK_REPLIES.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => send(q)}
                    style={{
                      padding:      "7px 13px",
                      borderRadius: "999px",
                      border:       "1.5px solid rgba(249,115,22,0.5)",
                      background:   "white",
                      color:        "#EA580C",
                      fontSize:     "12px",
                      fontWeight:   600,
                      cursor:       "pointer",
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Order buttons */}
            <div style={{ padding: "0 16px 12px", display: "flex", gap: "10px" }}>
              <Link
                href="/menu"
                style={{
                  flex:         1,
                  textAlign:    "center",
                  padding:      "10px",
                  borderRadius: "999px",
                  background:   orangeGradient,
                  color:        "white",
                  fontSize:     "12px",
                  fontWeight:   700,
                  boxShadow:    "0 6px 16px rgba(249,115,22,0.35)",
                }}
              >
                🍜 View Menu
              </Link>
              <Link
                href="/cart"
                style={{
                  flex:         1,
                  textAlign:    "center",
                  padding:      "8px",
                  borderRadius: "999px",
                  border:       "2px solid #F97316",
                  color:        "#EA580C",
                  fontSize:     "12px",
                  fontWeight:   700,
                }}
              >
                🛒 My Cart
              </Link>
            </div>

            {/* Typing box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              style={{
                padding:    "12px 14px",
                display:    "flex",
                alignItems: "center",
                gap:        "10px",
                borderTop:  "1px solid rgba(137,115,95,0.2)",
                background: "white",
              }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={loading}
                style={{
                  flex:         1,
                  padding:      "10px 14px",
                  borderRadius: "999px",
                  border:       "1px solid rgba(137,115,95,0.3)",
                  background:   "#fffaf3",
                  fontSize:     "13px",
                  color:        "#222",
                  outline:      "none",
                }}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send message"
                style={{
                  width:          "40px",
                  height:         "40px",
                  borderRadius:   "50%",
                  border:         "none",
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                  background:     input.trim() ? orangeGradient : "#e5e7eb",
                  color:          input.trim() ? "white" : "#9ca3af",
                  cursor:         input.trim() ? "pointer" : "not-allowed",
                }}
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}