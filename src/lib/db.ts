import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function fetchFeedbackData() {
  const client = await pool.connect();
  try {
    const res = await client.query(`
      SELECT "studentName", "companyName", "technicalSkills", "problemSolving",
             "communicationSkills", "overallSatisfaction", "taskUnderstanding",
             "adaptability", "additionalComments", "createdAt"
      FROM "CompanyFeedback"
    `);
    return res.rows;
  } finally {
    client.release();
  }
}
