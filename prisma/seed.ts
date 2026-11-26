import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { hashPassword } from '../src/utils/password.js';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });


async function main() {
  console.log('Starting database seed...');

  const adminPassword = await hashPassword('Admin123!');
  const userPassword = await hashPassword('Usuario123!');

  await prisma.user.upsert({
    where: {
      username: 'admin',
    },
    update: {
      email: 'admin@example.com',
      password: adminPassword,
      pokemonIds: [1, 25, 6],
    },
    create: {
      username: 'admin',
      email: 'admin@example.com',
      password: adminPassword,
      pokemonIds: [1, 25, 6],
    },
  });

  await prisma.user.upsert({
    where: {
      username: 'usuario1',
    },
    update: {
      email: 'usuario1@example.com',
      password: userPassword,
      pokemonIds: [4, 7, 25],
    },
    create: {
      username: 'usuario1',
      email: 'usuario1@example.com',
      password: userPassword,
      pokemonIds: [4, 7, 25],
    },
  });

  console.log('Database seed completed successfully.');
}

main()
  .catch((error) => {
    console.error('Error executing seed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
