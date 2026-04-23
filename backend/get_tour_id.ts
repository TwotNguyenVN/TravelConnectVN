import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const tour = await prisma.tours.findFirst({
    where: { province: { in: ['Lâm Đồng', 'Khánh Hòa', 'Đà Nẵng', 'Hà Nội'] } }
  });
  if (tour) {
    console.log('TOUR_ID:', tour.id);
    console.log('PROVINCE:', tour.province);
  } else {
    const anyTour = await prisma.tours.findFirst();
    if (anyTour) {
      console.log('TOUR_ID:', anyTour.id);
      console.log('PROVINCE:', anyTour.province);
    }
  }
}

main().finally(() => prisma.$disconnect());
