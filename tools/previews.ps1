# Writes small JPEG previews (for identifying images) of every image in a folder.
# ASCII-only on purpose: Windows PowerShell 5 reads scripts as ANSI.
param([string]$Source, [string]$Out, [int]$Width = 520)

Add-Type -AssemblyName System.Drawing
New-Item -ItemType Directory -Force $Out | Out-Null

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
$params = New-Object System.Drawing.Imaging.EncoderParameters 1
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 80L

$i = 0
Get-ChildItem -LiteralPath $Source -File | Sort-Object Name | ForEach-Object {
  $i++
  $img = [System.Drawing.Image]::FromFile($_.FullName)
  try {
    $h = [int]($img.Height * $Width / $img.Width)
    $bmp = New-Object System.Drawing.Bitmap $Width, $h
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($img, 0, 0, $Width, $h)
    $g.Dispose()
    $name = ('{0:D2}.jpg' -f $i)
    $bmp.Save((Join-Path $Out $name), $codec, $params)
    $bmp.Dispose()
    '{0}`t{1}x{2}`t{3}' -f $name, $img.Width, $img.Height, $_.Name
  } finally {
    $img.Dispose()
  }
}
