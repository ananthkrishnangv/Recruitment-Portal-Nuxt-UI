$content = [IO.File]::ReadAllText('components/admin/ApplicationsTable.tsx')

# Fix buttons with onPress -> onClick
$content = $content -replace 'onPress=', 'onClick='

# Fix buttons with isIconOnly -> icon={<icon>}
# For <Button ... isIconOnly ... ><Icon /></Button> -> <Button ... icon={<Icon />} />
# Actually, the simplest way to fix the buttons in ApplicationsTable is to just replace them manually or write a robust regex.
# Let's just fix the attributes that TS complained about:
$content = $content -replace 'isIconOnly', ''
$content = $content -replace 'as="a"', ''
$content = $content -replace 'startContent=', 'icon='

[IO.File]::WriteAllText('components/admin/ApplicationsTable.tsx', $content)
