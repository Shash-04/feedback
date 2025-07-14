'use client';

import { useState } from 'react';
import { toast, Toaster } from 'sonner';
import { z } from 'zod';

// ✅ Zod Schema
const companyFeedbackSchema = z.object({
  studentName: z.string().min(1, 'Required'),
  companyName: z.string().min(1, 'Required'),

  technicalSkills: z.string().min(1, 'Required'),
  problemSolving: z.string().min(1, 'Required'),
  communicationSkills: z.string().min(1, 'Required'),
  overallSatisfaction: z.string().min(1, 'Required'),

  taskUnderstanding: z.string().min(1, 'Required'),
  adaptability: z.string().min(1, 'Required'),
  additionalComments: z.string().optional(),
});

type CompanyFeedbackType = z.infer<typeof companyFeedbackSchema>;

const initialCompanyState: CompanyFeedbackType = {
  studentName: '',
  companyName: '',

  technicalSkills: '',
  problemSolving: '',
  communicationSkills: '',
  overallSatisfaction: '',

  taskUnderstanding: '',
  adaptability: '',
  additionalComments: '',
};

const companyFields: {
  label: string;
  name: keyof CompanyFeedbackType;
  type: 'input' | 'select' | 'textarea';
  options?: string[];
}[] = [
  { label: 'Student Name', name: 'studentName', type: 'input' },
  { label: 'Company Name', name: 'companyName', type: 'input' },

  {
    label: 'Rate student’s engineering and technical skills',
    name: 'technicalSkills',
    type: 'select',
    options: ['1', '2', '3', '4', '5'],
  },
  {
    label: 'Rate the student’s problem-solving and logical thinking ability',
    name: 'problemSolving',
    type: 'select',
    options: ['1', '2', '3', '4', '5'],
  },
  {
    label: 'Rate communication and teamwork skills',
    name: 'communicationSkills',
    type: 'select',
    options: ['1', '2', '3', '4', '5'],
  },
  {
    label: 'Rate your overall satisfaction with the student’s performance',
    name: 'overallSatisfaction',
    type: 'select',
    options: ['1', '2', '3', '4', '5'],
  },

  {
    label: 'How well did the student understand and solve assigned tasks?',
    name: 'taskUnderstanding',
    type: 'textarea',
  },
  {
    label: 'Was the student willing to learn and adapt to the work environment?',
    name: 'adaptability',
    type: 'textarea',
  },
  {
    label: 'Additional comments or suggestions (optional)',
    name: 'additionalComments',
    type: 'textarea',
  },
];

const CompanyFeedbackForm = () => {
  const [formData, setFormData] = useState<CompanyFeedbackType>(initialCompanyState);
  const [errors, setErrors] = useState<Partial<Record<keyof CompanyFeedbackType, string>>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = companyFeedbackSchema.safeParse(formData);

    if (!parsed.success) {
      const newErrors: Partial<Record<keyof CompanyFeedbackType, string>> = {};
      parsed.error.issues.forEach((err) => {
        const field = err.path[0] as keyof CompanyFeedbackType;
        newErrors[field] = err.message;
      });
      setErrors(newErrors);
      toast.error('Please fix the highlighted fields');
      return;
    }

    try {
      const res = await fetch('/api/company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });

      if (!res.ok) throw new Error('Failed to submit feedback');

      toast.success('Feedback submitted!');
      setFormData(initialCompanyState);
      setErrors({});
    } catch (err) {
      console.error(err);
      toast.error('Submission failed!');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as keyof CompanyFeedbackType]: value,
    }));
  };

  return (
    <div className="bg-gray-950 text-white min-h-screen py-10 px-4">
      <Toaster richColors position="top-center" />
      <div className="max-w-3xl mx-auto bg-gray-900 p-6 rounded-xl shadow border border-gray-800">
        <h1 className="text-3xl font-bold text-center mb-8">Company Feedback for Intern</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {companyFields.map(({ label, name, type, options }) => (
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

export default CompanyFeedbackForm;
