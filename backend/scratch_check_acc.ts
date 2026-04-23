import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const accs = await prisma.partner_accommodations.findMany();
  console.log('Total Accommodations:', accs.length);
  
  const tourAccs = await prisma.tour_accommodations.findMany({
    include: { tours: true, partner_accommodations: true }
  });
  console.log('Total Linked Tour-Accommodations:', tourAccs.length);
  
  if (tourAccs.length > 0) {
    console.log('Sample Link:', {
      tour: tourAccs[0].tours.title,
      acc: tourAccs[0].partner_accommodations.name
    });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
