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
const SUCCESS_RESET_DELAY = 2200;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Step = "message" | "email" | "success";

export default function ContactForm() {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<Step>("message");
  const [index, setIndex] = useState(0);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { play } = usePlaySound({ sound: "interaction.subtle" });

  useEffect(() => {
    if (message) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, CYCLE_INTERVAL);
    return () => clearInterval(interval);
  }, [message]);

  useEffect(() => {
    if (step !== "success") return;
    const timer = setTimeout(() => {
      setMessage("");
      setEmail("");
      setStep("message");
    }, SUCCESS_RESET_DELAY);
    return () => clearTimeout(timer);
  }, [step]);

  const emailIsValid = EMAIL_REGEX.test(email.trim());

  function handleNext() {
    if (!message.trim()) return;
    setError(null);
    setStep("email");
  }

  async function handleSend() {
    if (sending || !emailIsValid || !message.trim()) return;

    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim(), email: email.trim() }),
      });

      if (!res.ok) {
        setError("Something went wrong. Please try again.");
        return;
      }

      setStep("success");
    } catch {
      setError("Couldn't reach the server — check your connection.");
    } finally {
      setSending(false);
    }
  }

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (step === "email") handleSend();
    else handleNext();
  }

  const isEmailStep = step === "email";

  return (
    <motion.form
      layout
      onSubmit={handleSubmit}
      transition={{ layout: { duration: 0.3, ease: "easeInOut" } }}
      className="flex flex-col mx-1 mb-1 px-3 pt-2.5 pb-2 min-h-20.5 rounded-xl bg-text-highlight/4 relative"
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
            <label htmlFor="contact-message" className="sr-only">
              Your message
            </label>
            <textarea
              id="contact-message"
              className="block w-full bg-transparent text-[12px] leading-5 text-text-highlight outline-none resize-none border-0"
              rows={1}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                play();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleNext();
                }
              }}
            />

            <AnimatePresence mode="wait">
              {!message && (
                <motion.span
                  key={index}
                  aria-hidden
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

            <label htmlFor="contact-email" className="sr-only">
              Your email address
            </label>
            <input
              id="contact-email"
              autoFocus
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
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
            <div role="status" className="text-[12px] text-text-highlight">
              Message sent!
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p role="alert" className="mt-2 text-[11px] text-red-400/80">
          {error}
        </p>
      )}

      {step !== "success" && (
        <div className="flex items-center justify-end mt-4">
          <button
            type="submit"
            aria-label={isEmailStep ? "Send message" : "Continue to email"}
            aria-busy={sending}
            disabled={isEmailStep ? !emailIsValid || sending : !message.trim()}
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
                <ChevronUp className="w-4 h-4" aria-hidden />
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      )}
    </motion.form>
  );
}
