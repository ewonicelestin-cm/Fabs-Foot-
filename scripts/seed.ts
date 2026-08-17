import { sql } from '@vercel/postgres';  
  
async function seed() {  
  try {  
    console.log('Seeding database...');  
  
    const matches = [  
      {  
        homeTeam: 'Paris Saint-Germain',  
        awayTeam: 'Real Madrid',  
        startTime: new Date(Date.now() + 2 * 60 * 60 * 1000),  
      },  
      {  
        homeTeam: 'Liverpool',  
        awayTeam: 'Manchester City',  
        startTime: new Date(Date.now() + 4 * 60 * 60 * 1000),  
      },  
      {  
        homeTeam: 'Barcelona',  
        awayTeam: 'Bayern Munich',  
        startTime: new Date(Date.now() + 6 * 60 * 60 * 1000),  
      },  
    ];  
  
    for (const match of matches) {  
      await sql`  
        INSERT INTO matches (home_team, away_team, start_time)  
        VALUES (${match.homeTeam}, ${match.awayTeam}, ${match.startTime.toISOString()})  
        ON CONFLICT DO NOTHING  
      `;  
    }  
  
    console.log('✅ Database seeded successfully');  
  } catch (error) {  
    console.error('❌ Seed error:', error);  
    process.exit(1);  
  }  
}  
  
seed();
