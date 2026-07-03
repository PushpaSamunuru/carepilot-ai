import { motion } from "framer-motion";
import {
  Users,
  UserPlus,
  AlertCircle,
  CalendarClock,
  CheckCircle2,
  Flame,
} from "lucide-react";
import type { Patient } from "../types";

interface DashboardCardsProps {
  patients: Patient[];
}

export default function DashboardCards({ patients }: DashboardCardsProps) {
  const cards = [
    {
      label: "Total Patients",
      value: patients.length,
      icon: Users,
      color: "text-cyan-glow",
    },
    {
      label: "New Intake",
      value: patients.filter((p) => p.status === "New Intake").length,
      icon: UserPlus,
      color: "text-sky-400",
    },
    {
      label: "Needs Review",
      value: patients.filter((p) => p.status === "Needs Review").length,
      icon: AlertCircle,
      color: "text-amber-400",
    },
    {
      label: "Follow-Up Required",
      value: patients.filter((p) => p.status === "Follow-Up Required").length,
      icon: CalendarClock,
      color: "text-orange-400",
    },
    {
      label: "Completed",
      value: patients.filter((p) => p.status === "Completed").length,
      icon: CheckCircle2,
      color: "text-emerald-glow",
    },
    {
      label: "High Priority",
      value: patients.filter((p) => p.priority === "High Priority").length,
      icon: Flame,
      color: "text-rose-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm transition hover:border-white/20 hover:bg-white/[0.05]"
        >
          <card.icon className={`h-5 w-5 ${card.color}`} />
          <div className="mt-3 text-2xl font-bold text-white">
            {card.value}
          </div>
          <div className="mt-1 text-xs text-white/50">{card.label}</div>
        </motion.div>
      ))}
    </div>
  );
}
