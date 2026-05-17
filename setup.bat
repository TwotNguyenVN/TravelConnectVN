@echo off
rem ==============================================================================
rem HƯỚNG DẪN SỬ DỤNG (Chỉ dành cho Windows):
rem 1. Click đúp chuột trực tiếp vào file này từ File Explorer để chạy.
rem 2. Hoặc chạy từ CMD:         setup.bat
rem 3. Hoặc chạy từ PowerShell:  .\setup.bat
rem ==============================================================================

rem Set encoding to UTF-8 to support emoji and Vietnamese characters
chcp 65001 >nul

set REQUIRED_NODE_VERSION=24

echo Bắt đầu cài đặt dự án TravelConnectVN...
echo Kiểm tra môi trường...

rem Kiểm tra lệnh node có tồn tại không
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Không tìm thấy Node.js trên máy của bạn.
    goto ASK_INSTALL
)

rem Lấy phiên bản Node.js chính (ví dụ: v24.1.0 -> 24)
for /f "tokens=1,2 delims=v." %%a in ('node -v 2^>nul') do (
    set NODE_MAJOR=%%a
)

rem So sánh phiên bản
if %NODE_MAJOR% LSS %REQUIRED_NODE_VERSION% (
    echo Phiên bản Node.js hiện tại (v%NODE_MAJOR%) không tương thích. Yêu cầu v%REQUIRED_NODE_VERSION% trở lên.
    goto ASK_INSTALL
) else (
    echo Node.js đã được cài đặt (Phiên bản: v%NODE_MAJOR%, phù hợp).
    goto PROCEED_SETUP
)

:ASK_INSTALL
set /p confirm="Bạn có muốn hệ thống hỗ trợ cài đặt/cập nhật Node.js tự động không? (y/n): "
if /i "%confirm%"=="y" (
    echo Đang tiến hành cài đặt Node.js qua winget...
    winget install OpenJS.NodeJS
    echo LƯU Ý QUAN TRỌNG TRÊN WINDOWS: Việc cài đặt qua winget sẽ yêu cầu bạn KHỞI ĐỘNG LẠI Command Prompt / PowerShell / Git Bash để nhận diện lệnh 'node'.
    echo Script sẽ tạm dừng tại đây. Vui lòng đóng cửa sổ này, mở lại và chạy 'setup.bat' một lần nữa!
    exit /b 0
) else (
    echo Setup bị hủy. Vui lòng cài đặt Node.js phù hợp và thử lại.
    exit /b 1
)

:PROCEED_SETUP
rem 1. Cài đặt cho Backend
echo Bước 1: Cài đặt cho Backend...
cd backend
call npm install
echo Đang tạo Prisma Client...
call npx prisma generate
cd ..

rem 2. Cài đặt cho Frontend
echo Bước 2: Cài đặt cho Frontend...
cd frontend
call npm install
cd ..

echo Hoàn thành cài đặt!
echo --------------------------------------------------
echo Để chạy dự án, bạn hãy mở 2 terminal mới và chạy:
echo Terminal 1 (Backend): cd backend ^&^& npm run start:dev
echo Terminal 2 (Frontend): cd frontend ^&^& npm run dev
echo --------------------------------------------------
