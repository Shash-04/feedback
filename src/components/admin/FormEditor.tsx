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
    toast.success("New question added", {
      position: "top-center",
      duration: 1500,
    });
  };

  const handleDelete = (index: number) => {
    setQuestions((prev: any[]) => prev.filter((_: any, i: number) => i !== index));
    toast.info("Question removed", {
      position: "top-center",
      duration: 1500,
    });
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
      toast.error("Failed to update form", {
        position: "top-center",
        duration: 2000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 py-10 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto"
      >
        <Card className="bg-gray-900/70 border border-gray-800 shadow-2xl rounded-2xl backdrop-blur-sm">
          <CardHeader className="border-b border-gray-800 px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500/10 p-3 rounded-xl">
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
                  <path d="M16 13H8" />
                  <path d="M16 17H8" />
                  <path d="M10 9H8" />
                </svg>
              </div>
              <CardTitle className="text-3xl font-bold  bg-clip-text text-white">
                Form Editor
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="p-8 space-y-8">
            {/* Form Title */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300">Form Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter form title"
                className="bg-gray-800/50 border-gray-700 text-gray-100 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent h-12 rounded-lg"
              />
            </div>

            {/* Questions Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-300">Questions</h3>
                <span className="text-xs text-gray-500 bg-gray-800/50 px-3 py-1 rounded-full">
                  {questions.length} question{questions.length !== 1 ? 's' : ''}
                </span>
              </div>

              {questions.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 border-2 border-dashed border-gray-800 rounded-xl"
                >
                  <div className="text-gray-500 mb-4">No questions added yet</div>
                  <Button
                    onClick={handleAdd}
                    className="bg-blue-600/90 hover:bg-blue-500/90 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Question
                  </Button>
                </motion.div>
              )}

              <div className="space-y-5">
                {questions.map((q: any, idx: number) => (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-6 border border-gray-800 bg-gray-800/40 rounded-xl space-y-5 backdrop-blur-sm"
                  >
                    {/* Question Text */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-300">
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
                        className="bg-gray-800/50 border-gray-700 text-gray-100 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent h-11 rounded-lg"
                      />
                    </div>

                    {/* Question Type */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-300">
                        Question Type
                      </label>
                      <div className="relative">
                        <select
                          value={q.type}
                          onChange={(e) => {
                            const copy = [...questions];
                            copy[idx].type = e.target.value;
                            setQuestions(copy);
                          }}
                          className="appearance-none bg-gray-800/50 border border-gray-700 text-gray-100 rounded-lg px-4 py-2.5 pr-10 w-full focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                        >
                          <option value="DESCRIPTIVE">Descriptive</option>
                          <option value="RATING">Rating</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Required and Delete */}
                    <div className="flex items-center justify-between pt-2">
                      <label className="flex items-center gap-3 text-sm text-gray-300">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={q.required}
                            onChange={(e) => {
                              const copy = [...questions];
                              copy[idx].required = e.target.checked;
                              setQuestions(copy);
                            }}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
                        </div>
                        Required
                      </label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(idx)}
                        className="text-red-400 hover:bg-gray-700/50 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4 mr-1.5" />
                        Delete
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={handleAdd}
                className="bg-blue-600/90 hover:bg-blue-500/90 text-white h-11 rounded-lg transition-all"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
              <Button
                onClick={handleUpdate}
                className="bg-green-600/90 hover:bg-green-500/90 text-white h-11 rounded-lg transition-all"
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