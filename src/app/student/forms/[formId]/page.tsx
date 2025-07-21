import { PrismaClient } from "@prisma/client";
import FormViewer from "@/components/FormViewer";

const prisma = new PrismaClient();

export default async function FormPage({ params }: { params: { formId: string } }) {
  const form = await prisma.feedbackForm.findUnique({
    where: { id: params.formId },
    include: { questions: true }
  });

  if (!form) return <div className="text-red-500 p-4">Form not found</div>;

  return <FormViewer formData={form} />;
}
