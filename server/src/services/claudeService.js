import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

export async function generateLocationDescription(locationName, category) {
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

  // Strip markdown code fences if the model wraps the JSON
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  const parsed = JSON.parse(cleaned);

  if (!parsed.en || !parsed.cz || !parsed.zh) {
    throw new Error('Gemini response missing required language fields');
  }
  return parsed;
}
