"use client";

import { Calendar, FileText, AlertCircle, Edit, PlusCircle, Trash2, Sparkles, Database } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion"; 

interface FeedbackForm {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

const Button = ({ children, className, ...props }: any) => (
  <button
    className={`px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 font-semibold tracking-wide text-sm ${className}`}
    {...props}
  >
    {children}
  </button>
);

const FormCardSkeleton = ({ delay }: { delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: delay * 0.1 }}
    className="bg-zinc-900/40 border border-zinc-800/60 rounded-3xl p-7 backdrop-blur-xl animate-pulse flex flex-col h-full"
  >
    <div className="flex items-center justify-between gap-4 mb-5">
      <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex-shrink-0"></div>
      <div className="w-10 h-10 bg-zinc-800/50 rounded-xl"></div>
    </div>
    <div className="h-5 bg-zinc-800 rounded-full w-3/4 mb-4"></div>
    <div className="h-4 bg-zinc-800 rounded-full w-full mb-2"></div>
    <div className="h-4 bg-zinc-800 rounded-full w-2/3 mb-8"></div>
    <div className="flex justify-between items-center pt-5 border-t border-zinc-800/60 mt-auto">
      <div className="h-4 bg-zinc-800 rounded-full w-24"></div>
      <div className="h-10 bg-zinc-800 rounded-xl w-24"></div>
    </div>
  </motion.div>
);

const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="col-span-full text-center py-16"
  >
    <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-3xl p-10 max-w-lg mx-auto backdrop-blur-xl relative overflow-hidden shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none"></div>
      <div className="bg-indigo-500/10 p-5 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center border border-indigo-500/20 shadow-inner">
        <Database className="h-8 w-8 text-indigo-400" />
      </div>
      <h3 className="text-2xl font-bold text-zinc-100 mb-3 tracking-tight">No Modules Found</h3>
      <p className="text-zinc-400 mb-8 leading-relaxed">Your ecosystem is a blank canvas. Establish your first intelligent form architecture to begin collecting data.</p>
      <Link href="/admin/form-builder">
        <Button className="bg-indigo-600 hover:bg-indigo-500 text-white w-full justify-center shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_20px_rgba(79,70,229,0.5)]">
          <PlusCircle className="w-5 h-5" /> Initialize First Form
        </Button>
      </Link>
    </div>
  </motion.div>
);

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="col-span-full text-center py-16"
  >
    <div className="bg-zinc-900/40 border border-red-900/30 rounded-3xl p-10 max-w-lg mx-auto backdrop-blur-xl shadow-2xl">
      <div className="bg-red-500/10 p-5 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center border border-red-500/20 shadow-inner">
        <AlertCircle className="h-8 w-8 text-red-400" />
      </div>
      <h3 className="text-2xl font-bold text-zinc-100 mb-3 tracking-tight">System Disruption</h3>
      <p className="text-zinc-400 mb-8 leading-relaxed">Our connection to the core ecosystem encountered an anomaly.</p>
      <Button
        onClick={onRetry}
        className="bg-red-600/90 hover:bg-red-500 text-white w-full justify-center shadow-lg"
      >
        Re-establish Connection
      </Button>
    </div>
  </motion.div>
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
      if (!res.ok) throw new Error("Failed to fetch forms");
      const data = await res.json();
      setForms(data);
    } catch (err) {
      console.error("Error fetching forms:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (formId: string) => {
    try {
      const res = await fetch(`/api/forms/${formId}`, { method: 'DELETE' });
      if (res.ok) window.location.reload();
      else console.error("Delete failed");
    } catch (error) {
      console.error("Error deleting form:", error);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });

  return (
    <div className="min-h-full bg-transparent text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">Active Forms</h1>
            
            <div className="sm:ml-auto">
              <Link href="/admin/form-builder">
                <Button className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_20px_rgba(79,70,229,0.5)]">
                  <PlusCircle className="h-5 w-5" /> Initialize New
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
            <p className="text-zinc-400 text-lg max-w-2xl font-light">
              Configure and update your active form architectures from the central repository.
            </p>

            {!loading && !error && forms.length > 0 && (
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-xl">
                {forms.length} Record{forms.length !== 1 ? 's' : ''} Synced
              </span>
            )}
          </div>
        </motion.div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <FormCardSkeleton key={index} delay={index} />
            ))
          ) : error ? (
            <ErrorState onRetry={fetchForms} />
          ) : forms.length === 0 ? (
            <EmptyState />
          ) : (
            forms.map((form, index) => (
              <motion.div
                key={form.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-zinc-900/40 border border-zinc-800/60 rounded-3xl p-7 hover:bg-zinc-800/60 transition-all duration-500 backdrop-blur-xl h-full flex flex-col overflow-hidden"
              >
                {/* Subtle Hover Gradient Inside Card */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                <div className="mb-6 flex-grow relative z-10">
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/10 p-3.5 rounded-2xl flex-shrink-0 border border-purple-500/20 shadow-inner">
                      <FileText className="h-6 w-6 text-purple-400" />
                    </div>
                    
                    {/* Delete button cleanly positioned top right horizontally inline with the Icon */}
                    <button
                      onClick={() => handleDelete(form.id)}
                      className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 border border-transparent p-2.5 rounded-xl transition-all duration-300"
                      title="Delete Form"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <h3 className="text-xl font-bold text-zinc-100 mb-3 tracking-tight line-clamp-2">
                    {form.title}
                  </h3>
                  {form.description ? (
                    <p className="text-zinc-400 text-sm leading-relaxed font-medium line-clamp-3">
                      {form.description}
                    </p>
                  ) : (
                    <p className="text-zinc-600 text-sm italic font-medium">No description provided</p>
                  )}
                </div>
                
                <div className="flex justify-between items-center pt-5 border-t border-zinc-800/60 relative z-10 mt-auto">
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 tracking-wide uppercase">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(form.createdAt)}</span>
                  </div>
                  <Link href={`/admin/forms/${form.id}`}>
                    <Button className="bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 hover:bg-zinc-700 hover:text-white hover:border-zinc-500 transition-all shadow-sm">
                      <Edit className="h-4 w-4" /> Edit
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
