// app/api/chat/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { restaurants } from '@/lib/restaurant-data';
import { generateOfflineResponse } from '@/lib/offlineEngine';

// Initialize Gemini only if API key exists
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const trimmed = message.trim();
    const lower = trimmed.toLowerCase();

    // --- STEP 1: Check for cancellation/refund queries early (offline) ---
    // This ensures the offline engine's smart logic (ask for type) runs first.
    if (/cancel|cancellation|refund|policy|change|modify|reschedule|no-show/i.test(lower)) {
      const offline = generateOfflineResponse(trimmed);
      return NextResponse.json({ reply: offline.text, richData: offline.richCard || null });
    }

    // --- STEP 2: Handle simple greetings offline ---
    const greetings = ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening', 'howdy'];
    if (greetings.includes(lower)) {
      const offline = generateOfflineResponse(trimmed);
      return NextResponse.json({ reply: offline.text, richData: offline.richCard || null });
    }

    // --- STEP 3: Try Gemini (if available) ---
    if (genAI) {
      try {
        // Build system prompt with restaurant data and cancellation policy
        const restaurantSummary = restaurants.map(r => 
          `- ${r.name} (${r.cuisine}, ${r.location}, $${r.price}, ★${r.rating})`
        ).join('\n');

        const systemInstruction = `
You are the TravelHub AI Assistant. You help users with travel planning, restaurant recommendations, tour bookings, cruise information, and general inquiries about our destinations.

Here is our restaurant portfolio:
${restaurantSummary}

Other services: we offer curated tours, luxury cruises, and destination packages.

## Cancellation & Refund Policies
We have different policies for each type:

- **Tours & Destination Packages**: Free cancellation up to 48 hours before departure. Within 48 hours, a 50% fee applies. No-shows are non-refundable.
- **Cruises**: Free cancellation up to 7 days before embarkation. Within 7 days, the booking is non-refundable.
- **Restaurant Reservations**: Free cancellation up to 24 hours before the reserved time. Within 24 hours, a $25 per person fee may be charged.

When a user asks about cancellation policy:
- If they mention a specific type (tour, cruise, restaurant), provide that specific policy.
- If they don't mention a type, ask them to specify which type they are interested in.
- Always offer to guide them to the "My Bookings" page for cancellation.

## Important Instructions
- For greetings like "hi", "hello", respond warmly and ask how you can help – do NOT list restaurants.
- If you don't know something, suggest the user contact support.
- Keep responses professional, concise, and friendly.
`;

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Prepare history for Gemini – ensure it starts with a user message
        let chatHistory = [];
        if (Array.isArray(history) && history.length > 0) {
          const filteredHistory = history.filter(h => h.role === 'user' || h.role === 'assistant');
          if (filteredHistory.length > 0 && filteredHistory[0].role === 'user') {
            chatHistory = filteredHistory.map(h => ({
              role: h.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: h.text }]
            }));
          }
        }

        const chat = model.startChat({
          history: chatHistory,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          },
          systemInstruction: systemInstruction,
        });

        const result = await chat.sendMessage(trimmed);
        const reply = result.response.text();

        // Get rich card from offline engine (if any)
        const offline = generateOfflineResponse(trimmed);
        const richCard = offline.richCard || null;

        return NextResponse.json({ reply, richData: richCard });

      } catch (geminiError) {
        console.error('Gemini error:', geminiError);
        // Fall through to offline engine
      }
    }

    // --- STEP 4: Fallback to offline engine ---
    const offline = generateOfflineResponse(trimmed);
    return NextResponse.json({ reply: offline.text, richData: offline.richCard || null });

  } catch (error) {
    console.error('Chat API error:', error);
    // Last resort fallback
    return NextResponse.json({
      reply: "I'm having trouble connecting right now. Please try again later, or check our website for more information."
    });
  }
}