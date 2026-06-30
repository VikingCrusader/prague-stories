import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

async function translateWithGoogle(text, targetLang) {
  const url = `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: text, source: 'en', target: targetLang, format: 'text' }),
  });

  if (!res.ok) throw new Error(`Google Translate ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.data.translations[0].translatedText;
}

export async function generateLocationDescription(locationName, category, existingEn = null) {
  if (existingEn) {
    const [cz, zh] = await Promise.all([
      translateWithGoogle(existingEn, 'cs'),
      translateWithGoogle(existingEn, 'zh-CN'),
    ]);
    return { en: existingEn, cz, zh };
  }

  const prompt = `You are the narrator of "Prague Stories", a pixel-art RPG where players explore real Prague locations as if they were quest objectives.

Write a quest description for the location "${locationName}" (category: ${category}) in Prague, Czech Republic.

Rules:
- Write exactly 100-120 words per language
- Tone: adventurous, slightly humorous, like a dungeon master revealing a secret zone
- Include ONE surprising hidden Easter egg fact — something most tourists never discover
- Use RPG flavour: "brave explorer", "ancient secrets", "unlock", "legendary", etc.
- Do NOT use generic travel brochure language

Return ONLY valid JSON in exactly this format (no markdown, no extra text):
{
  "en": "English quest description here",
  "cz": "Czech quest description here",
  "zh": "Chinese (Simplified) quest description here"
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  const parsed = JSON.parse(cleaned);

  if (!parsed.en || !parsed.cz || !parsed.zh) {
    throw new Error('Gemini response missing required language fields');
  }
  return parsed;
}
