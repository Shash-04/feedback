📋 Feedback Analysis App
A dynamic, full-stack feedback collection and analysis system built with Next.js (v15+), TypeScript, Prisma, PostgreSQL, and Tailwind CSS. It supports both admin-managed form creation and student submissions, with AI-powered summaries via LangChain/Groq.

🚀 Built for academic use, real-time form management, and intelligent feedback insights.

🌟 Features
🔐 Auth System: NextAuth with credential-based login and role-based admin protection.

🧠 AI Summaries: Generate structured feedback summaries using LLMs via LangChain + ChatGroq.

📊 Admin Dashboard: Stats, charts, and response analysis for every form.

📝 Form Builder & Editor: Create, edit, or delete forms and questions.

🙋‍♂️ Student View: Fill out feedback forms and get real-time feedback submission toasts.

📈 Charts & Visualizations: Built with Recharts and Chart.js for admin insights.

⚡ Modular API Design: RESTful endpoints with full CRUD support.

🎨 Modern UI: Built with Shadcn UI, Radix, Tailwind, and Lucide icons.

🛠️ Tech Stack:
Area	Tech Used
Frontend	Next.js 15+, TypeScript, Tailwind CSS, Shadcn UI
Backend	API Routes, Prisma ORM, PostgreSQL
Auth	NextAuth.js (Credentials Provider + Middleware)
AI/LLM	LangChain, ChatGroq (LLaMA model)
Charts	Recharts, Chart.js
Toast	Sonner
Icons	Lucide-react


🔄 API Overview
➕ Forms API
Endpoint	Description
POST /api/forms	Create a new feedback form
GET /api/forms	List all forms
GET /api/forms/:id	Get a specific form with questions
DELETE /api/forms/:id	Delete a form
POST /api/forms/:id/submit	Submit a response
GET /api/forms/:id/summary	Generate AI-powered summary

📊 Dashboard
GET /api/dashboard/stats: Returns total forms, responses, avg rating, per-form stats
