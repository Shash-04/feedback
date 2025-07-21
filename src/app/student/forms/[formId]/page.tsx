"use client"
import { useParams } from "next/navigation"
import { FormViewer } from "@/components/FormViewer"

export default function StudentFormPage() {
  const params = useParams()
  const formId = params.formId as string

  return <FormViewer formId={formId} />
}
