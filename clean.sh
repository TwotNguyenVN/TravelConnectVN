#!/bin/bash

# ==============================================================================
# HƯỚNG DẪN SỬ DỤNG (macOS/Linux hoặc Git Bash trên Windows):
# 1. Cấp quyền thực thi:  chmod +x clean.sh
# 2. Chạy file script:     ./clean.sh
# ==============================================================================

echo "Bắt đầu dọn dẹp dự án TravelConnectVN..."

# 1. Xóa các thư mục build
echo "Đang xóa các thư mục dist..."
rm -rf backend/dist
rm -rf frontend/dist

# 2. Xóa các file log
echo "Đang xóa các file log..."
find . -name "*.log" -type f -delete
rm -rf backend/logs
rm -rf frontend/logs

# 3. Xóa các file tạm của OS
echo "Đang xóa các file .DS_Store..."
find . -name ".DS_Store" -type f -delete

# 4. Gợi ý xóa node_modules (chỉ chạy nếu người dùng muốn)
if [ "$1" == "--all" ]; then
    echo "Đang xóa node_modules (bạn sẽ cần chạy npm install lại)..."
    rm -rf backend/node_modules
    rm -rf frontend/node_modules
    echo "Đã xóa toàn bộ node_modules."
fi

echo "Hoàn thành dọn dẹp! Dự án của bạn đã nhẹ hơn rồi."
