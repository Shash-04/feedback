import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { LLMChain } from 'langchain/chains';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
});
type Shashwat = {
  params: Promise<{ formId: string }>;
};

export async function GET(
  req: NextRequest,
  { params }: Shashwat
) {
  try {
    const formId = (await params).formId;

    if (!formId) {
      return NextResponse.json({ error: 'Missing formId' }, { status: 400 });
    }

    const client = await pool.connect();

    const query = `
      SELECT
          r.id AS response_id,
          r."createdAt",
          q."order" AS question_order,
          q.question,
          a.answer
      FROM "FeedbackResponse" r
      JOIN "Answer" a ON r.id = a."responseId"
      JOIN "FeedbackQuestion" q ON a."questionId" = q.id
      WHERE r."formId" = $1
      ORDER BY r."createdAt" DESC, q."order" ASC
    `;

    const { rows } = await client.query(query, [formId]);
    client.release();

    if (!rows.length) {
      return NextResponse.json({ message: 'No responses found.' }, { status: 404 });
    }

    // Group responses
    const grouped: Record<string, string[]> = {};
    const timestamps: Record<string, string> = {};

    for (const row of rows) {
      const key = row.response_id;
      if (!grouped[key]) {
        grouped[key] = [];
        timestamps[key] = row.createdAt;
      }
      grouped[key].push(`${row.question_order}. ${row.question} → ${row.answer}`);
    }

    let allFeedbackText = '';

    for (const [id, answers] of Object.entries(grouped)) {
      allFeedbackText += `🧾 Response ID: ${id}\n🕒 Submitted At: ${timestamps[id]}\n`;
      allFeedbackText += answers.join('\n') + '\n\n';
    }

    const prompt = new PromptTemplate({
      inputVariables: ['feedback'],
      template: `
You are a professional summarization assistant. The following is feedback collected from multiple reviewers about different students as part of a company feedback form.

The questions and answers may vary across entries.

Your task:
- Analyze the responses collectively.
- Identify common themes or trends in feedback.
- Mention frequently observed strengths, weaknesses, behavior, professionalism, and recommendations.
- Highlight insights like most common ratings, general satisfaction, and areas students typically excel or struggle in.

Feedback:
-----------------------
{feedback}
-----------------------

Generate a detailed, structured summary that can be used in a report to the academic coordinator. Use a formal tone.
`,
    });

    const model = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY!,
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      temperature: 0.3,
    });

    const chain = new LLMChain({ llm: model, prompt });
    const summary = await chain.run({ feedback: allFeedbackText });

    return NextResponse.json({ summary });
  } catch (err) {
    console.error('Summary generation failed:', err);
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
  }
}