import { PrismaClient } from '../src/generated/prisma/index.js';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.users.create({
    data: {
      name: 'Admin User',
      mobile: '1234567890',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN',
      address: 'Admin Address'
    }
  });
  console.log('✅ Admin user created');

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 10);
  await prisma.users.create({
    data: {
      name: 'Regular User',
      mobile: '0987654321',
      email: 'user@example.com',
      password: userPassword,
      role: 'USER',
      address: 'User Address'
    }
  });
  console.log('✅ Regular user created');

  console.log('✅ Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 