"use client";

import { ChevronUp } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { usePlaySound } from "../ui/sensory-ui/config/use-play-sound";

const PLACEHOLDERS = [
  "Say hello...",
  "Ask me anything...",
  "What's on your mind?",
  "Start a conversation...",
  "Drop me a message...",
];

const CYCLE_INTERVAL = 3000;

export default function ContactForm() {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"message" | "email" | "success">("message");
  const [index, setIndex] = useState(0);
  const [sending, setSending] = useState(false);

  const { play } = usePlaySound({
    sound: "interaction.subtle",
  });

  useEffect(() => {
    if (message) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, CYCLE_INTERVAL);

    return () => clearInterval(interval);
  }, [message]);

  function handleNext() {
    if (!message.trim()) return;
    setStep("email");
  }

  async function handleSend() {
    if (!email.trim() || !message.trim()) return;

    try {
      setSending(true);

      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, email }),
      });

      setStep("success");

      // reset after showing success
      setTimeout(() => {
        setMessage("");
        setEmail("");
        setStep("message");
      }, 2200);
    } finally {
      setSending(false);
    }
  }

  const isEmailStep = step === "email";
  const isSuccessStep = step === "success";

  return (
    <motion.div
      layout
      transition={{
        layout: { duration: 0.3, ease: "easeInOut" },
      }}
      className="flex flex-col mx-1 mb-1 px-3 pt-2.5 pb-2 min-h-[82px] rounded-xl bg-text-highlight/[0.04] relative"
    >
      <AnimatePresence mode="wait">
        {step === "message" && (
          <motion.div
            key="message"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="relative"
          >
            <textarea
              className="block w-full bg-transparent text-[12px] leading-5 text-text-highlight outline-none resize-none border-0"
              rows={1}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                play();
              }}
            />

            <AnimatePresence mode="wait">
              {!message && (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-0 left-0 text-[12px] leading-5 text-foreground/25 pointer-events-none"
                >
                  {PLACEHOLDERS[index]}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {step === "email" && (
          <motion.div
            key="email"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.1 }}
            className="space-y-3"
          >
            <div className="text-[11px] text-foreground/40 border-l border-foreground/10 pl-2">
              {message}
            </div>

            <input
              autoFocus
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent text-[12px] text-text-highlight outline-none"
            />
          </motion.div>
        )}

        {step === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="flex flex-col items-start gap-1"
          >
            <div className="text-[12px] text-text-highlight">
              Message sent!
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {step !== "success" && (
        <div className="flex items-center justify-end mt-4">
          <button
            onClick={isEmailStep ? handleSend : handleNext}
            disabled={
              isEmailStep ? !email.trim() || sending : !message.trim()
            }
            className="w-7 h-7 flex items-center justify-center rounded-full bg-text-highlight/20 text-text-highlight disabled:bg-text-highlight/10 disabled:text-background transition-colors"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={isEmailStep ? "send" : "next"}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.1 }}
              >
                <ChevronUp className="w-4 h-4" />
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      )}
    </motion.div>
  );
}
