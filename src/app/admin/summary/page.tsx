"use client";

import { Calendar, FileText, Eye, AlertCircle, Edit, Delete, View, ViewIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface FeedbackForm {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

// Loading skeleton component
const FormCardSkeleton = ({ delay }: { delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: delay * 0.1 }}
    className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm"
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="w-6 h-6 bg-gray-700 rounded-full"></div>
      <div className="h-5 bg-gray-700 rounded-full w-3/4"></div>
    </div>
    <div className="h-4 bg-gray-700 rounded-full w-full mb-2"></div>
    <div className="h-4 bg-gray-700 rounded-full w-2/3 mb-6"></div>
    <div className="flex justify-between items-center">
      <div className="h-4 bg-gray-700 rounded-full w-24"></div>
      <div className="h-9 bg-gray-700 rounded-lg w-20"></div>
    </div>
  </motion.div>
);

// Empty state component
const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="col-span-full text-center py-12"
  >
    <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-8 max-w-md mx-auto backdrop-blur-sm">
      <div className="bg-blue-500/10 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
        <FileText className="h-8 w-8 text-blue-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-100 mb-2">No forms found</h3>
      <p className="text-gray-400 mb-6">You haven't created any forms yet.</p>
      <Link href="/admin/forms/create">
        <Button className="bg-blue-600 hover:bg-blue-500 text-white">
          Create Your First Form
        </Button>
      </Link>
    </div>
  </motion.div>
);

// Error state component
const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="col-span-full text-center py-12"
  >
    <div className="bg-gray-900/70 border border-red-800 rounded-xl p-8 max-w-md mx-auto backdrop-blur-sm">
      <div className="bg-red-500/10 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
        <AlertCircle className="h-8 w-8 text-red-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-100 mb-2">Failed to load forms</h3>
      <p className="text-gray-400 mb-6">There was an error loading your forms.</p>
      <Button
        onClick={onRetry}
        className="bg-red-600 hover:bg-red-500 text-white"
      >
        Try Again
      </Button>
    </div>
  </motion.div>
);

const Button = ({ children, className, ...props }: any) => (
  <button
    className={`px-4 py-2 rounded-lg transition-colors duration-300 flex items-center gap-2 ${className}`}
    {...props}
  >
    {children}
  </button>
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
  // const handleDelete = async (formId: string) => {
  //   try {
  //     const res = await fetch(`/api/forms/${formId}`, {
  //       method: 'DELETE',
  //     });
  //     if (res.ok) {
  //       console.log("Form deleted");
  //       window.location.reload();
  //     } else {
  //       console.error("Delete failed");
  //     }
  //   } catch (error) {
  //     console.error("Error deleting form:", error);
  //   }
  // };

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
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-blue-500/10 p-2 rounded-lg">
              <FileText className="h-8 w-8 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              View Summary
            </h1>
          </div>
          <p className="text-gray-400 max-w-2xl">
            Manage and view all your feedback forms summary in one place
          </p>
          {!loading && !error && forms.length > 0 && (
            <div className="mt-3">
              <span className="text-sm text-gray-500 bg-gray-800/50 px-3 py-1 rounded-full">
                {forms.length} form{forms.length !== 1 ? 's' : ''} total
              </span>
            </div>
          )}
        </motion.div>

        {/* Forms Grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <FormCardSkeleton key={index} delay={index} />
            ))
          ) : error ? (
            // Error state
            <ErrorState onRetry={fetchForms} />
          ) : forms.length === 0 ? (
            // Empty state
            <EmptyState />
          ) : (
            // Form cards
            forms.map((form, index) => (
              <motion.div
                key={form.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300 hover:shadow-lg backdrop-blur-sm h-full flex flex-col">
                  {/* Card Header */}
                  <div className="mb-5 flex-grow">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="bg-blue-500/10 p-2 rounded-lg flex-shrink-0">
                        <FileText className="h-5 w-5 text-blue-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-white line-clamp-2">
                        {form.title}
                      </h3>
                    </div>
                    {form.description && (
                      <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                        {form.description}
                      </p>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-800">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(form.createdAt)}</span>
                    </div>

                    <Link href={`/admin/forms/${form.id}/summary`}>
                      <Button className="bg-gray-800 hover:bg-gray-700 text-gray-100 border border-gray-700 hover:border-gray-600 flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        <span>View Summary</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}