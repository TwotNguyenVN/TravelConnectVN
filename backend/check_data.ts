import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const tours = await prisma.tours.findMany({ take: 1 });
  const users = await prisma.public_users.findMany({ take: 1 });
  const posts = await prisma.companion_posts.findMany({ take: 1 });
  
  console.log('--- TOURS ---');
  console.log(JSON.stringify(tours, null, 2));
  console.log('--- USERS ---');
  console.log(JSON.stringify(users, null, 2));
  console.log('--- POSTS ---');
  console.log(JSON.stringify(posts, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
