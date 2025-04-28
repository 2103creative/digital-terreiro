# Script PowerShell para converter PNG/JPG para WebP em /public
# Requer cwebp instalado (https://developers.google.com/speed/webp/download)

$imgDir = "../public" | Resolve-Path
$exts = @("*.png", "*.jpg", "*.jpeg")

foreach ($ext in $exts) {
    Get-ChildItem -Path $imgDir -Recurse -Include $ext | ForEach-Object {
        $webp = $_.FullName -replace '\.(png|jpg|jpeg)$', '.webp'
        if (-not (Test-Path $webp)) {
            Write-Host "Convertendo $($_.FullName) para $webp"
            cwebp -q 85 $_.FullName -o $webp
        }
    }
}
