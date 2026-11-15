import { useEffect, useState } from 'react'

/** "Hello" in languages ESL teachers often meet in class. dir is set so Arabic renders right-to-left. */
const HELLOS: { word: string; lang: string; code: string; dir?: 'rtl' }[] = [
  { word: 'Hello', lang: 'English', code: 'en' },
  { word: 'Hola', lang: 'Spanish', code: 'es' },
  { word: 'こんにちは', lang: 'Japanese', code: 'ja' },
  { word: 'Olá', lang: 'Portuguese', code: 'pt' },
  { word: '你好', lang: 'Chinese', code: 'zh' },
  { word: 'مرحبا', lang: 'Arabic', code: 'ar', dir: 'rtl' },
  { word: 'Bonjour', lang: 'French', code: 'fr' },
  { word: '안녕하세요', lang: 'Korean', code: 'ko' },
  { word: 'Xin chào', lang: 'Vietnamese', code: 'vi' },
  { word: 'Merhaba', lang: 'Turkish', code: 'tr' },
  { word: 'Привет', lang: 'Russian', code: 'ru' },
  { word: 'Ciao', lang: 'Italian', code: 'it' },
  { word: 'สวัสดี', lang: 'Thai', code: 'th' },
  { word: 'Cześć', lang: 'Polish', code: 'pl' },
]

const reducedMotion = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

/** "Hello, class!" that flips through languages every couple of seconds. */
export function Greeting() {
  const [i, setI] = useState(0)

  useEffect(() => {
    if (reducedMotion()) return
    const id = setInterval(() => setI((n) => (n + 1) % HELLOS.length), 2200)
    return () => clearInterval(id)
  }, [])

  const h = HELLOS[i]
  return (
    <p className="eyebrow hand greeting">
      <span className="sr-only">Hello, class!</span>
      <span aria-hidden="true" className="greeting-line">
        <span key={i} className="greeting-word" lang={h.code} dir={h.dir}>{h.word}</span>, class!
        <span key={`l${i}`} className="greeting-lang">{h.lang}</span>
      </span>
    </p>
  )
}
