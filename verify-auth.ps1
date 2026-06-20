#!/usr/bin/env pwsh
# Quick verification script for authentication setup

Write-Host "🔍 Authentication System Verification`n" -ForegroundColor Cyan

# Check if server is running
Write-Host "1️⃣  Checking if server is running on port 5000..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/" -UseBasicParsing -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Server is running" -ForegroundColor Green
    } else {
        Write-Host "❌ Server returned status: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Server is not running. Start it with: npm start" -ForegroundColor Red
    exit
}

# Test signup endpoint
Write-Host "`n2️⃣  Testing POST /api/auth/signup..." -ForegroundColor Yellow
$signupBody = @{
    name = "TestUser"
    email = "test$(Get-Random)@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $signupResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/signup" `
        -Method POST `
        -ContentType "application/json" `
        -Body $signupBody `
        -UseBasicParsing `
        -ErrorAction SilentlyContinue

    if ($signupResponse.StatusCode -eq 201) {
        Write-Host "✅ Signup endpoint working" -ForegroundColor Green
        $signupData = $signupResponse.Content | ConvertFrom-Json
        Write-Host "   User ID: $($signupData.user.id)" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Signup returned status: $($signupResponse.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Signup endpoint error: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
}

# Test login endpoint
Write-Host "`n3️⃣  Testing POST /api/auth/login..." -ForegroundColor Yellow
$loginBody = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginBody `
        -UseBasicParsing `
        -ErrorAction SilentlyContinue

    if ($loginResponse.StatusCode -eq 200) {
        Write-Host "✅ Login endpoint working" -ForegroundColor Green
        $loginData = $loginResponse.Content | ConvertFrom-Json
        if ($loginData.token) {
            Write-Host "   Token generated: $($loginData.token.Substring(0, 20))..." -ForegroundColor Cyan
        }
    } else {
        Write-Host "❌ Login returned status: $($loginResponse.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Login endpoint error (might need existing user): $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
}

# Test protected route
Write-Host "`n4️⃣  Testing protected route /api/products/all..." -ForegroundColor Yellow
try {
    $productsResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/products/all" `
        -Headers @{"Authorization" = "Bearer test_token"} `
        -UseBasicParsing `
        -ErrorAction SilentlyContinue

    if ($productsResponse.StatusCode -eq 401) {
        Write-Host "✅ Protected route requires authentication (correct behavior)" -ForegroundColor Green
    }
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ Protected route requires authentication (correct behavior)" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Unexpected status: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
    }
}

Write-Host "`n✨ Verification complete!`n" -ForegroundColor Green
