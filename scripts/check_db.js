const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Tours:', await prisma.tour.count());
    console.log('Users:', await prisma.user.count());
    console.log('Companions:', await prisma.companionPost.count());
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
