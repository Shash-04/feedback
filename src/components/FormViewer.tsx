"use client";

import React, { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader, FileText, AlertCircle } from "lucide-react";
import { toast, Toaster } from "sonner";

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await fetch(`/api/forms/${formId}`);
        const data = await res.json();
        setForm(data);
      } catch {
        // handle error silently here if needed
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

    setErrors((prev) => ({
      ...prev,
      [questionId]: "", // Clear error on change
    }));
  };

  const getWordCount = (text: string) =>
    text.trim().split(/\s+/).filter((word) => word !== "").length;

  const validate = () => {
    const newErrors: Record<string, string> = {};

    form?.questions.forEach((q) => {
      const val = answers[q.id]?.trim() || "";

      if (q.required && !val) {
        newErrors[q.id] = "This field is required.";
      } else if (q.type === "DESCRIPTIVE") {
        const wc = getWordCount(val);
        if (wc < 5 || wc > 250) {
          newErrors[q.id] = "Answer must be between 5 and 250 words.";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!form) return;
    if (!validate()) return;

    try {
      setSubmitting(true);
      const res = await fetch(`/api/forms/${formId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: Object.entries(answers).map(
            ([questionId, responseText]) => ({
              questionId,
              responseText,
            })
          ),
        }),
      });

      if (res.ok) {
        setAnswers({});
        setErrors({});
        toast.success("Feedback submitted successfully!"); 
      } else {
        throw new Error("Submission failed");
      }
    } catch {
        toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-background">
        <Loader className="h-8 w-8 text-zinc-500 animate-spin" />
      </div>
    );

  if (!form)
    return (
      <div className="text-center py-20 px-4 min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="bg-zinc-900/40 border border-red-900/30 backdrop-blur-xl rounded-3xl p-10 max-w-md mx-auto shadow-none">
          <div className="bg-red-500/10 p-4 rounded-2xl w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-red-500/20">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-zinc-100 mb-3 tracking-tight">
            Form not found
          </h3>
          <p className="text-zinc-500 font-medium">
            The requested form could not be loaded or doesn't exist.
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#030303] py-12 px-4 sm:px-6 relative overflow-hidden">
      {/* Background aesthetic enhancements for the student facing view */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-3xl mx-auto bg-zinc-900/40 border border-zinc-800/60 rounded-3xl p-8 sm:p-12 shadow-2xl backdrop-blur-xl relative z-10">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-5 mb-6 relative z-10">
            <div className="bg-indigo-500/10 p-3.5 rounded-2xl border border-indigo-500/20">
              <FileText className="h-7 w-7 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">{form.title}</h1>
            </div>
          </div>
          {form.description && (
             <p className="text-zinc-400 mt-2 font-medium leading-relaxed">{form.description}</p>
          )}
          <div className="border-t border-zinc-800/60 pt-6 mt-8" />
        </div>

        {/* Questions */}
        <div className="space-y-10">
          {form.questions.map((q, index) => (
            <div key={q.id} className="space-y-4">
              <label className="block font-semibold text-zinc-200 text-lg">
                <span className="text-indigo-400 mr-2">{index + 1}.</span>{" "}
                {q.question}
                {q.required && <span className="text-red-500 ml-1.5">*</span>}
              </label>

              {q.type === "DESCRIPTIVE" && (
                <Textarea
                  value={answers[q.id] || ""}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  placeholder="Type your answer here..."
                  className={`min-h-[140px] bg-zinc-900/60 border ${
                    errors[q.id] ? "border-red-500 border-2" : "border-zinc-700/80"
                  } text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-2 focus-visible:ring-indigo-500/50 rounded-2xl p-5 text-base transition-all shadow-inner resize-y`}
                />
              )}

              {q.type === "RATING" && (
                <Select
                  value={answers[q.id] || ""}
                  onValueChange={(val) => handleChange(q.id, val)}
                >
                  <SelectTrigger
                    className={`h-14 bg-zinc-900/60 text-zinc-100 ${
                      errors[q.id]
                        ? "border-red-500 border-2"
                        : "border border-zinc-700/80"
                    } focus:ring-2 focus:ring-indigo-500/50 rounded-2xl px-5 text-base transition-all shadow-inner`}
                  >
                    <SelectValue placeholder="Select a rating (1-5)" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 text-zinc-100 border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <SelectItem
                        key={num}
                        value={String(num)}
                        className="hover:bg-zinc-800 focus:bg-zinc-800 focus:text-white cursor-pointer py-3 rounded-xl m-1 transition-colors"
                      >
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {errors[q.id] && (
                <p className="text-sm text-red-400 font-bold ml-1 tracking-wide">
                  {errors[q.id]}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="mt-12 pt-8 border-t border-zinc-800/60">
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white text-lg font-bold rounded-2xl transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] border border-indigo-500/50 tracking-wide"
          >
            {submitting ? (
              <div className="flex items-center justify-center gap-3">
                <Loader className="h-6 w-6 animate-spin text-indigo-200" />
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
