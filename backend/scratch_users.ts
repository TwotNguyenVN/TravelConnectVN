import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.public_users.findMany({
    select: {
      id: true,
      email: true,
      full_name: true,
      status: true,
    }
  });
  console.table(users);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
