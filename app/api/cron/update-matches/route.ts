import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(request: Request) {
  // Sécurité : seul Vercel peut lancer le cron
  const authHeader = request.headers.get('authorization');
  if (authHeader!== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Ici on demande à l'IA de faire 3 prédictions
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ 
        role: "user", 
        content: "Donne moi 3 prédictions de matchs de foot pour aujourd'hui. Format: Equipe1 vs Equipe2: 1X2 avec % de chance" 
      }],
    });

    console.log("Prédictions générées:", completion.choices[0].message.content);
    
    // TODO: Ici on va enregistrer dans DATABASE_URL
    
    return NextResponse.json({ 
      success: true, 
      predictions: completion.choices[0].message.content 
    });
    
  } catch (error) {
    return NextResponse.json({ error: 'Erreur IA' }, { status: 500 });
  }
}
