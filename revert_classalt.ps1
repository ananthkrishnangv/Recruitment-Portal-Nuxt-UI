$files = Get-ChildItem -Path app, components -Recurse -Filter *.tsx
foreach ($file in $files) {
    $content = [IO.File]::ReadAllText($file.FullName)
    if ($content -match 'classalt') {
        $content = $content -replace 'classalt', 'className'
        [IO.File]::WriteAllText($file.FullName, $content)
    }
}
