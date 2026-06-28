import { NextResponse } from 'next/server';
import { Pool } from 'pg';

export const dynamic = 'force-dynamic';

export async function GET() {
  const url = process.env.DATABASE_URL;
  
  if (!url) {
    return NextResponse.json({ 
      status: "Error", 
      message: "DATABASE_URL is missing from environment variables." 
    }, { status: 500 });
  }

  const sanitizedUrl = url.replace(/:([^:@]+)@/, ':****@');

  try {
    const pool = new Pool({
      connectionString: url,
      connectionTimeoutMillis: 10000
    });
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    await pool.end();
    
    return NextResponse.json({ 
      status: "Success", 
      message: "Successfully connected to the database!",
      time: result.rows[0].now,
      env_check: sanitizedUrl
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ 
      status: "Connection Failed", 
      error: errorMessage,
      env_check: sanitizedUrl
    }, { status: 500 });
  }
}
