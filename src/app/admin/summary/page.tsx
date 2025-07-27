"use client";

import { Calendar, FileText, Eye, AlertCircle, Edit, Delete, View, ViewIcon, Activity } from "lucide-react";
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
    className="bg-gray-800/60 border border-gray-700 rounded-xl p-6 animate-pulse"
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="w-6 h-6 bg-gray-700 rounded-full"></div>
      <div className="h-5 bg-gray-700 rounded w-3/4"></div>
    </div>
    <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
    <div className="h-4 bg-gray-700 rounded w-2/3 mb-6"></div>
    <div className="flex justify-between items-center">
      <div className="h-4 bg-gray-700 rounded w-24"></div>
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
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 max-w-md mx-auto">
      <div className="bg-purple-500/10 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
        <FileText className="h-8 w-8 text-purple-400" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">No forms found</h3>
      <p className="text-gray-400 mb-6">You haven't created any forms yet.</p>
      <Link href="/admin/forms/form-builder">
        <Button className="bg-purple-600 hover:bg-purple-500 text-white">
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
    <div className="bg-gray-900 border border-red-800 rounded-xl p-8 max-w-md mx-auto">
      <div className="bg-red-500/10 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
        <AlertCircle className="h-8 w-8 text-red-400" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">Failed to load forms</h3>
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
    <div className="min-h-screen bg-gray-950 text-white py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-500/10 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">View Summary</h1>
              <p className="text-gray-400">Manage and view all your feedback forms summary in one place</p>
            </div>
          </div>
          
          {!loading && !error && forms.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 mt-4"
            >
              <Activity className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full border border-gray-700">
                {forms.length} form{forms.length !== 1 ? 's' : ''} total
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Forms Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        >
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
                whileHover={{ scale: 1.02 }}
                className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow hover:shadow-purple-700/20 hover:border-purple-700 transition-all h-full flex flex-col"
              >
                {/* Card Header */}
                <div className="mb-5 flex-grow">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="text-purple-400 w-5 h-5" />
                    <h3 className="text-lg font-semibold line-clamp-2">
                      {form.title}
                    </h3>
                  </div>
                  {form.description && (
                    <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">
                      {form.description || "No description provided."}
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
                    <Button className="bg-gray-800 hover:bg-gray-700 text-gray-100 border border-gray-700 hover:border-gray-600 flex items-center gap-2 transition-colors">
                      <Eye className="h-4 w-4" />
                      <span>View Summary</span>
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
}