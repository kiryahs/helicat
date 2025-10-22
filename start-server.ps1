# PowerShell script to start local server
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   HeliCat Development Server" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting server on port 3000..." -ForegroundColor Yellow
Write-Host "Opening browser at: http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is available
if (Get-Command npm -ErrorAction SilentlyContinue) {
    Start-Sleep -Seconds 2
    Start-Process "http://localhost:3000"
    npm run dev
}
else {
    Write-Host "ERROR: Node.js/npm not found!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
}