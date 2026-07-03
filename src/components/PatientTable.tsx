import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Eye, Search, Trash2, Users2 } from "lucide-react";
import type { FilterState, Patient, PatientStatus, PriorityLevel } from "../types";

interface PatientTableProps {
  patients: Patient[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onView: (patient: Patient) => void;
  onDelete: (id: string) => void;
}

const STATUS_OPTIONS: PatientStatus[] = [
  "New Intake",
  "Needs Review",
  "Follow-Up Required",
  "Completed",
];

const PRIORITY_OPTIONS: PriorityLevel[] = ["High Priority", "Standard Review"];

const STATUS_STYLES: Record<PatientStatus, string> = {
  "New Intake": "bg-sky-500/15 text-sky-300 border-sky-500/30",
  "Needs Review": "bg-amber-500/15 text-amber-300 border-amber-500/30",
  "Follow-Up Required": "bg-orange-500/15 text-orange-300 border-orange-500/30",
  Completed: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
};

const PRIORITY_STYLES: Record<PriorityLevel, string> = {
  "High Priority": "bg-rose-500/15 text-rose-300 border-rose-500/30",
  "Standard Review": "bg-white/10 text-white/60 border-white/15",
};

export default function PatientTable({
  patients,
  filters,
  onFiltersChange,
  onView,
  onDelete,
}: PatientTableProps) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const query = filters.search.trim().toLowerCase();
    return patients.filter((p) => {
      const matchesQuery =
        !query ||
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(query) ||
        p.email.toLowerCase().includes(query) ||
        p.phone.toLowerCase().includes(query);
      const matchesStatus =
        filters.status === "All" || p.status === filters.status;
      const matchesPriority =
        filters.priority === "All" || p.priority === filters.priority;
      return matchesQuery && matchesStatus && matchesPriority;
    });
  }, [patients, filters]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm">
      <div className="flex flex-col gap-3 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Users2 className="h-5 w-5 text-cyan-glow" />
          <h3 className="text-lg font-semibold text-white">Patients</h3>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              className="input w-full pl-9 sm:w-56"
              placeholder="Search name, email, phone..."
              value={filters.search}
              onChange={(e) =>
                onFiltersChange({ ...filters, search: e.target.value })
              }
            />
          </div>
          <select
            className="input"
            value={filters.status}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                status: e.target.value as PatientStatus | "All",
              })
            }
          >
            <option value="All">All Statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            className="input"
            value={filters.priority}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                priority: e.target.value as PriorityLevel | "All",
              })
            }
          >
            <option value="All">All Priorities</option>
            {PRIORITY_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
          <p className="text-sm font-medium text-white/70">
            No patient records yet.
          </p>
          <p className="text-xs text-white/40">
            Add your first patient to generate an AI intake summary.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-white/40">
                <th className="px-5 py-3 font-medium">Patient</th>
                <th className="px-5 py-3 font-medium">Age</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Phone</th>
                <th className="px-5 py-3 font-medium">Insurance</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Priority</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  className="border-b border-white/5 transition hover:bg-white/[0.03]"
                >
                  <td className="px-5 py-3 font-medium text-white">
                    {p.firstName} {p.lastName}
                  </td>
                  <td className="px-5 py-3 text-white/70">{p.age}</td>
                  <td className="px-5 py-3 text-white/70">{p.email}</td>
                  <td className="px-5 py-3 text-white/70">{p.phone}</td>
                  <td className="px-5 py-3 text-white/70">{p.insurance}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[p.status]}`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${PRIORITY_STYLES[p.priority]}`}
                    >
                      {p.priority}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onView(p)}
                        className="rounded-lg border border-white/10 p-2 text-white/60 transition hover:border-cyan-glow/40 hover:text-cyan-glow"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() =>
                          confirmDeleteId === p.id
                            ? (onDelete(p.id), setConfirmDeleteId(null))
                            : setConfirmDeleteId(p.id)
                        }
                        className={`rounded-lg border p-2 transition ${
                          confirmDeleteId === p.id
                            ? "border-rose-500/50 bg-rose-500/10 text-rose-400"
                            : "border-white/10 text-white/60 hover:border-rose-500/40 hover:text-rose-400"
                        }`}
                        title={
                          confirmDeleteId === p.id
                            ? "Click again to confirm"
                            : "Delete"
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
