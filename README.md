<div align="center">

# Feedback Analysis App

**A dynamic, full-stack feedback collection and analysis system**

<div style="display: flex; justify-content: center; gap: 10px; margin: 20px 0;">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/PostgreSQL-Pg-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Groq_AI-LLM-F56565?style=for-the-badge" alt="Groq AI" />
</div>

</div>

---

## 🚀 Overview

The Feedback Analysis App is a comprehensive, full-stack web application designed for seamless feedback collection and deep-dive analysis. It empowers administrators to build dynamic forms while providing students with an intuitive, real-time submission interface.

Built with bleeding-edge web technologies, it features intelligent AI-powered summaries powered by LangChain and Groq LLMs to extract actionable insights from unstructured feedback instantly.

## ✨ Features

### 🔐 Robust Authentication
- **Secure Access:** NextAuth implementation with credential-based login and strict role-based admin protection to keep feedback data safe.

### 🧠 Intelligent AI Summaries
- **LangChain + ChatGroq:** Automatically analyze and generate structured, actionable summaries from qualitative feedback using advanced LLMs.

### 📊 Powerful Admin Dashboard
- **Comprehensive Analytics:** Track total forms, responses, average ratings, and per-form statistics.
- **Rich Visualizations:** Interactive charts and graphs built with Recharts, Chart.js, and D3 for immediate insights.
- **Document Exports:** Export data seamlessly to PDF (jspdf + html2canvas) or CSV formats.

### 📝 Dynamic Form Builder & Editor
- **Customizable Forms:** Intuitive admin builder to create, edit, or delete forms and configure specific questions on the fly.

### 🙋‍♂️ Seamless Student Experience
- **Real-time Submissions:** Clean, accessible interface for students to fill out feedback forms with real-time UI interactions and toast notifications via Sonner.

### 🎨 Modern, Interactive UI
- **State-of-the-art Design:** Built with Tailwind CSS v4, Radix UI components, and Framer Motion for a stunning, highly responsive user experience. 

---

## 🛠️ Tech Stack & Routes

- **Frontend:** Next.js 15.2+ (App Router), React 19, TypeScript, Tailwind CSS
- **Backend:** PostgreSQL, Prisma ORM, NextAuth
- **API Structure:** 
  - `POST /api/auth/[...nextauth]` - Authentication callbacks and handlers
  - `GET/POST/PUT/DELETE /api/forms/*` - Form Management & Submission endpoints
  - `GET /api/forms/[formId]/summary` - AI Insight Generation endpoint
  - `GET /api/dashboard/stats` - Analytics data retrieval
