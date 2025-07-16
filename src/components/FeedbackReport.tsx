"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

type SkillStat = {
  name: string;
  percentage: number;
};

type FeedbackReportProps = {
  summary: string;
  skillStats: SkillStat[];
};

export default function FeedbackReport({ summary, skillStats }: FeedbackReportProps) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">📊 AI Feedback Summary</h1>

      <Card className="shadow-md">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Skill Deficiency Chart</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={skillStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="percentage" fill="#4f46e5" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">🧠 Full Summary Report</h2>
          <ScrollArea className="h-[500px] w-full rounded-md border p-4 bg-gray-50">
            <pre className="whitespace-pre-wrap text-sm text-gray-800">{summary}</pre>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
