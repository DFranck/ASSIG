// src/app/api/projects/[id]/route.ts
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  const project = {
    id,
    title: `Project ${id}`,
    description: `Details of project ${id}azeaze aze`,
  };
  return NextResponse.json(project);
}
