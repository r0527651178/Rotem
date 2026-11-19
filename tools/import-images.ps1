# Copies source images into the site folders as web-ready JPEGs.
# The originals are not changed. Each image is scaled so its longest side is at most -MaxSide px.
# ASCII-only on purpose: Windows PowerShell 5 reads scripts as ANSI. Hebrew names live in the JSON map.
param(
  [Parameter(Mandatory)] [string]$Source,
  [Parameter(Mandatory)] [string]$Map,
  [Parameter(Mandatory)] [string]$Dest,
  [string]$FileName = '1.jpg',
  [int]$MaxSide = 2000,
  [long]$Quality = 80,
  # Colour behind transparent PNG areas: a name or '#rrggbb'. Sales plans sit on a black page,
  # so use Black there; brochures sit on the cream page (#fffdf4).
  [string]$Background = 'White'
)

Add-Type -AssemblyName System.Drawing
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
$params = New-Object System.Drawing.Imaging.EncoderParameters 1
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), $Quality

$mapping = Get-Content -LiteralPath $Map -Raw -Encoding UTF8 | ConvertFrom-Json
$ok = 0; $missing = @()

foreach ($prop in $mapping.PSObject.Properties) {
  $src = Join-Path $Source $prop.Name
  if (-not (Test-Path -LiteralPath $src)) { $missing += $prop.Name; continue }

  $folder = Join-Path $Dest $prop.Value
  New-Item -ItemType Directory -Force $folder | Out-Null
  $target = Join-Path $folder $FileName

  $img = [System.Drawing.Image]::FromFile($src)
  try {
    $scale = [Math]::Min(1.0, $MaxSide / [Math]::Max($img.Width, $img.Height))
    $w = [int][Math]::Round($img.Width * $scale)
    $h = [int][Math]::Round($img.Height * $scale)
    $bmp = New-Object System.Drawing.Bitmap $w, $h
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    # Fill transparent PNG areas with -Background (JPEG has no transparency).
    $g.Clear([System.Drawing.ColorTranslator]::FromHtml($Background))
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($img, 0, 0, $w, $h)
    $g.Dispose()
    $bmp.Save($target, $codec, $params)
    $bmp.Dispose()
    $ok++
    '{0,-20} {1,5}x{2,-5} {3,6:N0} KB' -f $prop.Value, $w, $h, ((Get-Item -LiteralPath $target).Length / 1KB)
  } finally {
    $img.Dispose()
  }
}

"done: $ok"
if ($missing.Count) { "missing source files: $($missing.Count)" }
