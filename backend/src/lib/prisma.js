import { PrismaClient } from '../generated/prisma/index.js';

// Create a singleton instance of PrismaClient with logging
const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

// Test database connection
async function testConnection() {
  try {
    console.log('Testing database connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL);
    
    // Try to connect
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Try a simple query
    const userCount = await prisma.users.count();
    console.log('✅ Database query successful. User count:', userCount);
  } catch (error) {
    console.error('❌ Database connection error:', {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack
    });
    throw error; // Re-throw to prevent the app from starting with a bad connection
  }
}

// Handle connection errors
prisma.$on('error', (e) => {
  console.error('Prisma Client error:', {
    message: e.message,
    code: e.code,
    meta: e.meta,
    stack: e.stack
  });
});

// Test connection on startup
testConnection()
  .catch((error) => {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  });

// Handle process termination
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma; 