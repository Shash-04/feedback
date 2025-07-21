"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import { useRouter } from "next/navigation";

type QuestionType = "DESCRIPTIVE" | "RATING";

interface Question {
  id: number;
  question: string;
  type: QuestionType;
  required: boolean;
  order: number;
}

interface FormBuilderProps {
  formId: string;
  mode?: "edit" | "create";
  formData?: {
    title: string;
    description?: string;
    questions: {
      id: string;
      question: string;
      type: QuestionType;
      required: boolean;
      order: number;
      formId: string;
    }[];
  };
}

export default function FormBuilder({ formId, formData, mode = "edit" }: FormBuilderProps) {
  const router = useRouter();

  const [formTitle, setFormTitle] = useState(formData?.title || "");
  const [formDescription, setFormDescription] = useState(formData?.description || "");
  const [questions, setQuestions] = useState<Question[]>([]);

  // Hydrate form with existing data
  useEffect(() => {
    if (formData?.questions) {
      const parsedQuestions = formData.questions.map((q) => ({
        id: parseInt(q.id),
        question: q.question,
        type: q.type,
        required: q.required,
        order: q.order,
      }));
      setQuestions(parsedQuestions);
    }
  }, [formData]);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now(),
      question: "",
      type: "DESCRIPTIVE",
      required: false,
      order: questions.length + 1,
    };
    setQuestions((prev) => [...prev, newQuestion]);
  };

  const updateQuestion = (
    id: number,
    field: keyof Question,
    value: string | boolean
  ) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const removeQuestion = (id: number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleSave = async () => {
    try {
      await axios.post("/api/forms/update", {
        id: formId,
        title: formTitle,
        description: formDescription,
        questions,
      });
      router.refresh();
    } catch (err) {
      console.error("Error saving form:", err);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-4xl mx-auto">
      <Card className="bg-gray-950 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">
            {mode === "edit" ? "Edit Feedback Form" : "Create New Form"}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input
            placeholder="Form Title"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
          />
          <Input
            placeholder="Form Description"
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
          />

          {questions.map((q, index) => (
            <div
              key={q.id}
              className="border border-gray-700 p-4 rounded-xl bg-gray-900 flex flex-col gap-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Question {index + 1}</h3>
                <Trash2
                  className="text-red-500 cursor-pointer"
                  onClick={() => removeQuestion(q.id)}
                />
              </div>
              <Input
                placeholder="Question text"
                value={q.question}
                onChange={(e) => updateQuestion(q.id, "question", e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
              <div className="flex gap-4 items-center">
                <Select
                  value={q.type}
                  onValueChange={(val: QuestionType) => updateQuestion(q.id, "type", val)}
                >
                  <SelectTrigger className="w-[150px] bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="DESCRIPTIVE">Descriptive</SelectItem>
                    <SelectItem value="RATING">Rating (1-5)</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-2">
                  <Label>Required</Label>
                  <Switch
                    checked={q.required}
                    onCheckedChange={(val: boolean) => updateQuestion(q.id, "required", val)}
                  />
                </div>
              </div>
            </div>
          ))}

          <Button
            onClick={addQuestion}
            variant="secondary"
            className="bg-gray-800 hover:bg-gray-700"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Question
          </Button>
          <Button onClick={handleSave} className="w-full mt-4">
            Save Form
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
