'use client';

import { useState } from 'react';
import { toast, Toaster } from 'sonner';
import { z } from 'zod';

// ✅ Schema Definition
const interviewFeedbackSchema = z.object({
  studentName: z.string().min(1, 'Required'),
  studentId: z.string().min(1, 'Required - Enter full Enrollment Number'),
  companyName: z.string().min(1, 'Required'),

  aptitudeTestRating: z.string().min(1, 'Required'),
  interviewerProfessionalism: z.string().min(1, 'Required'),
  questionRelevance: z.string().min(1, 'Required'),
  briefingHelpfulness: z.string().min(1, 'Required'),
  confidenceRating: z.string().min(1, 'Required'),

  aptitudeExperience: z.string().min(1, 'Required'),
  interviewQuestionTypes: z.string().min(1, 'Required'),
  toughestPart: z.string().min(1, 'Required'),
  aptitudeImprovementSuggestions: z.string().min(1, 'Required'),
  assessmentAccuracy: z.string().min(1, 'Required'),
});

type InterviewFormType = z.infer<typeof interviewFeedbackSchema>;

const initialInterviewState: InterviewFormType = {
  studentName: '',
  studentId: '',
  companyName: '',

  aptitudeTestRating: '',
  interviewerProfessionalism: '',
  questionRelevance: '',
  briefingHelpfulness: '',
  confidenceRating: '',

  aptitudeExperience: '',
  interviewQuestionTypes: '',
  toughestPart: '',
  aptitudeImprovementSuggestions: '',
  assessmentAccuracy: '',
};

const interviewFields: {
  label: string;
  name: keyof InterviewFormType;
  type: 'input' | 'select' | 'textarea';
  options?: string[];
}[] = [
  { label: 'Student Name', name: 'studentName', type: 'input' },
  { label: 'Student ID', name: 'studentId', type: 'input' },
  { label: 'Company Name (Interviewed With)', name: 'companyName', type: 'input' },

  {
    label: 'Rate the aptitude test in terms of difficulty and relevance',
    name: 'aptitudeTestRating',
    type: 'select',
    options: ['1', '2', '3', '4', '5'],
  },
  {
    label: 'How professional and respectful was the interviewer?',
    name: 'interviewerProfessionalism',
    type: 'select',
    options: ['1', '2', '3', '4', '5'],
  },
  {
    label: 'How relevant were the interview questions to the job profile?',
    name: 'questionRelevance',
    type: 'select',
    options: ['1', '2', '3', '4', '5'],
  },
  {
    label: 'How helpful was the pre-interview briefing (if any)?',
    name: 'briefingHelpfulness',
    type: 'select',
    options: ['1', '2', '3', '4', '5'],
  },
  {
    label: 'Rate your confidence level during the interview process',
    name: 'confidenceRating',
    type: 'select',
    options: ['1', '2', '3', '4', '5'],
  },

  {
    label: 'Describe your overall aptitude test experience',
    name: 'aptitudeExperience',
    type: 'textarea',
  },
  {
    label: 'What type of questions were asked in the interview? (technical, HR, behavioral, etc.)',
    name: 'interviewQuestionTypes',
    type: 'textarea',
  },
  {
    label: 'What was the most difficult part of the interview process?',
    name: 'toughestPart',
    type: 'textarea',
  },
  {
    label: 'What improvements would you suggest for the aptitude or interview process?',
    name: 'aptitudeImprovementSuggestions',
    type: 'textarea',
  },
  {
    label: 'Do you feel the assessment accurately reflected your skills? Why or why not?',
    name: 'assessmentAccuracy',
    type: 'textarea',
  },
];

const InterviewFeedbackForm = () => {
  const [formData, setFormData] = useState<InterviewFormType>(initialInterviewState);
  const [errors, setErrors] = useState<Partial<Record<keyof InterviewFormType, string>>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = interviewFeedbackSchema.safeParse(formData);

    if (!parsed.success) {
      const newErrors: Partial<Record<keyof InterviewFormType, string>> = {};
      parsed.error.issues.forEach((err) => {
        const field = err.path[0] as keyof InterviewFormType;
        newErrors[field] = err.message;
      });
      setErrors(newErrors);
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const res = await fetch('/api/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });

      if (!res.ok) throw new Error('Failed to submit');

      toast.success('Interview feedback submitted!');
      setFormData(initialInterviewState);
      setErrors({});
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as keyof InterviewFormType]: value,
    }));
  };

  return (
    <div className="bg-gray-950 text-white min-h-screen py-10 px-4">
      <Toaster richColors position="top-center" />
      <div className="max-w-3xl mx-auto bg-gray-900 p-6 rounded-xl shadow border border-gray-800">
        <h1 className="text-3xl font-bold text-center mb-8">Interview Feedback Form</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {interviewFields.map(({ label, name, type, options }) => (
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

export default InterviewFeedbackForm;
