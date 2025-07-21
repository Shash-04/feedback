"use client";

import { Calendar, FileText, Eye, AlertCircle, Edit } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface FeedbackForm {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

// Loading skeleton component
const FormCardSkeleton = () => (
  <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 animate-pulse">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-5 h-5 bg-gray-600 rounded"></div>
      <div className="h-6 bg-gray-600 rounded w-3/4"></div>
    </div>
    <div className="h-4 bg-gray-600 rounded w-full mb-2"></div>
    <div className="h-4 bg-gray-600 rounded w-2/3 mb-4"></div>
    <div className="flex justify-between items-center">
      <div className="h-4 bg-gray-600 rounded w-24"></div>
      <div className="h-9 bg-gray-600 rounded w-20"></div>
    </div>
  </div>
);

// Empty state component
const EmptyState = () => (
  <div className="col-span-full text-center py-12">
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 max-w-md mx-auto">
      <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-300 mb-2">No forms found</h3>
      <p className="text-gray-400 mb-4">You haven't created any forms yet.</p>
      <Link href="/admin/forms/create">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Create Your First Form
        </button>
      </Link>
    </div>
  </div>
);

// Error state component
const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <div className="col-span-full text-center py-12">
    <div className="bg-gray-800 border border-red-700 rounded-lg p-8 max-w-md mx-auto">
      <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-300 mb-2">Failed to load forms</h3>
      <p className="text-gray-400 mb-4">There was an error loading your forms.</p>
      <button 
        onClick={onRetry}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

export default function FormList() {
  const [forms, setForms] = useState<FeedbackForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchForms = async () => {
    try {
      setLoading(true);
      setError(false);
      
      const res = await fetch("/api/forms");
      if (!res.ok) {
        throw new Error('Failed to fetch forms');
      }
      const data = await res.json();
      setForms(data);
      setLoading(false);
      
    } catch (err) {
      console.error("Error fetching forms:", err);
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-8 w-8 text-blue-400" />
            <h1 className="text-3xl font-bold">All Forms</h1>
          </div>
          <p className="text-gray-400">Manage and view all your feedback forms</p>
          {!loading && !error && forms.length > 0 && (
            <div className="mt-2">
              <span className="text-sm text-gray-500">
                {forms.length} form{forms.length !== 1 ? 's' : ''} total
              </span>
            </div>
          )}
        </div>

        {/* Forms Grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <FormCardSkeleton key={index} />
            ))
          ) : error ? (
            // Error state
            <ErrorState onRetry={fetchForms} />
          ) : forms.length === 0 ? (
            // Empty state
            <EmptyState />
          ) : (
            // Form cards
            forms.map((form) => (
              <div
                key={form.id}
                className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-all duration-200 hover:shadow-lg"
              >
                {/* Card Header */}
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <FileText className="h-5 w-5 text-blue-400 flex-shrink-0" />
                    <h3 className="text-lg font-semibold text-white line-clamp-1">
                      {form.title}
                    </h3>
                  </div>
                  {form.description && (
                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                      {form.description}
                    </p>
                  )}
                </div>

                {/* Card Footer */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(form.createdAt)}</span>
                  </div>
                  
                  <Link href={`/admin/forms/${form.id}`}>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors border border-gray-600 hover:border-gray-500">
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}