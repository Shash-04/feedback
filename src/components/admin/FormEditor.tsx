"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Save, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function FormEditor({ initialData }: { initialData: any }) {
  const [title, setTitle] = useState(initialData.title);
  const [questions, setQuestions] = useState(initialData.questions || []);

  const handleAdd = () => {
    setQuestions((prev: string | any[]) => [
      ...prev,
      {
        id: Date.now(),
        question: "",
        type: "DESCRIPTIVE",
        required: false,
        order: prev.length + 1,
      },
    ]);
  };

  const handleDelete = (index: number) => {
    setQuestions((prev: any[]) => prev.filter((_: any, i: number) => i !== index));
    toast.info("Question removed");
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`/api/forms/${initialData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, questions }),
      });

      if (res.ok) {
        toast.success("Form updated successfully!", {
          position: "top-center",
          duration: 2000,
        });
      } else throw new Error();
    } catch {
      toast.error("Failed to update form.", {
        position: "top-center",
        duration: 2000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4 flex items-start justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full md:w-1/2"
      >
        <Card className="bg-gray-900 text-gray-100 border border-gray-800 shadow-xl rounded-2xl">
          <CardHeader className="border-b border-gray-800">
            <CardTitle className="text-3xl font-semibold flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-400"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              Form Editor
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-8 py-6">
            {/* Form Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Form Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter form title"
                className="bg-gray-800 text-gray-100 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Questions Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-400">Questions</h3>

              {questions.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 text-gray-500"
                >
                  No questions added yet
                </motion.div>
              )}

              {questions.map((q: any, idx: number) => (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 border border-gray-800 bg-gray-800/60 rounded-xl space-y-4 backdrop-blur-sm"
                >
                  {/* Question Text */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">
                      Question {idx + 1}
                    </label>
                    <Input
                      value={q.question}
                      onChange={(e) => {
                        const copy = [...questions];
                        copy[idx].question = e.target.value;
                        setQuestions(copy);
                      }}
                      placeholder="Enter your question"
                      className="bg-gray-800 text-gray-100 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Question Type */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Question Type</label>
                    <div className="relative">
                      <select
                        value={q.type}
                        onChange={(e) => {
                          const copy = [...questions];
                          copy[idx].type = e.target.value;
                          setQuestions(copy);
                        }}
                        className="appearance-none bg-gray-800 text-gray-100 border border-gray-700 rounded-md px-3 py-2 pr-8 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="DESCRIPTIVE">Descriptive</option>
                        <option value="RATING">Rating</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Required and Delete */}
                  <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2 text-sm text-gray-400">
                      <input
                        type="checkbox"
                        checked={q.required}
                        onChange={(e) => {
                          const copy = [...questions];
                          copy[idx].required = e.target.checked;
                          setQuestions(copy);
                        }}
                        className="rounded bg-gray-800 border-gray-700 text-blue-500 focus:ring-blue-500"
                      />
                      Required
                    </label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(idx)}
                      className="text-red-400 hover:bg-gray-700 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={handleAdd}
                className="bg-blue-600 hover:bg-blue-500 text-white transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
              <Button
                onClick={handleUpdate}
                className="bg-green-600 hover:bg-green-500 text-white transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Form
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
