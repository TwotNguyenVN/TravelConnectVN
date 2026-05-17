#!/bin/bash

# ==============================================================================
# HƯỚNG DẪN SỬ DỤNG (macOS/Linux hoặc Git Bash trên Windows):
# 1. Cấp quyền thực thi:  chmod +x setup.sh
# 2. Chạy file script:     ./setup.sh
# ==============================================================================

# Configuration
REQUIRED_NODE_VERSION=24

echo "🚀 Bắt đầu cài đặt dự án TravelConnectVN..."

# Hàm cài đặt Node.js tự động
install_node() {
    echo "🔍 Đang phát hiện hệ điều hành..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "🍎 Phát hiện macOS."
        if ! command -v brew >/dev/null 2>&1; then
            echo "⚠️ Chưa tìm thấy Homebrew. Vui lòng cài đặt Homebrew trước (https://brew.sh/) hoặc cài Node.js thủ công."
            exit 1
        fi
        echo "⏳ Đang tiến hành cài đặt Node.js qua Homebrew..."
        brew install node@$REQUIRED_NODE_VERSION
        brew link --overwrite --force node@$REQUIRED_NODE_VERSION
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
        echo "🪟 Phát hiện Windows (Git Bash)."
        echo "⏳ Đang tiến hành cài đặt Node.js qua winget..."
        winget install OpenJS.NodeJS
        echo "⚠️ LƯU Ý QUAN TRỌNG TRÊN WINDOWS: Việc cài đặt qua winget sẽ yêu cầu bạn KHỞI ĐỘNG LẠI Git Bash để nhận diện lệnh 'node'."
        echo "👉 Script sẽ tạm dừng tại đây. Vui lòng đóng cửa sổ Git Bash này, mở lại và chạy './setup.sh' một lần nữa!"
        exit 0
    else
        echo "❌ Hệ điều hành ($OSTYPE) chưa được hỗ trợ cài đặt tự động. Vui lòng cài Node.js v$REQUIRED_NODE_VERSION+ thủ công."
        exit 1
    fi
}

# Kiểm tra phiên bản Node.js
check_node() {
    if ! command -v node >/dev/null 2>&1; then
        return 1
    fi
    local node_ver=$(node -v | cut -d'v' -f2)
    local major_ver=$(echo $node_ver | cut -d'.' -f1)
    if [ "$major_ver" -ge "$REQUIRED_NODE_VERSION" ]; then
        return 0
    else
        return 2
    fi
}

echo "⚙️  Kiểm tra môi trường..."
check_node
NODE_STATUS=$?

if [ $NODE_STATUS -ne 0 ]; then
    if [ $NODE_STATUS -eq 1 ]; then
        echo "❌ Không tìm thấy Node.js trên máy của bạn."
    elif [ $NODE_STATUS -eq 2 ]; then
        CURRENT_VER=$(node -v)
        echo "❌ Phiên bản Node.js hiện tại ($CURRENT_VER) không tương thích. Yêu cầu v$REQUIRED_NODE_VERSION trở lên."
    fi

    read -p "❓ Bạn có muốn hệ thống hỗ trợ cài đặt/cập nhật Node.js tự động không? (y/n): " confirm
    if [[ "$confirm" == [yY]* ]]; then
        install_node
        
        # Kiểm tra lại sau khi cài đặt (trừ Windows vì đã exit để reset terminal)
        if [[ "$OSTYPE" != "msys" && "$OSTYPE" != "cygwin" && "$OSTYPE" != "win32" ]]; then
            check_node
            if [ $? -ne 0 ]; then
                echo "❌ Cài đặt thất bại hoặc cần khởi động lại terminal. Vui lòng cài đặt thủ công."
                exit 1
            fi
            echo "✅ Đã cài đặt môi trường thành công! Tiếp tục setup dự án..."
        fi
    else
        echo "🛑 Setup bị hủy. Vui lòng cài đặt Node.js phù hợp và thử lại."
        exit 1
    fi
else
    CURRENT_VER=$(node -v)
    echo "✅ Node.js đã được cài đặt (Phiên bản: $CURRENT_VER, phù hợp)."
fi

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
