$files = Get-ChildItem -Path app, components -Recurse -Filter *.tsx
foreach ($file in $files) {
    $content = [IO.File]::ReadAllText($file.FullName)
    if ($content -match 'CardBody') {
        $content = $content -replace 'CardBody', 'CardContent'
        [IO.File]::WriteAllText($file.FullName, $content)
    }
}
