'use client';

import { FormEvent, useState } from 'react';

type Mode = 'summary' | 'bullets' | 'tasks';

const modes: Array<{ label: string; value: Mode }> = [
  { label: 'summary', value: 'summary' },
  { label: 'bullets', value: 'bullets' },
  { label: 'tasks', value: 'tasks' }
];

export default function Home() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<Mode>('summary');
  const [result, setResult] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setResult(`Processed result:\n${text}`);
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
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>

          <button type="submit" className="button">
            Run
          </button>
        </form>

        <section className="result" aria-live="polite">
          <h2>Result</h2>
          <pre>{result || 'ここに結果が表示されます。'}</pre>
        </section>
      </section>
    </main>
  );
}
