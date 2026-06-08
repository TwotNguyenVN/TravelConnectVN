import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.companion_posts.findMany({
    where: {
      title: {
        contains: 'Sapa',
      }
    },
    include: {
      users: {
        select: { full_name: true, email: true }
      }
    }
  });
  console.log(JSON.stringify(posts, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
