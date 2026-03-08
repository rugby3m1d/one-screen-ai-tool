'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';

type Mode = 'summary' | 'bullets' | 'tasks';

type AgentSuccessResponse = {
  result: string;
};

type AgentErrorResponse = {
  error?: string;
};

type SpeechRecognitionAlternative = {
  transcript: string;
};

type SpeechRecognitionResult = {
  0: SpeechRecognitionAlternative;
};

type SpeechRecognitionResultList = {
  0: SpeechRecognitionResult;
};

type SpeechRecognitionEvent = {
  results: SpeechRecognitionResultList;
};

type SpeechRecognitionErrorEvent = {
  error: string;
};

type SpeechRecognitionInstance = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

type ExtendedWindow = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
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
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState('');
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const supported =
      'SpeechRecognition' in window ||
      'webkitSpeechRecognition' in (window as ExtendedWindow);
    setIsSpeechSupported(supported);

    return () => {
      recognitionRef.current?.stop();
      recognitionRef.current = null;
    };
  }, []);

  const handleVoiceInput = () => {
    setSpeechError('');

    if (typeof window === 'undefined') {
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const extendedWindow = window as ExtendedWindow;
    const SpeechRecognitionApi =
      extendedWindow.SpeechRecognition || extendedWindow.webkitSpeechRecognition;

    if (!SpeechRecognitionApi) {
      setSpeechError('このブラウザでは音声入力を利用できません。');
      return;
    }

    const recognition = new SpeechRecognitionApi();
    recognition.lang = 'ja-JP';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onerror = (event) => {
      setSpeechError(`音声入力エラー: ${event.error}`);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? '';

      if (transcript) {
        setText((previousText) => {
          if (!previousText.trim()) {
            return transcript;
          }

          return `${previousText}\n${transcript}`;
        });
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

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

          <div className="voice-input-row">
            <button
              type="button"
              onClick={handleVoiceInput}
              className="button secondary-button"
              disabled={!isSpeechSupported || isLoading}
            >
              {isListening ? '音声入力を停止' : '音声入力を開始'}
            </button>
            <span className="voice-status" role="status" aria-live="polite">
              {!isSpeechSupported
                ? 'お使いのブラウザは音声入力に未対応です。'
                : isListening
                  ? '音声を認識中です…'
                  : 'マイクで日本語の音声入力ができます。'}
            </span>
          </div>

          {speechError ? <p role="alert">{speechError}</p> : null}

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
