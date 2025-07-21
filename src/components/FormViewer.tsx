"use client";

import React, { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader, FileText, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface Question {
  id: string;
  question: string;
  type: "DESCRIPTIVE" | "RATING";
  required: boolean;
}

interface FeedbackForm {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

interface Props {
  formId: string;
}

export const FormViewer: React.FC<Props> = ({ formId }) => {
  const [form, setForm] = useState<FeedbackForm | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await fetch(`/api/forms/${formId}`);
        const data = await res.json();
        setForm(data);
      } catch (err) {
        toast.error("Failed to load form", {
          position: "top-center",
          duration: 2000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [formId]);

  const handleChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!form) return;

    const missingRequired = form.questions.some(
      (q) => q.required && !answers[q.id]
    );

    if (missingRequired) {
      toast.error("Please fill all required fields", {
        position: "top-center",
        duration: 2000,
      });
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`/api/forms/${formId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: Object.entries(answers).map(([questionId, responseText]) => ({
            questionId,
            responseText,
          })),
        }),
      });

      if (res.ok) {
        toast.success("Response submitted successfully!", {
          position: "top-center",
          duration: 2000,
        });
        setAnswers({});
      } else {
        throw new Error("Submission failed");
      }
    } catch (err) {
      toast.error("Something went wrong", {
        position: "top-center",
        duration: 2000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader className="h-8 w-8 text-blue-400 animate-spin" />
      </div>
    );

  if (!form) 
    return (
      <div className="text-center py-16">
        <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-8 max-w-md mx-auto backdrop-blur-sm">
          <div className="bg-red-500/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-100 mb-2">Form not found</h3>
          <p className="text-gray-400">The requested form could not be loaded.</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto bg-gray-900/70 border border-gray-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-xl">
        {/* Form Header */}
        <div className="mb-8">
          <div className="flex items-start gap-4 mb-2">
            <div className="bg-blue-500/10 p-3 rounded-xl">
              <FileText className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {form.title}
              </h1>
              {form.description && (
                <p className="text-gray-400 mt-2">{form.description}</p>
              )}
            </div>
          </div>
          <div className="border-b border-gray-800 pt-4"></div>
        </div>

        {/* Questions */}
        <div className="space-y-8">
          {form.questions.map((q, index) => (
            <div key={q.id} className="space-y-3">
              <label className="block font-medium text-gray-300">
                <span className="text-blue-400">{index + 1}.</span> {q.question}
                {q.required && <span className="text-red-400 ml-1">*</span>}
              </label>

              {q.type === "DESCRIPTIVE" && (
                <Textarea
                  value={answers[q.id] || ""}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  placeholder="Type your answer here..."
                  className="bg-gray-800/50 border-gray-700 text-gray-100 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent min-h-[120px]"
                />
              )}

              {q.type === "RATING" && (
                <Select
                  value={answers[q.id] || ""}
                  onValueChange={(val) => handleChange(q.id, val)}
                >
                  <SelectTrigger className="bg-gray-800/50 border-gray-700 text-gray-100 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent h-12">
                    <SelectValue placeholder="Select a rating (1-5)" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-gray-100">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <SelectItem 
                        key={num} 
                        value={String(num)}
                        className="hover:bg-gray-700/50 focus:bg-gray-700/50"
                      >
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-10">
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full h-12 bg-blue-600/90 hover:bg-blue-500/90 text-white text-lg font-medium rounded-xl transition-all"
          >
            {submitting ? (
              <div className="flex items-center gap-2">
                <Loader className="h-5 w-5 animate-spin" />
                <span>Submitting...</span>
              </div>
            ) : (
              "Submit Feedback"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};