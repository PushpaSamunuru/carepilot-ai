export type PatientStatus =
  | "New Intake"
  | "Needs Review"
  | "Follow-Up Required"
  | "Completed";

export type PriorityLevel = "High Priority" | "Standard Review";

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: number;
  insurance: string;
  symptoms: string;
  history: string;
  medications: string;
  status: PatientStatus;
  notes: string;
  summary: string;
  priority: PriorityLevel;
  createdAt: string;
  updatedAt: string;
}

export type NewPatientInput = Omit<
  Patient,
  "id" | "notes" | "summary" | "priority" | "createdAt" | "updatedAt"
>;

export interface FilterState {
  search: string;
  status: PatientStatus | "All";
  priority: PriorityLevel | "All";
}
