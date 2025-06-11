import { PrismaClient } from '../../src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding settings...');

  const projects = [
    {
      name: 'Project Name',
      slug: 'project_name',
      value: 'PillowMate'
    },
    {
      name: 'Novelty',
      slug: 'novelty',
      value: 'PillowMate'
    },
    {
      name: 'Category',
      slug: 'category',
      value: 'PillowMate'
    },
  ];

  for (const project of projects) {
    await prisma.projects.create({
      data: project
    });
  }

  console.log('✅ Projects seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
