"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import FormEditor from "@/components/admin/FormEditor";
import { motion } from "framer-motion";

export default function EditFormPage() {
  const params = useParams();
  const formId = typeof params?.formId === "string" ? params.formId : Array.isArray(params?.formId) ? params.formId[0] : "";

  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchForm() {
      try {
        const res = await fetch(`/api/forms/${formId}`);
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        setFormData(data);
      } catch (err) {
        toast.error("Failed to load form.", {
          position: "top-center",
          duration: 2000,
        });
      } finally {
        setLoading(false);
      }
    }

    if (formId) fetchForm();
  }, [formId]);

  if (loading) {
    return (
      <div className="bg-transparent min-h-full px-4 py-10 md:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-10 w-48 bg-zinc-800 rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-16 w-full bg-zinc-800 rounded-2xl" />
            <Skeleton className="h-32 w-full bg-zinc-800 rounded-2xl" />
            <Skeleton className="h-32 w-full bg-zinc-800 rounded-2xl" />
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <Skeleton className="h-10 w-36 bg-zinc-800 rounded-xl" />
            <Skeleton className="h-10 w-28 bg-zinc-800 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center bg-transparent min-h-[60vh] px-4"
      >
        <div className="text-center p-8 bg-zinc-900/40 border border-red-900/30 backdrop-blur-xl rounded-3xl max-w-md mx-auto shadow-none">
          <div className="bg-red-500/10 p-4 rounded-xl w-16 h-16 mx-auto mb-4 border border-red-500/20 flex items-center justify-center">
             <svg
               xmlns="http://www.w3.org/2000/svg"
               className="h-8 w-8 text-red-500"
               fill="none"
               viewBox="0 0 24 24"
               stroke="currentColor"
               strokeWidth="2"
             >
               <circle cx="12" cy="12" r="10" />
               <line x1="12" y1="8" x2="12" y2="12" />
               <line x1="12" y1="16" x2="12.01" y2="16" />
             </svg>
          </div>
          <h3 className="text-xl font-bold text-zinc-100 mb-2">Form not found</h3>
          <p className="text-zinc-500 font-medium">
            The form you're looking for doesn't exist or may have been removed.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-transparent min-h-full py-8 px-4 md:px-10">
      <FormEditor initialData={formData} />
    </div>
  );
}
