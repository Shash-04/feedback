"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, Calendar, Edit3 } from "lucide-react";

interface FeedbackForm {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export default function StudentFormsPage() {
  const [forms, setForms] = useState<FeedbackForm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await axios.get("/api/forms");
        setForms(res.data);
      } catch (err) {
        console.error("Failed to fetch forms", err);
      } finally {
        setLoading(false);
      }
    };
    fetchForms();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 py-12 px-4 sm:px-6 relative overflow-hidden">
      {/* Aesthetic Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/10 blur-[100px] rounded-full pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
           className="mb-16 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
        >
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight text-white">
                Available Forms
            </h1>
            <p className="text-zinc-400 text-lg font-light max-w-2xl">
               Please select an active form below to complete and submit your feedback.
            </p>
          </div>
          
          
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-zinc-900/40 border border-zinc-800/60 p-8 rounded-3xl backdrop-blur-xl animate-pulse"
              >
                  <div className="w-12 h-12 bg-zinc-800 rounded-2xl mb-6"></div>
                  <div className="h-6 bg-zinc-800 rounded-lg w-3/4 mb-4"></div>
                  <div className="h-4 bg-zinc-800 rounded-lg w-full mb-8"></div>
                  <div className="h-12 bg-zinc-800 rounded-xl w-full mt-4"></div>
              </motion.div>
            ))}
          </div>
        ) : forms.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-xl rounded-3xl p-12 max-w-md mx-auto text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none"></div>
                <div className="bg-white/5 p-5 rounded-2xl w-24 h-24 mx-auto mb-6 flex items-center justify-center border border-white/10 shadow-inner">
                  <FileText className="h-10 w-10 text-zinc-500" />
                </div>
                <h3 className="text-2xl font-bold text-zinc-100 mb-3 tracking-tight">
                  No forms available
                </h3>
                <p className="text-zinc-500 font-medium">
                  There are currently no feedback forms to display. Please check back later.
                </p>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {forms.map((form, index) => (
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

                <div className="flex-grow flex flex-col z-10 relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-indigo-500/10 p-3.5 rounded-2xl border border-indigo-500/20 group-hover:border-indigo-500/40 transition-colors">
                      <FileText className="h-6 w-6 text-indigo-400" />
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-zinc-100 mb-2 line-clamp-2 tracking-tight">
                        {form.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 mt-4">
                        <Calendar className="w-4 h-4 opacity-70" />
                        <span>{formatDate(form.createdAt)}</span>
                    </div>
                  </div>

                <div className="mt-auto pt-6 border-t border-zinc-800/60">
  <Link href={`/student/forms/${form.id}`}>
    <Button
      className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white transition-all font-semibold rounded-2xl px-4 py-6 shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] border border-indigo-500/50 text-center"
    >
      Fill Out Form
    </Button>
  </Link>
</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}