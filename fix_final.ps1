$files = Get-ChildItem -Path app, components -Recurse -Filter *.tsx
foreach ($file in $files) {
    $content = [IO.File]::ReadAllText($file.FullName)
    $modified = $false

    # Fix Button imports
    if ($content -match 'import\s+\{.*?\bButton\b.*?\}\s+from\s+"@heroui/react"') {
        # Only if we're not inside components/ui/button.tsx itself
        if ($file.FullName -notmatch 'components\\ui\\button\.tsx') {
            # Replace import { ..., Button, ... } from "@heroui/react" 
            # with import { Button } from "@/components/ui/button";
            # We can just remove Button from @heroui/react and add the new import.
            $content = $content -replace '\bButton,\s*', ''
            $content = $content -replace ',\s*Button\b', ''
            $content = $content -replace '\bButton\b\s*\} from "@heroui/react"', '} from "@heroui/react"'
            $content = $content -replace 'import \{\s*\}\s*from "@heroui/react";?\s*', ''
            $content = "import { Button } from `"@/components/ui/button`";`n" + $content
            $modified = $true
        }
    }

    # Remove Checkbox variant
    if ($content -match 'Checkbox[^>]+variant=') {
        $content = $content -replace '(<Checkbox[^>]+)variant="[^"]*"', '$1'
        $modified = $true
    }

    # Fix alt back to name for native select
    if ($content -match '<select[^>]*alt=') {
        $content = $content -replace '(<select[^>]*?)alt=', '$1name='
        $modified = $true
    }

    if ($modified) {
        [IO.File]::WriteAllText($file.FullName, $content)
    }
}
