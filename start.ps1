# PowerShell script to start the SaaS Project Management Platform
Write-Host "🚀 Starting SaaS Project Management Platform..." -ForegroundColor Cyan
Write-Host ""

Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm run install:all
Write-Host ""

Write-Host "🔥 Starting both servers..." -ForegroundColor Green
npm run dev
