import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, UserPlus2 } from "lucide-react";
import type { NewPatientInput, PatientStatus } from "../types";

interface PatientFormProps {
  onAddPatient: (input: NewPatientInput) => void;
}

const STATUS_OPTIONS: PatientStatus[] = [
  "New Intake",
  "Needs Review",
  "Follow-Up Required",
  "Completed",
];

const EMPTY_FORM: NewPatientInput = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  age: 0,
  insurance: "",
  symptoms: "",
  history: "",
  medications: "",
  status: "New Intake",
};

export default function PatientForm({ onAddPatient }: PatientFormProps) {
  const [form, setForm] = useState<NewPatientInput>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof NewPatientInput>(
    key: K,
    value: NewPatientInput[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
      setError("First name, last name, and email are required.");
      return;
    }
    setError(null);
    onAddPatient(form);
    setForm(EMPTY_FORM);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm"
    >
      <div className="mb-5 flex items-center gap-2">
        <UserPlus2 className="h-5 w-5 text-cyan-glow" />
        <h3 className="text-lg font-semibold text-white">
          New Patient Intake
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="First Name">
          <input
            className="input"
            value={form.firstName}
            onChange={(e) => update("firstName", e.target.value)}
            placeholder="Maya"
          />
        </Field>
        <Field label="Last Name">
          <input
            className="input"
            value={form.lastName}
            onChange={(e) => update("lastName", e.target.value)}
            placeholder="Okafor"
          />
        </Field>
        <Field label="Email">
          <input
            type="email"
            className="input"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="patient@example.com"
          />
        </Field>
        <Field label="Phone">
          <input
            className="input"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="(555) 123-4567"
          />
        </Field>
        <Field label="Age">
          <input
            type="number"
            min={0}
            className="input"
            value={form.age === 0 ? "" : form.age}
            onChange={(e) => update("age", Number(e.target.value) || 0)}
            placeholder="42"
          />
        </Field>
        <Field label="Insurance Provider">
          <input
            className="input"
            value={form.insurance}
            onChange={(e) => update("insurance", e.target.value)}
            placeholder="Aetna"
          />
        </Field>
        <Field label="Status" full>
          <select
            className="input"
            value={form.status}
            onChange={(e) => update("status", e.target.value as PatientStatus)}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Symptoms" full>
          <textarea
            className="input min-h-[80px] resize-none"
            value={form.symptoms}
            onChange={(e) => update("symptoms", e.target.value)}
            placeholder="e.g. chest pain, shortness of breath..."
          />
        </Field>
        <Field label="Medical History" full>
          <textarea
            className="input min-h-[80px] resize-none"
            value={form.history}
            onChange={(e) => update("history", e.target.value)}
            placeholder="Relevant past conditions, surgeries, allergies..."
          />
        </Field>
        <Field label="Current Medications" full>
          <textarea
            className="input min-h-[80px] resize-none"
            value={form.medications}
            onChange={(e) => update("medications", e.target.value)}
            placeholder="List current medications..."
          />
        </Field>
      </div>

      {error && (
        <p className="mt-4 text-sm text-rose-400">{error}</p>
      )}

      <button
        type="submit"
        className="mt-6 flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-glow to-emerald-glow px-6 py-3 text-sm font-semibold text-black transition hover:brightness-110"
      >
        <Sparkles className="h-4 w-4" />
        Submit &amp; Generate AI Summary
      </button>
    </motion.form>
  );
}

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${full ? "sm:col-span-2" : ""}`}>
      <span className="text-xs font-medium text-white/60">{label}</span>
      {children}
    </label>
  );
}
