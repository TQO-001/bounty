# Bounty App - Complete Setup Script for Prisma 7 on Windows
# Run this in PowerShell from your project directory

Write-Host "Starting Bounty App setup with Prisma 7..." -ForegroundColor Green

# Step 1: Clean up
Write-Host "`n[1/8] Cleaning up old files..." -ForegroundColor Yellow
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force prisma/migrations -ErrorAction SilentlyContinue
Remove-Item -Force *.db -ErrorAction SilentlyContinue
Remove-Item -Force *.db-journal -ErrorAction SilentlyContinue
Write-Host "Cleanup complete!" -ForegroundColor Green

# Step 2: Install latest Prisma
Write-Host "`n[2/8] Installing latest Prisma 7..." -ForegroundColor Yellow
npm install prisma@latest @prisma/client@latest
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to install Prisma!" -ForegroundColor Red
    exit 1
}
Write-Host "Prisma 7 installed!" -ForegroundColor Green

# Step 3: Update schema file
Write-Host "`n[3/8] Updating prisma/schema.prisma..." -ForegroundColor Yellow
$schemaContent = @"
// Prisma 7 Schema File
// Connection configuration is in prisma.config.ts

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
}

model Job {
  id          Int      @id @default(autoincrement())
  company     String
  position    String
  dateApplied String   // Stored as string (YYYY-MM-DD format)
  status      String   // Pending, Interviewing, Offer, Rejected
  notes       String?
  createdAt   DateTime @default(now())
}
"@
New-Item -Path "prisma" -ItemType Directory -Force | Out-Null
$schemaContent | Out-File -FilePath "prisma\schema.prisma" -Encoding UTF8
Write-Host "Schema updated!" -ForegroundColor Green

# Step 4: Create prisma.config.ts
Write-Host "`n[4/8] Creating prisma.config.ts..." -ForegroundColor Yellow
$configContent = @"
import { defineConfig } from '@prisma/client';

export default defineConfig({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'file:./dev.db'
    }
  }
});
"@
$configContent | Out-File -FilePath "prisma.config.ts" -Encoding UTF8
Write-Host "prisma.config.ts created!" -ForegroundColor Green

# Step 5: Create .env file
Write-Host "`n[5/8] Creating .env file..." -ForegroundColor Yellow
if (-not (Test-Path .env)) {
    @"
DATABASE_URL="file:./dev.db"
NODE_ENV="development"
"@ | Out-File -FilePath .env -Encoding UTF8
    Write-Host ".env file created!" -ForegroundColor Green
} else {
    Write-Host ".env file already exists!" -ForegroundColor Cyan
}

# Step 6: Install all dependencies
Write-Host "`n[6/8] Installing all dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to install dependencies!" -ForegroundColor Red
    exit 1
}
Write-Host "Dependencies installed!" -ForegroundColor Green

# Step 7: Generate Prisma Client and create database
Write-Host "`n[7/8] Generating Prisma Client..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to generate Prisma Client!" -ForegroundColor Red
    exit 1
}
Write-Host "Prisma Client generated!" -ForegroundColor Green

Write-Host "`nCreating database..." -ForegroundColor Yellow
npx prisma migrate dev --name init
if ($LASTEXITCODE -ne 0) {
    Write-Host "Migration failed! Check the error above." -ForegroundColor Red
    exit 1
}
Write-Host "Database created!" -ForegroundColor Green

# Step 8: Build the application
Write-Host "`n[8/8] Building the application..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed! Check the error above." -ForegroundColor Red
    exit 1
}
Write-Host "Build successful!" -ForegroundColor Green

# Display next steps
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Prisma 7 Setup Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`nIMPORTANT: Update app/actions.ts import:" -ForegroundColor Yellow
Write-Host "  Change: import { PrismaClient } from '@prisma/client';" -ForegroundColor Red
Write-Host "  To:     import { PrismaClient } from '@prisma/client/extension';" -ForegroundColor Green
Write-Host "`nThen run:" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor Yellow
Write-Host "`nOpen browser to:" -ForegroundColor White
Write-Host "  http://localhost:3000" -ForegroundColor Yellow
Write-Host "`nTo view database:" -ForegroundColor White
Write-Host "  npx prisma studio" -ForegroundColor Yellow
Write-Host "`n========================================`n" -ForegroundColor Cyan

Write-Host "Note: Make sure to update the import in app/actions.ts!" -ForegroundColor Red
