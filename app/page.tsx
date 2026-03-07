'use client';

import { FormEvent, useState } from 'react';

type Mode = 'summary' | 'bullets' | 'tasks';

type AgentSuccessResponse = {
  result: string;
};

type AgentErrorResponse = {
  error?: string;
};

const modes: Array<{ label: string; value: Mode }> = [
  { label: 'summary', value: 'summary' },
  { label: 'bullets', value: 'bullets' },
  { label: 'tasks', value: 'tasks' }
];

export default function Home() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<Mode>('summary');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text, mode })
      });

      const data = (await response.json()) as AgentSuccessResponse | AgentErrorResponse;

      if (!response.ok) {
        const message = 'error' in data && typeof data.error === 'string' ? data.error : 'Failed to process text.';
        setError(message);
        setResult('');
        return;
      }

      if (!('result' in data) || typeof data.result !== 'string') {
        setError('Unexpected API response.');
        setResult('');
        return;
      }

      setResult(data.result);
    } catch {
      setError('Network error occurred while calling the API.');
      setResult('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container">
      <section className="panel">
        <h1>One Screen AI Tool</h1>

        <form onSubmit={handleSubmit} className="form">
          <label htmlFor="input-text" className="label">
            Input text
          </label>
          <textarea
            id="input-text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={8}
            placeholder="文章を入力してください"
            className="textarea"
          />

          <fieldset className="fieldset">
            <legend className="label">Processing mode</legend>
            <div className="modes">
              {modes.map((option) => (
                <label key={option.value} className="mode-option">
                  <input
                    type="radio"
                    name="mode"
                    value={option.value}
                    checked={mode === option.value}
                    onChange={() => setMode(option.value)}
                    disabled={isLoading}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>

          <button type="submit" className="button" disabled={isLoading}>
            {isLoading ? 'Running...' : 'Run'}
          </button>
        </form>

        {error ? <p role="alert">Error: {error}</p> : null}

        <section className="result" aria-live="polite">
          <h2>Result</h2>
          <pre>{result || 'ここに結果が表示されます。'}</pre>
        </section>
      </section>
    </main>
  );
}
