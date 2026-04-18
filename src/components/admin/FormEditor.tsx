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
    <div className="min-h-full bg-transparent py-10 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto"
      >
        <Card className="bg-zinc-900/40 border border-zinc-800/60 shadow-none rounded-3xl backdrop-blur-xl">
          <CardHeader className="border-b border-zinc-800/60 px-8 py-8">
            <div className="flex items-center gap-4 relative z-10">
              <div className="bg-indigo-500/10 p-4 rounded-2xl border border-indigo-500/20">
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
                  className="text-indigo-400"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <path d="M16 13H8" />
                  <path d="M16 17H8" />
                  <path d="M10 9H8" />
                </svg>
              </div>
              <div>
                <CardTitle className="text-3xl font-extrabold text-white tracking-tight">
                  Form Editor
                </CardTitle>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8 sm:p-10 space-y-10">
            {/* Form Title */}
            <div className="space-y-4">
              <label className="text-sm font-semibold uppercase tracking-wider text-zinc-400 ml-1">Form Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter form title"
                className="bg-zinc-900/60 border border-zinc-700/80 text-zinc-100 focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent h-14 rounded-2xl text-lg font-medium placeholder:text-zinc-600 transition-all shadow-inner"
              />
            </div>

            {/* Questions Section */}
            <div className="space-y-8 mt-12 pt-8 border-t border-zinc-800/60">
              <div className="flex items-center justify-between ml-1">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Questions</h3>
                <span className="text-xs font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-xl uppercase tracking-wider">
                  {questions.length} question{questions.length !== 1 ? 's' : ''}
                </span>
              </div>

              {questions.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 border-2 border-dashed border-zinc-800 rounded-3xl bg-zinc-900/20"
                >
                  <div className="text-zinc-500 mb-6 font-medium">No questions added yet</div>
                  <Button
                    onClick={handleAdd}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl px-6 py-6 font-semibold shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all border border-indigo-500/50"
                  >
                    <Plus className="w-5 h-5 mr-3" />
                    Add First Question
                  </Button>
                </motion.div>
              )}

              <div className="space-y-6">
                {questions.map((q: any, idx: number) => (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-8 border border-zinc-800/60 bg-zinc-900/60 rounded-3xl space-y-8 backdrop-blur-md relative"
                  >
                    {/* Question Text */}
                    <div className="space-y-4">
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 ml-1">
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
                        className="bg-zinc-800/50 border border-zinc-700 text-zinc-100 focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent h-14 rounded-2xl text-base font-medium placeholder:text-zinc-600 transition-all shadow-inner"
                      />
                    </div>

                    {/* Question Type */}
                    <div className="space-y-4">
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 ml-1">
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
                          className="appearance-none bg-zinc-800/50 border border-zinc-700 text-zinc-100 rounded-2xl px-5 py-4 w-full focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent font-medium transition-all shadow-inner outline-none"
                        >
                          <option value="DESCRIPTIVE">Descriptive</option>
                          <option value="RATING">Rating</option>
                        </select>
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 pointer-events-none" />
                      </div>
                    </div>

                    {/* Required and Delete */}
                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-zinc-800/60">
                      <label className="flex items-center gap-4 text-sm font-semibold text-zinc-300 cursor-pointer group">
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
                          <div className="w-12 h-6 bg-zinc-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-zinc-400 after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-indigo-500 peer-checked:after:bg-white after:shadow-sm border border-zinc-700 group-hover:border-zinc-500"></div>
                        </div>
                        Required
                      </label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(idx)}
                        className="text-red-400 hover:bg-red-500/10 hover:text-red-300 font-semibold px-4 py-2 rounded-xl transition-all"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-zinc-800/60 mt-8">
              <Button
                onClick={handleAdd}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 hover:border-zinc-500 h-14 rounded-2xl flex-1 font-semibold transition-all shadow-sm"
              >
                <Plus className="w-5 h-5 mr-3 text-zinc-400" />
                Add Question
              </Button>
              <Button
                onClick={handleUpdate}
                className="bg-indigo-600 hover:bg-indigo-500 text-white h-14 rounded-2xl flex-1 font-bold transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] border border-indigo-500/50 tracking-wide"
              >
                <Save className="w-5 h-5 mr-3" />
                Save Form
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}