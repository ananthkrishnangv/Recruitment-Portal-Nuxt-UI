$files = @(
  'app\admin\dashboard\page.tsx', 
  'app\admin\settings\page.tsx', 
  'app\applicant\applications\page.tsx', 
  'app\applicant\applications\[appNo]\page.tsx', 
  'app\applicant\apply\page.tsx', 
  'app\applicant\consent\page.tsx', 
  'app\applicant\dashboard\page.tsx', 
  'app\applicant\documents\page.tsx', 
  'app\applicant\profile\page.tsx', 
  'app\auth\login\page.tsx', 
  'app\error.tsx', 
  'app\loading.tsx', 
  'app\not-found.tsx'
)

foreach ($f in $files) {
    if (Test-Path $f) {
        $content = Get-Content $f -Raw
        $newContent = $content -replace '"@heroui/react"', '"@/components/ui/heroui"'
        Set-Content $f -Value $newContent -NoNewline
        Write-Host "Updated $f"
    }
}
