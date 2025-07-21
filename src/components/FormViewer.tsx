"use client";

import { useState } from "react";
import { Check, AlertCircle, Send, Pencil, FileText } from "lucide-react";

type Question = {
  id: string;
  question: string;
  type: "DESCRIPTIVE" | "RATING";
  required: boolean;
  order: number;
};

type FormData = {
  id: string;
  title: string;
  questions: Question[];
};

type Props = {
  formData: FormData;
};

const Notification = ({ message, type, visible, onClose }: {
  message: string;
  type: 'success' | 'error';
  visible: boolean;
  onClose: () => void;
}) => {
  if (!visible) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg border ${
        type === 'success' 
          ? 'bg-gray-800 border-green-600 text-green-400' 
          : 'bg-gray-800 border-red-600 text-red-400'
      }`}>
        {type === 'success' ? <Check className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
        <span className="text-white">{message}</span>
        <button onClick={onClose} className="ml-2 text-gray-400 hover:text-white">×</button>
      </div>
    </div>
  );
};

export default function FormViewer({ formData }: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [notification, setNotification] = useState({ visible: false, message: '', type: 'success' as 'success' | 'error' });

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ visible: true, message, type });
    setTimeout(() => setNotification(prev => ({ ...prev, visible: false })), 4000);
  };

  const handleChange = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    const formattedAnswers = formData.questions.map(q => ({
      questionId: q.id,
      value: answers[q.id] || ""
    }));

    try {
      const res = await fetch(`/api/forms/${formData.id}/response`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: formattedAnswers }),
      });

      if (res.ok) {
        showNotification("Form submitted successfully!", "success");
        setAnswers({});
      } else {
        showNotification("Failed to submit form.", "error");
      }
    } catch (err) {
      showNotification("Server error. Try again later.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-8">
      <Notification {...notification} onClose={() => setNotification(prev => ({ ...prev, visible: false }))} />

      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="h-8 w-8 text-blue-400" />
          <h1 className="text-3xl font-bold">{formData.title}</h1>
        </div>

        <form className="space-y-8">
          {formData.questions.sort((a, b) => a.order - b.order).map((q, i) => (
            <div key={q.id} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <label className="block mb-2 text-lg font-medium text-white">
                {i + 1}. {q.question} {q.required && <span className="text-red-500">*</span>}
              </label>

              {q.type === "DESCRIPTIVE" ? (
                <textarea
                  rows={3}
                  value={answers[q.id] || ""}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  required={q.required}
                  placeholder="Type your answer here..."
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <select
                  value={answers[q.id] || ""}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  required={q.required}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a rating</option>
                  {[1, 2, 3, 4, 5].map((val) => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </form>

        <button
          onClick={handleSubmit}
          className="mt-8 flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
        >
          <Send className="h-5 w-5" />
          Submit
        </button>
      </div>
    </div>
  );
}
