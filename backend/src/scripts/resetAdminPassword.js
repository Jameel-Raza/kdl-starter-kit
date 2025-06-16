import { PrismaClient } from '../generated/prisma/index.js';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function resetAdminPassword() {
  try {
    // New password to set
    const newPassword = 'admin123'; // You can change this to any password you want
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the admin user's password
    const updatedUser = await prisma.users.update({
      where: {
        email: 'admin@example.com'
      },
      data: {
        password: hashedPassword
      }
    });

    console.log('✅ Admin password reset successful!');
    console.log('New credentials:');
    console.log('Email: admin@example.com');
    console.log('Password:', newPassword);

  } catch (error) {
    console.error('❌ Error resetting admin password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the reset
resetAdminPassword(); 