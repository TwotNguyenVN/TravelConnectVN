
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testQuery() {
  try {
    console.log('Testing Tours Query...');
    const tours = await prisma.tours.findMany({
      take: 1,
      include: {
        guide_profiles: {
          include: {
            users: { select: { full_name: true } }
          }
        }
      }
    });
    console.log('Tours Query Success:', JSON.stringify(tours, null, 2));

    console.log('\nTesting Companion Posts Query...');
    const posts = await prisma.companion_posts.findMany({
      take: 1,
      include: {
        users: { select: { full_name: true } }
      }
    });
    console.log('Companion Posts Query Success:', JSON.stringify(posts, null, 2));

  } catch (error) {
    console.error('QUERY FAILED:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testQuery();
