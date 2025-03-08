// src/app/api/hello.ts
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  return NextResponse.json({ message: 'Hello from Next.js API route' })
}
