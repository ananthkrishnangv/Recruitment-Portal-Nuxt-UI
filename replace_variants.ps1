$files = Get-ChildItem -Path app, components -Recurse -Filter *.tsx
foreach ($file in $files) {
    $content = [IO.File]::ReadAllText($file.FullName)
    
    # Button and generic variants
    $content = $content -replace 'variant="flat"', 'variant="ghost"'
    $content = $content -replace 'variant="solid"', 'variant="primary"'
    $content = $content -replace 'variant="light"', 'variant="ghost"'
    $content = $content -replace 'variant="bordered"', 'variant="secondary"'
    
    # Colors on buttons usually mapping to variants in v3
    $content = $content -replace 'color="primary"', 'variant="primary"'
    $content = $content -replace 'color="success"', 'variant="primary"'
    $content = $content -replace 'color="danger"', 'variant="danger"'
    $content = $content -replace 'color="warning"', 'variant="primary"'
    $content = $content -replace 'color="secondary"', 'variant="secondary"'
    
    # Fix duplicated variant props if we had color="primary" variant="flat" -> variant="primary" variant="ghost"
    # Actually simpler: just remove any second variant prop
    $content = $content -replace 'variant="\w+"\s+variant="(\w+)"', 'variant="$1"'
    
    # Card radius
    $content = $content -replace 'radius="lg"', ''
    
    # Avatar name
    $content = $content -replace 'name=', 'alt='

    [IO.File]::WriteAllText($file.FullName, $content)
}
