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
        <Loader className="h-8 w-8 text-muted-foreground animate-spin" />
      </div>
    );

  if (!form)
    return (
      <div className="text-center py-20 px-4">
        <div className="bg-muted border border-border rounded-xl p-8 max-w-md mx-auto shadow-sm">
          <div className="bg-red-500/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Form not found
          </h3>
          <p className="text-muted-foreground">
            The requested form could not be loaded.
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start gap-4 mb-3">
            <div className="bg-blue-500/10 p-3 rounded-xl">
              <FileText className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{form.title}</h1>
              {form.description && (
                <p className="text-gray-400 mt-1">{form.description}</p>
              )}
            </div>
          </div>
          <div className="border-t border-gray-800 pt-4" />
        </div>

        {/* Questions */}
        <div className="space-y-8">
          {form.questions.map((q, index) => (
            <div key={q.id} className="space-y-2">
              <label className="block font-medium text-gray-200">
                <span className="text-blue-400">{index + 1}.</span>{" "}
                {q.question}
                {q.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {q.type === "DESCRIPTIVE" && (
                <Textarea
                  value={answers[q.id] || ""}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  placeholder="Type your answer here..."
                  className={`min-h-[120px] bg-gray-800 border ${
                    errors[q.id] ? "border-red-500" : "border-gray-700"
                  } text-gray-100 placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-blue-500`}
                />
              )}

              {q.type === "RATING" && (
                <Select
                  value={answers[q.id] || ""}
                  onValueChange={(val) => handleChange(q.id, val)}
                >
                  <SelectTrigger
                    className={`h-12 bg-gray-800 text-gray-100 ${
                      errors[q.id]
                        ? "border-red-500"
                        : "border border-gray-700"
                    } focus:ring-2 focus:ring-blue-500`}
                  >
                    <SelectValue placeholder="Select a rating (1-5)" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 text-gray-100 border-gray-700">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <SelectItem
                        key={num}
                        value={String(num)}
                        className="hover:bg-gray-700 focus:bg-gray-700"
                      >
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {errors[q.id] && (
                <p className="text-sm text-red-500 font-medium">
                  {errors[q.id]}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="mt-10">
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white text-lg font-semibold rounded-xl transition-all"
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
