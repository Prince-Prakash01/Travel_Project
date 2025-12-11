# Start both frontend and backend servers
# Run this script from the project root directory

Write-Host "Starting DreamRoute Application..." -ForegroundColor Green
Write-Host ""

# Start backend server in a new window
Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\server'; npm start"

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start frontend server in a new window
Write-Host "Starting Frontend Client..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\client'; npm run dev"

Write-Host ""
Write-Host "✓ Backend server starting on http://localhost:5000" -ForegroundColor Green
Write-Host "✓ Frontend client starting on http://localhost:5173" -ForegroundColor Green
Write-Host ""
Write-Host "Both servers are starting in separate windows." -ForegroundColor Cyan
Write-Host "Check the new windows for server status." -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
