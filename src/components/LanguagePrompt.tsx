import { useEffect, useState } from 'react';

const COOKIE_NAME = 'cuerpo_lang';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export interface LanguagePromptProps {
  // Only ever shown on English pages — a first visit that lands directly
  // on a Spanish article is already reading Spanish, so there's nothing
  // useful to offer it. Keeping this single-direction avoids needing
  // bilingual prompt copy for a feature explicitly scoped to default to
  // English.
  currentLang: 'en' | 'es';
  spanishHref: string;
}

function readCookie(name: string): string | undefined {
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1];
}

function setLangCookie(value: 'en' | 'es') {
  document.cookie = `${COOKIE_NAME}=${value}; max-age=${COOKIE_MAX_AGE}; path=/; SameSite=Lax`;
}

export default function LanguagePrompt({ currentLang, spanishHref }: LanguagePromptProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (currentLang !== 'en') return;
    if (readCookie(COOKIE_NAME)) return;
    setVisible(true);
  }, [currentLang]);

  if (!visible) return null;

  const dismiss = () => {
    setLangCookie('en');
    setVisible(false);
  };

  const chooseSpanish = () => {
    setLangCookie('es');
    window.location.href = spanishHref;
  };

  return (
    <div className="language-prompt" role="dialog" aria-label="Language preference">
      <p>Cuerpo Coffee is also available in Spanish.</p>
      <div className="language-prompt__actions">
        <button type="button" onClick={chooseSpanish}>
          Español
        </button>
        <button type="button" className="language-prompt__secondary" onClick={dismiss}>
          Continue in English
        </button>
      </div>
      <button
        type="button"
        className="language-prompt__close"
        aria-label="Dismiss"
        onClick={dismiss}
      >
        ×
      </button>
    </div>
  );
}
