# Adds the new companion images as extra views (2.jpg, 3.jpg ...) of existing projects.
# Each image is scaled to at most 2000 px on its longest side and saved as JPEG. Originals are untouched.
# Files are appended after the views a project already has. Run once per batch of new images.
# Save as UTF-8 with BOM: Hebrew folder names are written below.
param(
  [string]$SourceRoot = 'D:\ROTEM\תמונות נלוות לחלק מההדמיות חדש',
  [string]$Images = (Join-Path $PSScriptRoot '..\public\images'),
  [int]$MaxSide = 2000,
  [long]$Quality = 80
)
Add-Type -AssemblyName System.Drawing
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
$params = New-Object System.Drawing.Imaging.EncoderParameters 1
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), $Quality

# source folder | target project folder (under public/images) | files in view order
$plan = @(
  @('כנפי נשרים פינת נאג_רה', 'visualization/exterior/kanfei-nesharim', @('כנפי נשרים נספח.jpg', 'נג_ארה נספח.jpg')),
  @('לבוש מרדכי  3', 'conservation/levush-mordechai', @('לבוש מרדכי.jpg')),
  @('מאפו 4 ירושלים', 'visualization/exterior/mapu-renewal', @('מאפו יום.jpg')),
  @('מיכלין 3 בית וגן', 'visualization/exterior/michlin', @('מבט מעוזיאל.jpg')),
  @('מרכז חסידי סטריקוב רח_ דוד', 'visualization/exterior/strikov-center', @('נלווה יום.jpg', 'תקריב.jpg')),
  @('מרכז מסחרי בעימנואל', 'visualization/exterior/emmanuel-center', @('22.jpg')),
  @('משמר הגבול 7', 'visualization/exterior/mishmar-hagvul-7', @('משמר הגבול 7 נלווה.jpg')),
  @('נורדאו 36', 'visualization/exterior/nordau-36', @('נורדאו 36 A.jpg')),
  @('נחלת אחים - שד_ בן צבי', 'visualization/exterior/ben-zvi', @('צידי נלווה 2.jpg', 'מבט ציפור נלווה 3.jpg', 'מבט מהמרפסת נלווה 4.jpg', 'בן צבי נוף מהברכה נלווה 5.jpg', 'לילה נלווה.jpg')),
  @('ניסן בק 26', 'conservation/nissan-bek', @('נלווה מלמעלה.jpg')),
  @('עזרת נשים סטריקוב', 'synagogues/interior/strikov-ezrat-nashim', @('בית מדרש 2.jpg', 'בית מדרש וגלריה.jpg', 'גלריה.jpg', 'היכל התורה 4.jpg', 'מקווה.jpg')),
  @('צג בנות 28 ראשון לציון', 'visualization/exterior/tzag-banot-28', @('צג בנות 28 ראשון לציון B.jpg')),
  @('קאסוטו 11', 'visualization/exterior/casuto-11', @('קאסוטו נלווה 1.jpg', 'קאסוטו נלוה 2.jpg')),
  @('קרל נטר 22', 'visualization/exterior/kral-neter', @('נלווה 2.jpg')),
  @('רח ירמיהו 52', 'visualization/exterior/yirmiyahu-52', @('נלווה אחורי.jpg')),
  @('רח_ אגרון', 'visualization/exterior/agron', @('מבואה.jpg', 'מבואה בתקריב - גדול.jpg')),
  @('רח_ החים 9 ירושלים', 'visualization/exterior/hachaim', @('לילה סופי קטן.jpg')),
  @('רח_ חירם 6-8', 'conservation/hiram', @('לילה.jpg')),
  @('רח_ פרידמן 9', 'conservation/friedman', @('פרידמן נלווה.jpg')),
  @('רחר מיוחס', 'conservation/meyuchas', @('אחורי.jpg')),
  @('שיח סוד ברחוב זרצקי', 'visualization/exterior/shiach-sod-zarzaki', @('אחורי.jpg', 'שיח סוד.png')),
  @('שכונת במרחב בישוב רחלים', 'visualization/exterior/two-family', @('במרחב נלווה.jpg', 'שתילה נלווה.JPG'))
)

foreach ($p in $plan) {
  $dir = Join-Path $Images $p[1]
  New-Item -ItemType Directory -Force $dir | Out-Null
  $n = @(Get-ChildItem -LiteralPath $dir -Filter '*.jpg' -File).Count
  foreach ($f in $p[2]) {
    $src = Join-Path (Join-Path $SourceRoot $p[0]) $f
    if (-not (Test-Path -LiteralPath $src)) { Write-Host "MISSING: $($p[0])/$f"; continue }
    $n++
    $target = Join-Path $dir "$n.jpg"
    $img = [System.Drawing.Image]::FromFile($src)
    try {
      $scale = [Math]::Min(1.0, $MaxSide / [Math]::Max($img.Width, $img.Height))
      $w = [int][Math]::Round($img.Width * $scale); $h = [int][Math]::Round($img.Height * $scale)
      $bmp = New-Object System.Drawing.Bitmap $w, $h
      $g = [System.Drawing.Graphics]::FromImage($bmp)
      $g.Clear([System.Drawing.Color]::White)
      $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
      $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
      $g.DrawImage($img, 0, 0, $w, $h); $g.Dispose()
      $bmp.Save($target, $codec, $params); $bmp.Dispose()
    } finally { $img.Dispose() }
    '{0,-45} {1,2}.jpg {2,5}x{3,-5} {4,5:N0} KB' -f $p[1], $n, $w, $h, ((Get-Item -LiteralPath $target).Length / 1KB)
  }
  # Final view count, used to update content.json.
  '@@VIEWS {0} {1}' -f ($p[1].Split('/')[-1]), $n
}
