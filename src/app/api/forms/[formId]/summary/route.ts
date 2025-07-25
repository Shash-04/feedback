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
  template: `You are a professional data analysis assistant. Analyze this feedback and return JSON with:
- A brief summary
- Common themes with counts
- Average ratings
- Top strengths and weaknesses
- Sentiment analysis
- Frequent words
- Timeline data if available

Return ONLY valid JSON in this exact structure:
{{
  "summary": "brief overview",
  "themes": [{{"name": "theme1", "count": 1}}],
  "ratings": {{
    "categories": ["category1"],
    "averages": [4.5]
  }},
  "strengths": ["strength1"],
  "weaknesses": ["weakness1"],
  "sentiment": {{
    "positive": 70,
    "neutral": 20,
    "negative": 10
  }},
  "wordCloud": [{{"text": "word1", "value": 5}}],
  "timeline": [{{"date": "2023-01-01", "count": 5, "avgSentiment": 3.5}}],
  "recommendations": ["recommendation1"]
}}

Feedback Data:
{feedback}

Important Rules:
1. Output must be valid JSON only
2. No additional text outside the JSON
3. No markdown formatting
4. Ensure all brackets are properly closed`
});


    const model = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY!,
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      temperature: 0.3,
    });

    const chain = new LLMChain({ llm: model, prompt });
    const result = await chain.run({ feedback: allFeedbackText });

    // Parse the JSON response
    let jsonResult;
    try {
      jsonResult = JSON.parse(result.replace(/```json|```/g, '').trim());
    } catch (e) {
      console.error('Failed to parse JSON:', result);
      return NextResponse.json({ error: 'Failed to parse summary data' }, { status: 500 });
    }

    return NextResponse.json(jsonResult);
  } catch (err) {
    console.error('Summary generation failed:', err);
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
  }
}