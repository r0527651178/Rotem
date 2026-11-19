# Turns the light background around a plan into a solid colour (default black), so an
# irregular plan blends into the black sales-plans page. Only light pixels connected to the
# image border change; light rooms enclosed by walls stay as they are.
# ASCII-only on purpose: Windows PowerShell 5 reads scripts as ANSI.
param(
  [Parameter(Mandatory)] [string]$In,
  [Parameter(Mandatory)] [string]$Out,
  [int]$Threshold = 232,
  [int]$R = 0, [int]$G = 0, [int]$B = 0
)
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
public static class Flood {
  public static int Fill(Bitmap bmp, int threshold, Color to) {
    int w = bmp.Width, h = bmp.Height;
    var rect = new Rectangle(0, 0, w, h);
    var data = bmp.LockBits(rect, ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
    int stride = data.Stride;
    var px = new byte[stride * h];
    Marshal.Copy(data.Scan0, px, 0, px.Length);
    var seen = new bool[w * h];
    var q = new Queue<int>();
    Func<int, bool> light = i => {
      int o = (i / w) * stride + (i % w) * 4;
      return px[o + 3] < 128 || (px[o] >= threshold && px[o + 1] >= threshold && px[o + 2] >= threshold);
    };
    for (int x = 0; x < w; x++) { q.Enqueue(x); q.Enqueue((h - 1) * w + x); }
    for (int y = 0; y < h; y++) { q.Enqueue(y * w); q.Enqueue(y * w + w - 1); }
    int n = 0;
    while (q.Count > 0) {
      int i = q.Dequeue();
      if (seen[i]) continue;
      seen[i] = true;
      if (!light(i)) continue;
      int o = (i / w) * stride + (i % w) * 4;
      px[o] = to.B; px[o + 1] = to.G; px[o + 2] = to.R; px[o + 3] = 255;
      n++;
      int x = i % w, y = i / w;
      if (x > 0) q.Enqueue(i - 1);
      if (x < w - 1) q.Enqueue(i + 1);
      if (y > 0) q.Enqueue(i - w);
      if (y < h - 1) q.Enqueue(i + w);
    }
    Marshal.Copy(px, 0, data.Scan0, px.Length);
    bmp.UnlockBits(data);
    return n;
  }
}
'@
$src = [System.Drawing.Image]::FromFile($In)
$bmp = New-Object System.Drawing.Bitmap $src.Width, $src.Height, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
# ($gfx, not $g: PowerShell names are case-insensitive, and $G is the green parameter.)
$gfx = [System.Drawing.Graphics]::FromImage($bmp)
$gfx.DrawImage($src, 0, 0, $src.Width, $src.Height)
$gfx.Dispose()
$src.Dispose()
$n = [Flood]::Fill($bmp, $Threshold, [System.Drawing.Color]::FromArgb(255, $R, $G, $B))
$total = $bmp.Width * $bmp.Height
$bmp.Save($Out, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
'{0:N1}% of pixels filled -> {1}' -f (100.0 * $n / $total), $Out
