@echo off
echo 🚀 Starting SaaS Project Management Platform...
echo.

echo 📦 Installing dependencies...
call npm run install:all
echo.

echo 🔥 Starting both servers...
npm run dev
