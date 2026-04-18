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
    className="bg-zinc-900/40 border border-zinc-800/60 rounded-3xl p-8 backdrop-blur-xl animate-pulse"
  >
    <div className="flex items-center justify-between mb-6">
      <div className="w-12 h-12 bg-zinc-800 rounded-2xl"></div>
    </div>
    <div className="h-6 bg-zinc-800 rounded-lg w-3/4 mb-3"></div>
    <div className="h-4 bg-zinc-800 rounded-lg w-full mb-2"></div>
    <div className="h-4 bg-zinc-800 rounded-lg w-2/3 mb-8"></div>
    <div className="flex justify-between items-center mt-auto pt-6 border-t border-zinc-800/60 mt-4">
      <div className="h-4 bg-zinc-800 rounded-lg w-24"></div>
      <div className="h-10 bg-zinc-800 rounded-xl w-24"></div>
    </div>
  </motion.div>
);

// Empty state component
const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="col-span-full text-center py-16"
  >
    <div className="bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-xl rounded-3xl p-10 max-w-md mx-auto relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none"></div>
      <div className="bg-white/5 p-5 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center border border-white/10 shadow-inner">
        <FileText className="h-8 w-8 text-zinc-400" />
      </div>
      <h3 className="text-xl font-bold text-zinc-200 mb-3 tracking-tight">No forms found</h3>
      <p className="text-zinc-500 font-medium mb-8">You haven't created any forms yet.</p>
      <Link href="/admin/form-builder">
        <Button className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 hover:border-zinc-500 transition-all font-semibold rounded-2xl shadow-sm mx-auto">
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
    className="col-span-full text-center py-16"
  >
    <div className="bg-zinc-900/40 border border-red-900/30 backdrop-blur-xl rounded-3xl p-10 max-w-md mx-auto relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none"></div>
      <div className="bg-red-500/10 p-5 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center border border-red-500/20 shadow-inner">
        <AlertCircle className="h-8 w-8 text-red-400" />
      </div>
      <h3 className="text-xl font-bold text-zinc-200 mb-3 tracking-tight">Failed to load forms</h3>
      <p className="text-zinc-500 font-medium mb-8">There was an error loading your forms.</p>
      <Button
        onClick={onRetry}
        className="bg-red-900/40 hover:bg-red-900/60 text-red-200 border border-red-800/50 hover:border-red-700 transition-all font-semibold rounded-2xl mx-auto shadow-sm"
      >
        Try Again
      </Button>
    </div>
  </motion.div>
);

const Button = ({ children, className, ...props }: any) => (
  <button
    className={`px-5 py-2.5 flex items-center gap-2 ${className}`}
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
    <div className="min-h-full bg-transparent text-white pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           className="mb-12"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">View Summary</h1>
          </div>
          <p className="text-zinc-400 text-lg max-w-2xl font-light mb-6">
             Manage and view all your feedback forms summary in one place
          </p>
          
          {!loading && !error && forms.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 mt-4"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                      {forms.length} form{forms.length !== 1 ? 's' : ''} total
                  </span>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Forms Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
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
                whileHover={{ y: -4 }}
                className="bg-zinc-900/40 border border-zinc-800/60 rounded-3xl p-8 backdrop-blur-xl relative group flex flex-col h-full overflow-hidden shadow-none"
              >
                {/* Background hover subtle glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"></div>
                
                {/* Card Header (Icon) */}
                <div className="flex items-start justify-between mb-6 relative z-10">
                    <div className="bg-indigo-500/10 p-3.5 rounded-2xl border border-indigo-500/20 group-hover:border-indigo-500/40 transition-colors">
                        <FileText className="text-indigo-400 w-6 h-6" />
                    </div>
                </div>

                <div className="mb-8 flex-grow relative z-10">
                  <h3 className="text-xl font-bold text-zinc-100 mb-3 line-clamp-2 leading-tight tracking-tight">
                      {form.title}
                  </h3>
                  <p className="text-sm text-zinc-500 font-medium italic line-clamp-3">
                      {form.description || "No description provided."}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="flex justify-between items-center pt-6 border-t border-zinc-800/60 relative z-10 mt-auto">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        <Calendar className="h-4 w-4 opacity-70" />
                        <span>{formatDate(form.createdAt)}</span>
                    </div>

                    <Link href={`/admin/forms/${form.id}/summary`}>
                        <Button className="bg-transparent hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-500 transition-all font-semibold rounded-xl text-sm shadow-sm group/btn">
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