import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.public_users.findFirst({
    where: { email: 'user.travelconnect@gmail.com' }
  });

  if (!user) {
    console.error('Demo user not found');
    return;
  }

  // Lấy 1 tour bất kỳ
  const tour = await prisma.tours.findFirst();
  if (!tour) {
    console.error('No tour found');
    return;
  }

  // Tạo hoặc cập nhật request thành approved
  const request = await prisma.tour_requests.upsert({
    where: { id: '00000000-0000-0000-0000-testpayment01' },
    update: { status: 'approved' },
    create: {
      id: '00000000-0000-0000-0000-testpayment01',
      user_id: user.id,
      tour_id: tour.id,
      participant_count: 2,
      status: 'approved',
      note: 'Test payment flow'
    }
  });

  console.log('TEST_REQUEST_ID:', request.id);
  console.log('STATUS:', request.status);
}

main().finally(() => prisma.$disconnect());
