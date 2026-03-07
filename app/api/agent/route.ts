import { NextResponse } from 'next/server';

type Mode = 'summary' | 'bullets' | 'tasks';

type AgentRequestBody = {
  text?: unknown;
  mode?: unknown;
};

const modeSet: Set<Mode> = new Set(['summary', 'bullets', 'tasks']);

const processText = (text: string, mode: Mode): string => {
  const trimmedText = text.trim();

  switch (mode) {
    case 'summary':
      return `Summary: ${trimmedText}`;
    case 'bullets':
      return `- item: ${trimmedText}`;
    case 'tasks':
      return `- TODO: ${trimmedText}`;
    default:
      return trimmedText;
  }
};

export async function POST(request: Request) {
  let body: AgentRequestBody;

  try {
    body = (await request.json()) as AgentRequestBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const { text, mode } = body;

  if (typeof text !== 'string' || text.trim().length === 0) {
    return NextResponse.json({ error: 'text must be a non-empty string.' }, { status: 400 });
  }

  if (typeof mode !== 'string' || !modeSet.has(mode as Mode)) {
    return NextResponse.json(
      { error: 'mode must be one of: summary, bullets, tasks.' },
      { status: 400 }
    );
  }

  const result = processText(text, mode as Mode);

  return NextResponse.json({ result }, { status: 200 });
}
