import { NextResponse } from "next/server";
import { fetchFeedbackData } from "@/lib/db";
import { formatSingleFeedback, getSkillDeficiencyPercentages } from "@/lib/formatter";
import { summarizeFeedback } from "@/lib/summarizer";

export async function GET() {
  const rows = await fetchFeedbackData();
  const formatted = rows.map(formatSingleFeedback).join("\n\n");
  const stats = getSkillDeficiencyPercentages(rows);

  const statText = stats.map(s => `- ${s.percentage}% of students had low ${s.name}.`).join("\n");
  const finalPrompt = `Skill Deficiencies:\n${statText}\n\nFeedback:\n${formatted}`;

  const summary = await summarizeFeedback(finalPrompt);

  return NextResponse.json({ summary, stats });
}
