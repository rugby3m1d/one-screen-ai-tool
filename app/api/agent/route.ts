import { NextResponse } from 'next/server';

type Mode = 'summary' | 'bullets' | 'tasks';

type AgentRequestBody = {
  text?: unknown;
  mode?: unknown;
};

type OpenAIResponse = {
  output_text?: string;
  output?: Array<{
    type?: string;
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
};

const modeSet: Set<Mode> = new Set(['summary', 'bullets', 'tasks']);

const modePrompts: Record<Mode, string> = {
  summary: '次の文章を簡潔に要約してください。',
  bullets: '次の文章を箇条書きに整理してください。',
  tasks: '次の文章から実行すべきタスクを抽出してください。'
};

const buildUserPrompt = (text: string, mode: Mode): string => {
  return `${modePrompts[mode]}\n\n---\n${text.trim()}\n---`;
};

const requestAiResult = async (text: string, mode: Mode): Promise<string> => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set.');
  }

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4.1-mini',
      input: [
        {
          role: 'system',
          content: 'あなたは日本語でテキスト処理を行うアシスタントです。必ず日本語で回答してください。'
        },
        {
          role: 'user',
          content: buildUserPrompt(text, mode)
        }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API request failed: ${response.status} ${errorText}`);
  }

  const data = (await response.json()) as OpenAIResponse;
  const fallbackText = data.output
    ?.flatMap((item) => item.content ?? [])
    .find((content) => content.type === 'output_text' && typeof content.text === 'string')
    ?.text;
  const resultText = typeof data.output_text === 'string' ? data.output_text : fallbackText;

  if (typeof resultText !== 'string' || resultText.trim().length === 0) {
    throw new Error('OpenAI API returned an unexpected response.');
  }

  return resultText.trim();
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

  try {
    const result = await requestAiResult(text, mode as Mode);
    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    console.error(
      '[POST /api/agent] AI processing failed.',
      {
        mode,
        textLength: text.trim().length,
        errorMessage
      },
      error
    );
  }
}
