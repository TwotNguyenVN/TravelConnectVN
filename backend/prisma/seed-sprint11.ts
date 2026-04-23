import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();



async function main() {
  console.log('Seed: Sprint 11 Data (Map, Logs, Notifications, Statistics)...');

  // 1. Get Demo IDs
  const users = await prisma.public_users.findMany();
  const demoUser = users.find(u => u.email === 'user.travelconnect@gmail.com') || users[0];
  const demoGuide = users.find(u => u.email === 'guider.travelconnect@gmail.com') || users[1];
  const adminUser = users.find(u => u.email === 'admin.travelconnect@gmail.com') || users[2];

  const tours = await prisma.tours.findMany();
  if (tours.length === 0) {
    console.error('No tours found. Please seed tours first.');
    return;
  }

  // 2. Seed Tour Locations (M07)
  console.log('Seeding Tour Locations...');
  await prisma.tour_locations.deleteMany({}); // Reset
  
  const locationsData: any[] = [];

  for (const tour of tours) {
    // Add 3 locations for each tour
    locationsData.push(
      {
        tour_id: tour.id,
        sequence_no: 1,
        location_name: 'Điểm khởi hành',
        address: tour.province + ' Central Park',
        latitude: 21.0285 + (Math.random() - 0.5) * 0.1,
        longitude: 105.8542 + (Math.random() - 0.5) * 0.1,
        visit_time: '08:00',
        notes: 'Tập trung tại cổng chính'
      },
      {
        tour_id: tour.id,
        sequence_no: 2,
        location_name: 'Điểm tham quan chính',
        address: tour.province + ' Old Quarter',
        latitude: 21.0285 + (Math.random() - 0.5) * 0.1,
        longitude: 105.8542 + (Math.random() - 0.5) * 0.1,
        visit_time: '10:30',
        notes: 'Tham quan và chụp ảnh'
      },
      {
        tour_id: tour.id,
        sequence_no: 3,
        location_name: 'Điểm nghỉ trưa',
        address: tour.province + ' Local Restaurant',
        latitude: 21.0285 + (Math.random() - 0.5) * 0.1,
        longitude: 105.8542 + (Math.random() - 0.5) * 0.1,
        visit_time: '12:30',
        notes: 'Thưởng thức đặc sản địa phương'
      }
    );
  }

  for (const loc of locationsData) {
    await prisma.tour_locations.create({ data: loc });
  }

  // 3. Seed User Activity Logs (M17)
  console.log('Seeding Activity Logs...');
  await prisma.user_activity_logs.deleteMany({
    where: { user_id: { in: [demoUser.id, demoGuide.id] } }
  });

  const activityTypes = [
    'auth.logged_in',
    'profile.updated',
    'tour_request.created',
    'companion_post.created',
    'favorite.tour_added',
    'review.tour_created',
    'report.created'
  ];

  for (let i = 0; i < 15; i++) {
    const type = activityTypes[Math.floor(Math.random() * activityTypes.length)];
    await prisma.user_activity_logs.create({
      data: {
        user_id: demoUser.id,
        activity_type: type,
        entity_type: type.split('.')[0].toUpperCase(),
        entity_id: tours[0].id,
        metadata: { message: `Thực hiện hành động ${type} vào lúc ${new Date().toLocaleTimeString()}` },
        created_at: new Date(Date.now() - i * 3600000 * 4) // Spaced out
      }
    });
  }

  // 4. Seed Notifications (M19)
  console.log('Seeding Notifications...');
  await prisma.notifications.deleteMany({
    where: { user_id: { in: [demoUser.id, demoGuide.id] } }
  });

  const notifTypes = ['system', 'tour_request', 'companion_request', 'report', 'verification'];
  for (let i = 0; i < 12; i++) {
    const type = notifTypes[Math.floor(Math.random() * notifTypes.length)];
    await prisma.notifications.create({
      data: {
        user_id: demoUser.id,
        notification_type: type,
        title: `Thông báo ${type} quan trọng`,
        content: `Đây là nội dung chi tiết của thông báo loại ${type}. Vui lòng kiểm tra lại.`,
        is_read: i > 5,
        created_at: new Date(Date.now() - i * 3600000 * 2)
      }
    });
  }

  // 5. Seed Extra Data for Dashboard (M46)
  console.log('Seeding Dashboard Data...');
  
  // Add some fake payments
  for (let i = 0; i < 10; i++) {
    await prisma.payment_transactions.create({
      data: {
        user_id: demoUser.id,
        amount: 500000 + Math.random() * 2000000,
        currency_code: 'VND',
        status: 'paid',
        payment_method: 'VNPay',
        transaction_code: 'TRANS' + Date.now() + i,
        paid_at: new Date(Date.now() - Math.random() * 7 * 86400000)
      } as any
    });
  }

  // Add some fake reports
  for (let i = 0; i < 5; i++) {
    await prisma.reports.create({
      data: {
        reporter_id: demoUser.id,
        target_type: 'TOUR',
        target_id: tours[0].id,
        reason: 'Nội dung không phù hợp',
        status: i % 2 === 0 ? 'open' : 'processed',
        priority: 'medium'
      } as any
    });
  }

  console.log('Seed: Sprint 11 Data completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
