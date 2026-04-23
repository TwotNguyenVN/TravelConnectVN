import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:Twot2k5TravelConnectVN.%2A%23@db.zkeymmxuncvlrlezrbye.supabase.co:5432/postgres";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seed: Diverse Tour Requests...');

  // Get all users and tours
  const users = await prisma.public_users.findMany();
  const tours = await prisma.tours.findMany({
    include: {
      guide_profiles: true
    }
  });

  if (users.length < 3 || tours.length < 2) {
    console.error('Need at least 3 users and 2 tours to seed requests.');
    return;
  }

  // Clear existing data to avoid unique and foreign key constraint issues
  await prisma.payment_transactions.deleteMany({});
  await prisma.tour_reviews.deleteMany({});
  await prisma.tour_requests.deleteMany({});
  console.log('Cleared existing tour requests and dependent data.');

  // Find a user who is not a guide for some tours
  const commonUser = users.find(u => u.email === 'user@example.com') || users[0];
  const secondUser = users.find(u => u.email === 'support@example.com') || users[1];
  
  const tour1 = tours[0];
  const tour2 = tours[1];

  const requestData = [
    {
      tour_id: tour1.id,
      user_id: commonUser.id,
      participant_count: 2,
      note: 'Chúng tôi muốn đi tham quan bảo tàng lâu hơn một chút.',
      status: 'pending',
      requested_at: new Date(Date.now() - 86400000 * 2),
    },
    {
      tour_id: tour1.id,
      user_id: secondUser.id,
      participant_count: 1,
      note: 'Tôi đi một mình, hy vọng được ghép đoàn.',
      status: 'approved',
      response_note: 'Chào bạn, đoàn hiện tại đã có 5 người, rất vui được đón bạn.',
      processed_at: new Date(Date.now() - 86400000),
      processed_by_user_id: tour1.guide_profiles.user_id,
      requested_at: new Date(Date.now() - 86400000 * 3),
    },
    {
      tour_id: tour2.id,
      user_id: commonUser.id,
      participant_count: 4,
      note: 'Gia đình tôi có người già.',
      status: 'rejected',
      response_note: 'Xin lỗi bạn, tour này leo núi khá nhiều, không phù hợp với người cao tuổi.',
      processed_at: new Date(Date.now() - 3600000),
      processed_by_user_id: tour2.guide_profiles.user_id,
      requested_at: new Date(Date.now() - 7200000),
    },
    {
      tour_id: tour2.id,
      user_id: secondUser.id,
      participant_count: 2,
      note: 'Hủy vì có việc đột xuất.',
      status: 'cancelled_by_user',
      cancelled_at: new Date(Date.now() - 1800000),
      requested_at: new Date(Date.now() - 3600000 * 5),
    }
  ];

  for (const data of requestData) {
    await prisma.tour_requests.create({
      data: data as any
    });
    console.log(`Created request: User ${data.user_id} -> Tour ${data.tour_id} (${data.status})`);
  }

  // Seed some notifications
  const notificationData = [
    {
      user_id: tour1.guide_profiles.user_id,
      notification_type: 'tour_request',
      title: 'Yêu cầu tham gia tour mới',
      content: `${commonUser.full_name || 'Khách'} đã gửi yêu cầu tham gia tour "${tour1.title}"`,
      entity_type: 'TOUR_REQUEST',
      is_read: false
    },
    {
      user_id: commonUser.id,
      notification_type: 'tour_request',
      title: 'Yêu cầu tham gia tour bị từ chối',
      content: `Yêu cầu tham gia tour "${tour2.title}" của bạn đã bị từ chối.`,
      entity_type: 'TOUR_REQUEST',
      is_read: false
    }
  ];

  for (const notif of notificationData) {
    await prisma.notifications.create({
      data: notif as any
    });
  }

  console.log('Seed: Diverse Tour Requests completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
