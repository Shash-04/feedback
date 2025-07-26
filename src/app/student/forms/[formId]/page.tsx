"use client"
import { useParams } from "next/navigation"
import { FormViewer } from "@/components/FormViewer"

export default function StudentFormPage() {
  const params = useParams()
  const formId = typeof params?.formId === "string" ? params.formId : Array.isArray(params?.formId) ? params.formId[0] : "";

  return <FormViewer formId={formId} />
}
