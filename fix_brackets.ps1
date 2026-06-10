$paths = @(
    "app\applicant\applications\[appNo]\page.tsx",
    "app\applicant\apply\[postCode]\page.tsx",
    "app\jobs\[postCode]\page.tsx"
)

foreach ($p in $paths) {
    if (Test-Path -LiteralPath $p) {
        $c = Get-Content -LiteralPath $p -Raw
        if ($c -match '\bCardBody\b') {
            $c = $c -replace '\bCardBody\b', 'CardContent'
            Set-Content -LiteralPath $p -Value $c -NoNewline
            Write-Host "Updated $p"
        }
    }
}
