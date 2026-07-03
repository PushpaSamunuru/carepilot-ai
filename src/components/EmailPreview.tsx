import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Mail, X } from "lucide-react";
import type { Patient } from "../types";

interface EmailPreviewProps {
  patient: Patient | null;
  onClose: () => void;
}

function buildEmail(patient: Patient): string {
  return `Hello ${patient.firstName},

Thank you for completing your intake with CarePilot AI.

Our team reviewed your information and will contact you regarding next steps.

Current Status: ${patient.status}

Best,
CarePilot AI Team`;
}

export default function EmailPreview({ patient, onClose }: EmailPreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!patient) return;
    try {
      await navigator.clipboard.writeText(buildEmail(patient));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <AnimatePresence>
      {patient && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#080b0b] p-6 shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-cyan-glow" />
                <h3 className="text-lg font-semibold text-white">
                  Follow-Up Email Preview
                </h3>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg border border-white/10 p-1.5 text-white/60 transition hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <pre className="whitespace-pre-wrap font-sans text-sm text-white/80">
                {buildEmail(patient)}
              </pre>
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white/60 transition hover:text-white"
              >
                Close
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-glow to-emerald-glow px-4 py-2 text-sm font-semibold text-black transition hover:brightness-110"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy to Clipboard
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
