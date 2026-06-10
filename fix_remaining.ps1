$files = Get-ChildItem -Path app, components -Recurse -Filter *.tsx
foreach ($file in $files) {
    $content = [IO.File]::ReadAllText($file.FullName)
    
    # Revert CardContent to CardBody
    if ($content -match 'CardContent') {
        $content = $content -replace 'CardContent', 'CardBody'
    }

    # Revert Input variant="secondary" back to "bordered"
    if ($content -match 'variant="secondary"') {
        $content = $content -replace 'variant="secondary"', 'variant="bordered"'
    }

    # Fix ListBoxItem to ListboxItem
    if ($content -match 'ListBoxItem') {
        $content = $content -replace 'ListBoxItem', 'ListboxItem'
    }

    # Fix ProgressBar to Progress
    if ($content -match 'ProgressBar') {
        $content = $content -replace 'ProgressBar', 'Progress'
    }

    [IO.File]::WriteAllText($file.FullName, $content)
}
