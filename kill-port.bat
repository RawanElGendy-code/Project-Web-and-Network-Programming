@echo off
echo Killing processes on port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    echo Killing PID: %%a
    taskkill /PID %%a /F
)
echo Done!
pause

