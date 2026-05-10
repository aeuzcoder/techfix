import { NextResponse } from 'next/server';
import { verifyToken, getDbUser } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const verified = await verifyToken(request);
    if (!verified) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await getDbUser(verified.uid);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const { answers } = await request.json();

    if (!Array.isArray(answers) || answers.length !== 10) {
      return NextResponse.json({ error: '10 answers required' }, { status: 400 });
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
      console.error('GROQ_API_KEY is not set');
      return NextResponse.json(
        { error: 'Advisor AI is not configured. Set GROQ_API_KEY in the environment.' },
        { status: 503 }
      );
    }

    const systemPrompt = `You are a computer hardware expert. The user answered 10 questions about their laptop/PC needs. Analyze the answers and return ONLY a valid JSON object with exactly these fields:
{
  "cpu": "recommended processor name",
  "gpu": "recommended graphics card name or 'Integrated Graphics'",
  "ram": 16,
  "ssd": 512,
  "display": "15.6 inch FHD 144Hz",
  "budget_min": 8000000,
  "budget_max": 12000000,
  "justification": "2-3 sentence explanation in the same language as the answers"
}
Return only the JSON object. No markdown, no explanation, no extra text.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: 'Answers: ' + JSON.stringify(answers) }
        ],
        temperature: 0.2,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Groq API Error:', errorData);
      // Fallback mock response if API fails
      return NextResponse.json({
        cpu: "Intel Core i5-12500H",
        gpu: "NVIDIA RTX 3050",
        ram: 16,
        ssd: 512,
        display: "15.6 inch FHD 144Hz",
        budget_min: 8000000,
        budget_max: 12000000,
        justification: "Sizning ehtiyojlaringizga mos o'rta segment noutbuk. Groq API xatoligi sababli mock natija ko'rsatilmoqda."
      });
    }

    const data = await response.json();
    const textContent = data.choices?.[0]?.message?.content || '';

    try {
      const jsonStr = textContent.replace(/```json/g, '').replace(/```/g, '').trim();
      const result = JSON.parse(jsonStr);
      return NextResponse.json(result);
    } catch {
      console.error('JSON Parse error from Gemini:', textContent);
      return NextResponse.json({ error: 'Invalid response from AI' }, { status: 500 });
    }

  } catch (error) {
    console.error('API /advisor/analyze error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
