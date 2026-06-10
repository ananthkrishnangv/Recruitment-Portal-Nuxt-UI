$files = Get-ChildItem -Path app -Recurse -Filter *.tsx
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $newContent = $content -replace '<Button([^>]*?)as=\{Link\}([^>]*?)>', '<Button$1$2>' -replace '<Button([^>]*?)as="a"([^>]*?)>', '<Button$1$2>' -replace '<Button([^>]*?)startContent=', '<Button$1icon=' -replace '<Button([^>]*?)endContent=', '<Button$1icon='
    if ($content -ne $newContent) {
        Set-Content $file.FullName $newContent
        Write-Host "Updated $($file.FullName)"
    }
}
