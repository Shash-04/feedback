"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import Link from "next/link";
import { motion } from "framer-motion";

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

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center mb-12"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-12 w-12 text-blue-400 mb-4"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <path d="M16 13H8" />
            <path d="M16 17H8" />
            <path d="M10 9H8" />
          </svg>
          <h1 className="text-3xl font-bold text-center  bg-clip-text text-white">
            Available Feedback Forms
          </h1>
          <p className="text-gray-400 mt-2 text-center max-w-lg">
            Select a form below to provide your valuable feedback
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <Skeleton className="h-64 rounded-xl bg-gray-800/50" />
              </motion.div>
            ))}
          </div>
        ) : forms.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-16 w-16 text-gray-500 mb-4"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
            <h3 className="text-xl font-medium text-gray-300 mb-2">
              No forms available
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              There are currently no feedback forms to display. Please check back later.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {forms.map((form, index) => (
              <motion.div
                key={form.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="bg-gray-900/70 border border-gray-800 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-gray-700 backdrop-blur-sm">
                  <CardHeader className="border-b border-gray-800 pb-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-500/10 p-2 rounded-lg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5 text-blue-400"
                        >
                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                      </div>
                      <CardTitle className="text-lg font-semibold text-gray-100">
                        {form.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 flex flex-col gap-4">
                    <div className="text-xs text-gray-500">
                      Created: {new Date(form.createdAt).toLocaleDateString()}
                    </div>
                    <Link href={`/student/forms/${form.id}`}>
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white transition-colors duration-300"
                        size="sm"
                      >
                        Fill Out Form
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}