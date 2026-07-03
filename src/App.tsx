import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ActivitySquare,
  Bot,
  ClipboardList,
  FileDown,
  Mail as MailIcon,
  NotebookPen,
  Users,
  Workflow,
} from "lucide-react";
import Hero from "./components/Hero";
import DashboardCards from "./components/DashboardCards";
import PatientForm from "./components/PatientForm";
import PatientTable from "./components/PatientTable";
import PatientDetails from "./components/PatientDetails";
import EmailPreview from "./components/EmailPreview";
import OnboardingModal from "./components/OnboardingModal";
import type { FilterState, NewPatientInput, Patient } from "./types";
import { computePriority, generateSummary } from "./utils/summary";
import { generatePatientPdf } from "./utils/pdf";

const STORAGE_KEY = "carepilot_patients";
const FILTERS_KEY = "carepilot_filters";
const ONBOARDING_KEY = "carepilot_onboarded";

const DEFAULT_FILTERS: FilterState = {
  search: "",
  status: "All",
  priority: "All",
};

function buildPatient(
  input: NewPatientInput,
  overrides?: Partial<Patient>
): Patient {
  const priority = computePriority(input.symptoms);
  const summary = generateSummary(input, priority);
  const now = new Date().toISOString();
  return {
    ...input,
    id: crypto.randomUUID(),
    notes: "",
    summary,
    priority,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

function createDemoPatients(): Patient[] {
  const p1 = buildPatient({
    firstName: "Maya",
    lastName: "Okafor",
    email: "maya.okafor@example.com",
    phone: "(555) 201-3344",
    age: 68,
    insurance: "Aetna",
    symptoms: "Persistent fatigue, mild dizziness",
    history: "Type 2 diabetes, managed with diet and medication.",
    medications: "Metformin 500mg",
    status: "Needs Review",
  });

  const p2 = buildPatient({
    firstName: "Daniel",
    lastName: "Reyes",
    email: "daniel.reyes@example.com",
    phone: "(555) 442-7781",
    age: 54,
    insurance: "Blue Cross",
    symptoms: "Chest pain on exertion and shortness of breath",
    history: "Hypertension, family history of cardiac disease.",
    medications: "Lisinopril 10mg",
    status: "Follow-Up Required",
  });

  const p3 = buildPatient({
    firstName: "Sasha",
    lastName: "Lindberg",
    email: "sasha.lindberg@example.com",
    phone: "(555) 990-1123",
    age: 34,
    insurance: "Kaiser",
    symptoms: "Seasonal allergies, mild congestion",
    history: "No significant past medical history.",
    medications: "Loratadine 10mg as needed",
    status: "Completed",
  });

  return [p1, p2, p3];
}

const FEATURES = [
  {
    title: "AI Intake Summaries",
    description:
      "Automatically draft structured administrative summaries from patient intake data.",
    icon: Bot,
  },
  {
    title: "Patient Management",
    description:
      "Track every patient record in one searchable, filterable dashboard.",
    icon: Users,
  },
  {
    title: "Follow-Up Tracking",
    description:
      "Flag cases that need review or follow-up so nothing falls through the cracks.",
    icon: ClipboardList,
  },
  {
    title: "PDF Reports",
    description:
      "Generate polished, shareable administrative PDF reports in one click.",
    icon: FileDown,
  },
  {
    title: "Staff Notes",
    description:
      "Keep internal notes attached to each patient record for your team.",
    icon: NotebookPen,
  },
  {
    title: "Workflow Automation",
    description:
      "Reduce manual admin work with status tracking and follow-up email drafts.",
    icon: Workflow,
  },
];

export default function App() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(
    null
  );
  const [emailPatient, setEmailPatient] = useState<Patient | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const dashboardRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedPatients = localStorage.getItem(STORAGE_KEY);
    const storedFilters = localStorage.getItem(FILTERS_KEY);

    if (storedPatients) {
      try {
        setPatients(JSON.parse(storedPatients));
      } catch {
        setPatients(createDemoPatients());
      }
    } else {
      setPatients(createDemoPatients());
    }

    if (storedFilters) {
      try {
        setFilters(JSON.parse(storedFilters));
      } catch {
        setFilters(DEFAULT_FILTERS);
      }
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
  }, [patients, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(FILTERS_KEY, JSON.stringify(filters));
  }, [filters, hydrated]);

  useEffect(() => {
    if (selectedPatient) {
      const updated = patients.find((p) => p.id === selectedPatient.id);
      if (updated) setSelectedPatient(updated);
    }
  }, [patients]);

  const scrollToDashboard = () => {
    dashboardRef.current?.scrollIntoView({ behavior: "smooth" });
    const alreadyOnboarded = localStorage.getItem(ONBOARDING_KEY);
    if (!alreadyOnboarded) {
      setTimeout(() => setShowOnboarding(true), 500);
    }
  };

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem(ONBOARDING_KEY, "true");
  };

  const handleAddPatient = (input: NewPatientInput) => {
    const patient = buildPatient(input);
    setPatients((prev) => [patient, ...prev]);
  };

  const handleDeletePatient = (id: string) => {
    setPatients((prev) => prev.filter((p) => p.id !== id));
    if (selectedPatient?.id === id) setSelectedPatient(null);
  };

  const handleUpdateStatus = (id: string, status: Patient["status"]) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status, updatedAt: new Date().toISOString() }
          : p
      )
    );
  };

  const handleSaveNotes = (id: string, notes: string) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, notes, updatedAt: new Date().toISOString() } : p
      )
    );
  };

  const totalHighPriority = useMemo(
    () => patients.filter((p) => p.priority === "High Priority").length,
    [patients]
  );

  return (
    <div className="min-h-screen bg-base text-white">
      <Hero onLaunchDemo={scrollToDashboard} onSeeHowItWorks={scrollToFeatures} />

      <section
        id="features"
        ref={featuresRef}
        className="border-t border-white/5 bg-[#020404] px-6 py-24 md:px-12"
      >
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 max-w-2xl"
          >
            <span className="text-xs font-medium uppercase tracking-wide text-cyan-glow">
              Features
            </span>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Everything your front office needs
            </h2>
            <p className="mt-3 text-white/60">
              CarePilot AI centralizes intake, summaries, and follow-up so
              your staff spend less time on paperwork.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition hover:border-cyan-glow/30 hover:bg-white/[0.05]"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-glow/20 to-emerald-glow/20">
                  <feature.icon className="h-5 w-5 text-cyan-glow" />
                </div>
                <h3 className="text-base font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-white/55">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="dashboard"
        ref={dashboardRef}
        className="border-t border-white/5 bg-base px-6 py-24 md:px-12"
      >
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10 flex items-center gap-2"
          >
            <ActivitySquare className="h-5 w-5 text-cyan-glow" />
            <div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Operations Dashboard
              </h2>
              <p className="mt-1 text-sm text-white/50">
                Live demo — data is stored locally in your browser.
              </p>
            </div>
            {totalHighPriority > 0 && (
              <span className="ml-auto rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-medium text-rose-300">
                {totalHighPriority} high priority
              </span>
            )}
          </motion.div>

          <div className="mb-8">
            <DashboardCards patients={patients} />
          </div>

          <div className="mb-8">
            <PatientForm onAddPatient={handleAddPatient} />
          </div>

          <PatientTable
            patients={patients}
            filters={filters}
            onFiltersChange={setFilters}
            onView={setSelectedPatient}
            onDelete={handleDeletePatient}
          />
        </div>
      </section>

      <footer
        id="contact"
        className="border-t border-white/10 bg-[#020404] px-6 py-12 md:px-12"
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          <div className="flex items-center gap-2">
            <ActivitySquare className="h-5 w-5 text-cyan-glow" />
            <span className="text-sm font-semibold text-white">
              CarePilot AI
            </span>
          </div>
          <p className="max-w-xl text-xs text-white/40">
            CarePilot AI is for administrative support only and does not
            provide medical diagnosis or treatment recommendations.
          </p>
          <div className="flex items-center gap-4 text-xs text-white/40">
            <a
              href="mailto:hello@carepilot.ai"
              className="flex items-center gap-1.5 transition hover:text-white"
            >
              <MailIcon className="h-3.5 w-3.5" />
              hello@carepilot.ai
            </a>
          </div>
        </div>
        <div className="mx-auto mt-6 max-w-6xl border-t border-white/5 pt-6 text-center text-xs text-white/30 md:text-left">
          © 2026 CarePilot AI Demo MVP
        </div>
      </footer>

      <PatientDetails
        patient={selectedPatient}
        onClose={() => setSelectedPatient(null)}
        onUpdateStatus={handleUpdateStatus}
        onSaveNotes={handleSaveNotes}
        onGeneratePdf={generatePatientPdf}
        onCreateEmail={setEmailPatient}
      />

      <EmailPreview patient={emailPatient} onClose={() => setEmailPatient(null)} />

      <OnboardingModal open={showOnboarding} onClose={handleCloseOnboarding} />
    </div>
  );
}
