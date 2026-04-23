#./setup.sh
#!/bin/bash

echo "🚀 Bắt đầu cài đặt lại dự án TravelConnectVN..."

# 1. Cài đặt cho Backend
echo "📦 Bước 1: Cài đặt cho Backend..."
cd backend
npm install
echo "💎 Đang tạo Prisma Client..."
npx prisma generate
cd ..

# 2. Cài đặt cho Frontend
echo "📦 Bước 2: Cài đặt cho Frontend..."
cd frontend
npm install
cd ..

echo "✨ Hoàn thành cài đặt!"
echo "--------------------------------------------------"
echo "Để chạy dự án, bạn hãy mở 2 terminal mới và chạy:"
echo "Terminal 1 (Backend): cd backend && npm run start:dev"
echo "Terminal 2 (Frontend): cd frontend && npm run dev"
echo "--------------------------------------------------"
