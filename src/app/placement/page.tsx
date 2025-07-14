'use client';

import { useState } from 'react';
import { toast, Toaster } from 'sonner';
import { z } from 'zod';

// ✅ 1. Define Schema
const feedbackSchema = z.object({
  studentName: z.string().min(1, 'Required'),
  studentId: z.string().min(1, 'Required - Enter full Enrollment Number'),
  department: z.string().min(1, 'Required'),

  placementCommunication: z.string().min(1, 'Required'),
  trainingRelevance: z.string().min(1, 'Required'),
  mockInterviewsHelpful: z.string().min(1, 'Required'),
  coordinationRating: z.string().min(1, 'Required'),

  suggestions: z.string().min(1, 'Required'),
  wishlistCompanies: z.string().min(1, 'Required'),
});

type FormDataType = z.infer<typeof feedbackSchema>;

const initialState: FormDataType = {
  studentName: '',
  studentId: '',
  department: '',

  placementCommunication: '',
  trainingRelevance: '',
  mockInterviewsHelpful: '',
  coordinationRating: '',

  suggestions: '',
  wishlistCompanies: '',
};

const fields: {
  label: string;
  name: keyof FormDataType;
  type: 'input' | 'select' | 'textarea';
  options?: string[];
}[] = [
  { label: 'Name', name: 'studentName', type: 'input' },
  { label: 'Student ID', name: 'studentId', type: 'input' },
  { label: 'Department', name: 'department', type: 'input' },

  {
    label: 'Was the placement process communicated clearly?',
    name: 'placementCommunication',
    type: 'select',
    options: ['Yes', 'Somewhat', 'No'],
  },
  {
    label: 'How relevant were the training sessions to your placement preparation?',
    name: 'trainingRelevance',
    type: 'select',
    options: ['Very Relevant', 'Somewhat Relevant', 'Not Relevant'],
  },
  {
    label: 'Were the mock interviews helpful?',
    name: 'mockInterviewsHelpful',
    type: 'select',
    options: ['Very Helpful', 'Somewhat Helpful', 'Not Helpful'],
  },
  {
    label: 'Rate the overall coordination by the T&P Cell',
    name: 'coordinationRating',
    type: 'select',
    options: ['1', '2', '3', '4', '5'],
  },
  {
    label: 'Any suggestions to improve future placement drives?',
    name: 'suggestions',
    type: 'textarea',
  },
  {
    label: 'Any specific companies you would like to see next year?',
    name: 'wishlistCompanies',
    type: 'textarea',
  },
];

const TPFeedbackForm = () => {
  const [formData, setFormData] = useState<FormDataType>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormDataType, string>>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = feedbackSchema.safeParse(formData);

    if (!parsed.success) {
      const newErrors: Partial<Record<keyof FormDataType, string>> = {};
      parsed.error.issues.forEach((err) => {
        const field = err.path[0] as keyof FormDataType;
        newErrors[field] = err.message;
      });
      setErrors(newErrors);
      toast.error('Please fix the highlighted fields');
      return;
    }

    try {
      const res = await fetch('/api/placement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });

      if (!res.ok) throw new Error('Failed to submit feedback');

      toast.success('Feedback submitted!');
      setFormData(initialState);
      setErrors({});
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as keyof FormDataType]: value,
    }));
  };

  return (
    <div className="bg-gray-950 text-white min-h-screen py-10 px-4">
      <Toaster richColors position="top-center" />
      <div className="max-w-2xl mx-auto bg-gray-900 p-6 rounded-xl shadow border border-gray-800">
        <h1 className="text-3xl font-bold text-center mb-8">Placement Drive Feedback Form</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {fields.map(({ label, name, type, options }) => (
            <div key={name} className="flex flex-col gap-1">
              <label className="font-medium">{label}</label>

              {type === 'input' && (
                <input
                  type="text"
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="bg-gray-800 text-white px-3 py-2 rounded-md border border-gray-700"
                />
              )}

              {type === 'select' && (
                <select
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="bg-gray-800 text-white px-3 py-2 rounded-md border border-gray-700"
                >
                  <option value="">-- Select --</option>
                  {options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}

              {type === 'textarea' && (
                <textarea
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="bg-gray-800 text-white px-3 py-2 rounded-md border border-gray-700 min-h-[80px]"
                />
              )}

              {errors[name] && (
                <span className="text-red-500 text-sm">{errors[name]}</span>
              )}
            </div>
          ))}

          <div className="text-center pt-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 transition px-6 py-2 rounded-md text-white font-medium"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TPFeedbackForm;
