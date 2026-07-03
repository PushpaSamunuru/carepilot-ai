import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  FileDown,
  Mail,
  X,
  AlertCircle,
} from "lucide-react";
import type { Patient } from "../types";

interface PatientDetailsProps {
  patient: Patient | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: Patient["status"]) => void;
  onSaveNotes: (id: string, notes: string) => void;
  onGeneratePdf: (patient: Patient) => void;
  onCreateEmail: (patient: Patient) => void;
}

export default function PatientDetails({
  patient,
  onClose,
  onUpdateStatus,
  onSaveNotes,
  onGeneratePdf,
  onCreateEmail,
}: PatientDetailsProps) {
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setNotes(patient?.notes ?? "");
    setSaved(false);
  }, [patient?.id]);

  const handleSaveNotes = () => {
    if (!patient) return;
    onSaveNotes(patient.id, notes);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <AnimatePresence>
      {patient && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-lg overflow-y-auto border-l border-white/10 bg-[#050808] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {patient.firstName} {patient.lastName}
                </h2>
                <p className="text-xs text-white/40">
                  Patient ID: {patient.id}
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg border border-white/10 p-2 text-white/60 transition hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <InfoRow label="Age" value={String(patient.age)} />
                <InfoRow label="Insurance" value={patient.insurance} />
                <InfoRow label="Email" value={patient.email} />
                <InfoRow label="Phone" value={patient.phone} />
                <InfoRow label="Status" value={patient.status} />
                <InfoRow label="Priority" value={patient.priority} />
                <InfoRow
                  label="Created"
                  value={new Date(patient.createdAt).toLocaleString()}
                />
                <InfoRow
                  label="Updated"
                  value={new Date(patient.updatedAt).toLocaleString()}
                />
              </div>

              <Section title="Symptoms">
                <p className="text-sm text-white/70">
                  {patient.symptoms || "None reported."}
                </p>
              </Section>

              <Section title="Medical History">
                <p className="text-sm text-white/70">
                  {patient.history || "None reported."}
                </p>
              </Section>

              <Section title="Medications">
                <p className="text-sm text-white/70">
                  {patient.medications || "None reported."}
                </p>
              </Section>

              <Section title="AI Intake Summary">
                <pre className="whitespace-pre-wrap rounded-xl border border-white/10 bg-white/[0.02] p-4 font-sans text-sm text-white/70">
                  {patient.summary}
                </pre>
              </Section>

              <Section title="Staff Notes">
                <textarea
                  className="input min-h-[100px] w-full resize-none"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add internal staff notes..."
                />
                <div className="mt-2 flex items-center gap-3">
                  <button
                    onClick={handleSaveNotes}
                    className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-white transition hover:bg-white/10"
                  >
                    Save Notes
                  </button>
                  {saved && (
                    <span className="text-xs text-emerald-glow">Saved</span>
                  )}
                </div>
              </Section>

              <div className="flex flex-col gap-2 border-t border-white/10 pt-5">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onUpdateStatus(patient.id, "Needs Review")}
                    className="flex items-center justify-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-2.5 text-xs font-medium text-amber-300 transition hover:bg-amber-500/20"
                  >
                    <AlertCircle className="h-3.5 w-3.5" />
                    Mark as Needs Review
                  </button>
                  <button
                    onClick={() => onUpdateStatus(patient.id, "Completed")}
                    className="flex items-center justify-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 text-xs font-medium text-emerald-300 transition hover:bg-emerald-500/20"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Mark as Completed
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onGeneratePdf(patient)}
                    className="flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-cyan-glow to-emerald-glow px-3 py-2.5 text-xs font-semibold text-black transition hover:brightness-110"
                  >
                    <FileDown className="h-3.5 w-3.5" />
                    Generate PDF Report
                  </button>
                  <button
                    onClick={() => onCreateEmail(patient)}
                    className="flex items-center justify-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-2.5 text-xs font-medium text-white transition hover:bg-white/10"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    Create Follow-Up Email
                  </button>
                </div>
                <button
                  onClick={onClose}
                  className="mt-1 rounded-full border border-white/10 px-3 py-2.5 text-xs font-medium text-white/60 transition hover:text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-white/35">
        {label}
      </div>
      <div className="mt-0.5 text-white/85">{value}</div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/40">
        {title}
      </h4>
      {children}
    </div>
  );
}
