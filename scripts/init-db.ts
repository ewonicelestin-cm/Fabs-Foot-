import { initializeDatabase } from '../lib/db';  
  
async function main() {  
  try {  
    await initializeDatabase();  
    process.exit(0);  
  } catch (error) {  
    console.error('Init error:', error);  
    process.exit(1);  
  }  
}  
  
main();
