const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.users.findUnique({
    where: { email: 'nguyenminhkhoi.tcvn@gmail.com' }
  });

  if (!user) {
    console.log('User not found');
    return;
  }

  const guideProfile = await prisma.guide_profiles.findUnique({
    where: { user_id: user.id },
    include: {
      tours: {
        select: {
          id: true,
          title: true,
          status: true,
          price: true,
          duration_days: true,
          tour_categories: { select: { name: true } },
          destinations: { select: { name: true } }
        }
      }
    }
  });

  if (!guideProfile) {
    console.log('Guide profile not found');
    return;
  }

  console.log(`\n\n--- DANH SÁCH TOUR CỦA ${user.full_name} ---`);
  guideProfile.tours.forEach(t => {
    console.log(`- [${t.status}] ${t.title}`);
    console.log(`  ID: ${t.id}`);
    console.log(`  Giá: ${t.price} | Thời gian: ${t.duration_days} ngày`);
    console.log(`  Danh mục: ${t.tour_categories?.name} | Điểm đến: ${t.destinations?.name}\n`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
