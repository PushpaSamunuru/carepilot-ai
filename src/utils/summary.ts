import type { Patient, PriorityLevel } from "../types";

const HIGH_RISK_KEYWORDS = [
  "chest pain",
  "shortness of breath",
  "stroke",
  "severe bleeding",
  "confusion",
];

export function computePriority(symptoms: string): PriorityLevel {
  const lower = symptoms.toLowerCase();
  const isHighRisk = HIGH_RISK_KEYWORDS.some((keyword) =>
    lower.includes(keyword)
  );
  return isHighRisk ? "High Priority" : "Standard Review";
}

export function generateSummary(
  input: Pick<
    Patient,
    "firstName" | "lastName" | "age" | "symptoms" | "history" | "medications"
  >,
  priority: PriorityLevel
): string {
  const { firstName, lastName, age, symptoms, history, medications } = input;

  const followUp =
    priority === "High Priority"
      ? "Reported symptoms include indicators that warrant escalation. Staff should escalate this case for immediate clinician review."
      : "No high-risk indicators detected. Schedule a standard follow-up within 48 hours.";

  return `Patient Summary:
${firstName} ${lastName}, age ${age}, presenting with reported symptoms: ${symptoms || "Not specified"}.

Medical Background:
${history || "No significant history reported."}

Current Medications:
${medications || "None reported."}

Suggested Follow-Up:
${followUp}

Priority Level:
${priority}

Admin Action:
Verify insurance and route to intake coordinator.

Disclaimer:
This is a demo administrative summary, not medical diagnosis or treatment advice.`;
}
