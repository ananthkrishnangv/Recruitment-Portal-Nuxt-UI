$files = Get-ChildItem -Path "app", "components" -Filter "*.tsx" -Recurse

foreach ($f in $files) {
    $content = Get-Content -LiteralPath $f.FullName -Raw
    
    $modified = $false

    if ($content -match 'ListBoxItem') {
        $content = $content -replace 'ListBoxItem', 'SelectItem'
        $modified = $true
    }
    
    if ($content -match 'ListboxItem') {
        $content = $content -replace 'ListboxItem', 'SelectItem'
        $modified = $true
    }

    if ($modified) {
        Set-Content -LiteralPath $f.FullName -Value $content -NoNewline
        Write-Host "Updated $($f.FullName)"
    }
}
