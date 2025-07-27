// File: src/app/api/forms/[formId]/responses/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Client } from "pg";
import { stringify } from "csv-stringify/sync";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ formId: string }> }
) {
  const resolvedParams = await params;
//   console.log('API Route called with params:', resolvedParams); // Debug log

  const formId = resolvedParams.formId;

  if (!formId || typeof formId !== "string") {
    // console.log('Invalid formId:', formId); // Debug log
    return NextResponse.json({ error: "Invalid form ID" }, { status: 400 });
  }

  const client = new Client({
    user: "neondb_owner",
    host: "ep-spring-math-a1a3qcuy-pooler.ap-southeast-1.aws.neon.tech",
    database: "neondb",
    password: "npg_V25rPGnUScai",
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    // console.log('Database connected successfully'); // Debug log

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

    const result = await client.query(query, [formId]);
    // console.log('Query executed, rows found:', result.rows.length); // Debug log

    // If no responses found, return empty CSV with basic headers
    if (result.rows.length === 0) {
      console.log('No responses found, returning empty CSV'); // Debug log
      const emptyCSV = '"Response ID","Submitted At"\n';
      
      return new NextResponse(emptyCSV, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="form_${formId}_responses.csv"`,
        },
      });
    }

    // Group responses by response ID
    const grouped: Record<string, any> = {};
    result.rows.forEach(row => {
      const key = `${row.response_id}::${row.createdAt}`;
      if (!grouped[key]) {
        grouped[key] = { 
          id: row.response_id, 
          createdAt: row.createdAt, 
          answers: [] 
        };
      }
      grouped[key].answers.push({ 
        order: row.question_order, 
        question: row.question, 
        answer: row.answer || '' 
      });
    });

    // Convert to CSV format
    const records = Object.values(grouped).map((res: any) => {
      const answers = res.answers.sort((a: any, b: any) => a.order - b.order);
      const entry: any = {
        "Response ID": res.id,
        "Submitted At": res.createdAt,
      };
      
      // Add each question as a column
      answers.forEach((ans: any) => {
        entry[ans.question] = ans.answer || '';
      });
      
      return entry;
    });

    // console.log('Records prepared for CSV:', records.length); // Debug log
    // console.log('Sample record:', records[0]); // Debug log

    // Generate CSV
    const csv = stringify(records, { 
      header: true,
      quoted: true,
      quoted_empty: true,
      quoted_string: true,
      escape: '"'
    });

    // console.log('CSV generated successfully, length:', csv.length); // Debug log

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="form_${formId}_responses.csv"`,
      },
    });

  } catch (error) {
    // console.error('Database/API error:', error); // Debug log
    
    return NextResponse.json(
      { 
        error: "Internal server error", 
        details: error instanceof Error ? error.message : 'Unknown error',
        formId: formId
      }, 
      { status: 500 }
    );
  } finally {
    try {
      await client.end();
      console.log('Database connection closed'); // Debug log
    } catch (closeError) {
      console.error('Error closing database connection:', closeError);
    }
  }
}