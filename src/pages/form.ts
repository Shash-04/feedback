import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

const pool = new Pool({
  user: 'neondb_owner',
  host: 'ep-spring-math-a1a3qcuy-pooler.ap-southeast-1.aws.neon.tech',
  database: 'neondb',
  password: 'npg_V25rPGnUScai',
  port: 5432,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const result = await pool.query('SELECT id, title, created_at FROM "FeedbackForm"');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching forms:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}