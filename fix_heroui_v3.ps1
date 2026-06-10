$files = Get-ChildItem -Path "app", "components" -Filter "*.tsx" -Recurse

foreach ($f in $files) {
    $content = Get-Content $f.FullName -Raw
    
    $modified = $false

    if ($content -match '"@heroui/react"') {
        $content = $content -replace '"@heroui/react"', '"@/components/ui/heroui"'
        $modified = $true
    }

    if ($content -match '\bListboxItem\b') {
        $content = $content -replace '\bListboxItem\b', 'ListBoxItem'
        $modified = $true
    }
    
    if ($content -match '\bProgress\b') {
        $content = $content -replace '\bProgress\b', 'ProgressBar'
        $modified = $true
    }

    if ($content -match '\bTextarea\b') {
        $content = $content -replace '\bTextarea\b', 'TextArea'
        $modified = $true
    }

    if ($modified) {
        Set-Content $f.FullName -Value $content -NoNewline
        Write-Host "Updated $($f.FullName)"
    }
}
