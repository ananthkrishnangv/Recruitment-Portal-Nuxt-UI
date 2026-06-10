$files = Get-ChildItem -Path app, components -Recurse -Filter *.tsx
foreach ($file in $files) {
    $content = [IO.File]::ReadAllText($file.FullName)
    if ($content -match 'shadow="') {
        $content = $content -replace 'shadow="sm"', ''
        $content = $content -replace 'shadow="none"', ''
        $content = $content -replace 'shadow="md"', ''
        $content = $content -replace 'shadow="lg"', ''
        [IO.File]::WriteAllText($file.FullName, $content)
    }
}
