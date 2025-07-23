"use client";
import { useEffect, useState } from "react";
import FeedbackReport from "@/components/FeedbackReport";

export default function SummaryPage() {
  const [summary, setSummary] = useState("");
  const [stats, setStats] = useState<{ name: string; percentage: number }[]>([]);

  useEffect(() => {
    fetch("/api/summary")
      .then(res => res.json())
      .then(data => {
        setSummary(data.summary);
        setStats(data.stats);
      });
  }, []);

  return <FeedbackReport summary={summary} skillStats={stats} />;
}
