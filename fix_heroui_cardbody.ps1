$files = Get-ChildItem -Path "app", "components" -Filter "*.tsx" -Recurse

foreach ($f in $files) {
    $content = Get-Content $f.FullName -Raw
    
    $modified = $false

    if ($content -match '\bCardBody\b') {
        $content = $content -replace '\bCardBody\b', 'CardContent'
        $modified = $true
    }

    if ($modified) {
        Set-Content $f.FullName -Value $content -NoNewline
        Write-Host "Updated $($f.FullName)"
    }
}
