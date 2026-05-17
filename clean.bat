@echo off
rem ==============================================================================
rem HƯỚNG DẪN SỬ DỤNG (Chỉ dành cho Windows):
rem 1. Click đúp chuột trực tiếp vào file này từ File Explorer để chạy.
rem 2. Hoặc chạy từ CMD:         clean.bat [--all]
rem 3. Hoặc chạy từ PowerShell:  .\clean.bat [--all]
rem ==============================================================================

rem Set encoding to UTF-8 to support emoji and Vietnamese characters
chcp 65001 >nul

echo Bắt đầu dọn dẹp dự án TravelConnectVN...

rem 1. Xóa các thư mục build
echo Đang xóa các thư mục dist...
if exist backend\dist (
    rmdir /s /q backend\dist
)
if exist frontend\dist (
    rmdir /s /q frontend\dist
)

rem 2. Xóa các file log
echo Đang xóa các file log...
del /s /q /f *.log >nul 2>nul
if exist backend\logs (
    rmdir /s /q backend\logs
)
if exist frontend\logs (
    rmdir /s /q frontend\logs
)

rem 3. Xóa các file tạm của OS (ví dụ .DS_Store nếu có)
echo Đang xóa các file .DS_Store...
del /s /q /f .DS_Store >nul 2>nul

rem 4. Gợi ý xóa node_modules (chỉ chạy nếu người dùng muốn)
if "%~1"=="--all" (
    echo Đang xóa node_modules (bạn sẽ cần chạy npm install lại)...
    if exist backend\node_modules (
        rmdir /s /q backend\node_modules
    )
    if exist frontend\node_modules (
        rmdir /s /q frontend\node_modules
    )
    echo Đã xóa toàn bộ node_modules.
)

echo Hoàn thành dọn dẹp! Dự án của bạn đã nhẹ hơn rồi.
