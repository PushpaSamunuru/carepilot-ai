import { AnimatePresence, motion } from "framer-motion";
import { FileDown, ListChecks, Sparkles, UserPlus2, X } from "lucide-react";

interface OnboardingModalProps {
  open: boolean;
  onClose: () => void;
}

const STEPS = [
  {
    title: "Add Patient",
    description: "Capture intake details with the patient form.",
    icon: UserPlus2,
  },
  {
    title: "Generate AI Summary",
    description: "CarePilot AI drafts a structured intake summary.",
    icon: Sparkles,
  },
  {
    title: "Review Details",
    description: "Open the patient panel to review status and notes.",
    icon: ListChecks,
  },
  {
    title: "Export PDF",
    description: "Generate a shareable administrative PDF report.",
    icon: FileDown,
  },
];

export default function OnboardingModal({
  open,
  onClose,
}: OnboardingModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl rounded-2xl border border-white/10 bg-[#080b0b] p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Welcome to the CarePilot AI Demo
              </h3>
              <button
                onClick={onClose}
                className="rounded-lg border border-white/10 p-1.5 text-white/60 transition hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mb-5 text-sm text-white/60">
              Follow these four steps to see how CarePilot AI streamlines
              patient intake and administrative workflow.
            </p>

            <div className="space-y-3">
              {STEPS.map((step, i) => (
                <div
                  key={step.title}
                  className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-cyan-glow to-emerald-glow text-xs font-bold text-black">
                    {i + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <step.icon className="h-4 w-4 text-cyan-glow" />
                      <span className="text-sm font-semibold text-white">
                        {step.title}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-white/50">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={onClose}
              className="mt-6 w-full rounded-full bg-gradient-to-r from-cyan-glow to-emerald-glow px-4 py-3 text-sm font-semibold text-black transition hover:brightness-110"
            >
              Got it, let's go
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
