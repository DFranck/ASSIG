// src/app/api/projects/[id]/route.ts
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const projects = [
    {
      id: '1',
      title: `Project 1`,
      description: `Details of project test`,
    },
    {
      id: '2',
      title: `Project 2`,
      description: `Details of project azeaze`,
    },
    {
      id: '3',
      title: `Project 3`,
      description: `Details of project zarar`,
    },
  ];
  // a remplacer par le call db
  return NextResponse.json(projects);
}
