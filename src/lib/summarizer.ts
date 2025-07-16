import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
// import { RunnableSequence } from "langchain/schema/runnable";
// import { getStringFromMessageContent } from "@langchain/core/messages";

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY!,
  model: "meta-llama/llama-4-scout-17b-16e-instruct",
});

const prompt = ChatPromptTemplate.fromTemplate(`
You are an HR analyst reviewing student internship feedback.

Include:
1. Overall strengths
2. Areas needing improvement
3. Top 5 standout students (name + reason)
4. 5 struggling students (name + reason)
5. A brief expert summary

Data:
{feedback}
`);

const chain = prompt.pipe(model);

// export async function summarizeFeedback(input: string): Promise<string> {
//   const response = await chain.invoke({ feedback: input });
//   return response.content;
// }

// export async function summarizeFeedback(input: string): Promise<string> {
//   const response = await chain.invoke({ feedback: input });
//   return getStringFromMessageContent(response.content);
// }

export async function summarizeFeedback(input: string): Promise<string> {
  const response = await chain.invoke({ feedback: input });
  
  // If response.content is MessageContentComplex[]
  if (Array.isArray(response.content)) {
    return response.content.map((part: any) => part.text).join("");
  }

  // Fallback for string
  return String(response.content);
}