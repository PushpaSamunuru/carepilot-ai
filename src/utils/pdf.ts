import jsPDF from "jspdf";
import type { Patient } from "../types";

export function generatePatientPdf(patient: Patient): void {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const marginX = 48;
  let y = 56;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(20, 20, 20);
  doc.text("CarePilot AI", marginX, y);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(90, 90, 90);
  y += 18;
  doc.text("Administrative Patient Intake Report", marginX, y);

  y += 8;
  doc.setDrawColor(200, 200, 200);
  doc.line(marginX, y, 547, y);

  const addField = (label: string, value: string) => {
    y += 26;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(30, 30, 30);
    doc.text(label, marginX, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    const lines = doc.splitTextToSize(value || "N/A", 420);
    doc.text(lines, marginX + 140, y);
    y += Math.max(0, (lines.length - 1) * 14);
  };

  y += 10;
  addField("Patient Name:", `${patient.firstName} ${patient.lastName}`);
  addField("Age:", String(patient.age));
  addField("Email:", patient.email);
  addField("Phone:", patient.phone);
  addField("Insurance Provider:", patient.insurance);
  addField("Status:", patient.status);
  addField("Priority:", patient.priority);

  y += 20;
  doc.setDrawColor(220, 220, 220);
  doc.line(marginX, y, 547, y);

  addField("Symptoms:", patient.symptoms);
  addField("Medical History:", patient.history);
  addField("Medications:", patient.medications);

  y += 30;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(20, 20, 20);
  doc.text("AI Intake Summary", marginX, y);
  y += 16;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(60, 60, 60);
  const summaryLines = doc.splitTextToSize(
    patient.summary || "No summary generated.",
    500
  );
  doc.text(summaryLines, marginX, y);
  y += summaryLines.length * 12 + 20;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(20, 20, 20);
  doc.text("Staff Notes", marginX, y);
  y += 16;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(60, 60, 60);
  const notesLines = doc.splitTextToSize(
    patient.notes || "No staff notes recorded.",
    500
  );
  doc.text(notesLines, marginX, y);
  y += notesLines.length * 12 + 30;

  if (y > 720) {
    doc.addPage();
    y = 56;
  }

  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(`Generated: ${new Date().toLocaleString()}`, marginX, y);

  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(8);
  doc.setTextColor(140, 140, 140);
  const disclaimer = doc.splitTextToSize(
    "CarePilot AI is a demo administrative tool and does not provide medical diagnosis or treatment recommendations. This report is for administrative use only.",
    500
  );
  doc.text(disclaimer, marginX, pageHeight - 40);

  doc.save(`CarePilot-Report-${patient.firstName}-${patient.lastName}.pdf`);
}
