import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Accommodations for Sprint 13...');

  // 1. Lấy một số tour hiện có
  const tours = await prisma.tours.findMany({ take: 5 });
  if (tours.length === 0) {
    console.log('Không có tour nào để gắn accommodation. Vui lòng chạy seed tour trước.');
    return;
  }

  // 2. Tạo danh sách khách sạn đối tác
  const hotels = [
    {
      name: 'Khách sạn Mường Thanh Luxury',
      accommodation_type: 'hotel',
      address: '60 Trần Phú, Lộc Thọ',
      province: 'Khánh Hòa',
      image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      website_url: 'https://muongthanh.com',
    },
    {
      name: 'Đà Lạt Wonder Resort',
      accommodation_type: 'resort',
      address: 'Phân khu chức năng VII.2, Hồ Tuyền Lâm',
      province: 'Lâm Đồng',
      image_url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      website_url: 'https://dalatwonderresort.com',
    },
    {
      name: 'InterContinental Danang Sun Peninsula',
      accommodation_type: 'resort',
      address: 'Bán đảo Sơn Trà',
      province: 'Đà Nẵng',
      image_url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      website_url: 'https://danang.intercontinental.com',
    },
    {
      name: 'Hanoi La Siesta Hotel & Spa',
      accommodation_type: 'hotel',
      address: '94 Mã Mây, Hoàn Kiếm',
      province: 'Hà Nội',
      image_url: 'https://images.unsplash.com/photo-1551882547-ff43c63faf76?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      website_url: 'https://lasiestahotels.vn',
    }
  ];

  for (const hotel of hotels) {
    const created = await prisma.partner_accommodations.upsert({
      where: { id: '00000000-0000-0000-0000-' + hotel.name.substring(0, 12).padEnd(12, '0').replace(/\s/g, '0') }, // Dummy deterministic UUID
      update: {},
      create: {
        ...hotel,
        status: 'active'
      }
    });

    // Gắn vào tour (nếu tỉnh khớp)
    const matchingTours = tours.filter(t => t.province === hotel.province);
    for (const tour of matchingTours) {
      await prisma.tour_accommodations.upsert({
        where: {
          tour_id_accommodation_id: {
            tour_id: tour.id,
            accommodation_id: created.id
          }
        },
        update: {},
        create: {
          tour_id: tour.id,
          accommodation_id: created.id,
          notes: 'Khách sạn đối tác ưu đãi cho khách của TravelConnectVN',
          sort_order: 1
        }
      });
      console.log(`Linked ${hotel.name} to tour: ${tour.title}`);
    }
  }

  console.log('Seeding Accommodations DONE!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
