[CmdletBinding()]
param(
 [string]$Metafile='reports/rea-examview/runtime-oracle/area-render-compare/sa-q1-image1.wmf',
 [string]$NativeJpeg='reports/rea-examview/runtime-oracle/area-render-compare/mc-correct-mc001-1.jpg'
)
$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
$source=(Resolve-Path -LiteralPath $Metafile).Path
$reference=(Resolve-Path -LiteralPath $NativeJpeg).Path
$hash=(Get-FileHash -LiteralPath $source -Algorithm SHA256).Hash
if($hash -ne 'D192C5F3C954940D8FF161105916E915F3B8C34A88F41F44BE3DFE0658B19EDB'){throw 'This regression requires the verified Area question 1 metafile fixture'}
$dir=Join-Path (Resolve-Path '.tools').Path ('emf-fidelity-'+[guid]::NewGuid().ToString('N'))
[void][IO.Directory]::CreateDirectory($dir)
Copy-Item -LiteralPath $source -Destination (Join-Path $dir 'source.wmf')
$receipt=(& pwsh -NoProfile -File (Join-Path $PSScriptRoot '../rasterize-native-wmf.ps1') -Directory $dir | ConvertFrom-Json)
if($LASTEXITCODE -ne 0){throw 'Rasterization failed'}
$image=[Drawing.Image]::FromFile($source)
$old=New-Object Drawing.Bitmap($image.Width,$image.Height)
$g=[Drawing.Graphics]::FromImage($old)
try{$g.Clear([Drawing.Color]::White);$g.DrawImage($image,0,0,$image.Width,$image.Height)}finally{$g.Dispose();$image.Dispose()}
$fresh=[Drawing.Bitmap]::FromFile((Join-Path $dir 'source.png'))
$native=[Drawing.Bitmap]::FromFile($reference)
function RegionError($a,$b,$x,$y,$width,$height){
 $errorSum=0.0
 for($iy=$y;$iy -lt $y+$height;$iy++){for($ix=$x;$ix -lt $x+$width;$ix++){
  $p=$a.GetPixel($ix,$iy);$q=$b.GetPixel($ix,$iy)
  $errorSum+=[Math]::Abs(($p.R+$p.G+$p.B)-($q.R+$q.G+$q.B))/3.0
 }}
 return $errorSum/($width*$height)
}
try{
 if($native.Width -ne $fresh.Width -or $native.Height -ne $fresh.Height){throw 'Native reference dimensions differ'}
 $regions=@(@(91,7,18,14),@(176,48,18,14))
 $checks=@()
 foreach($region in $regions){
  $oldError=RegionError $old $native @region
  $newError=RegionError $fresh $native @region
  # The native JPEG and EMF raster differ slightly in baseline/line placement.
  # Compare unregistered pixels conservatively; this is not an identity test.
  if($newError -ge $oldError*0.9){throw "Label regression: improved error $newError versus old $oldError"}
  $checks+=@{region=$region;oldMeanAbsoluteError=$oldError;newMeanAbsoluteError=$newError}
 }
 if((Get-FileHash -LiteralPath $source -Algorithm SHA256).Hash -ne $hash){throw 'Original metafile changed'}
 if($receipt.defaultFontQualityOverrides -ne 4){throw 'Expected four default-quality font records'}
 @{status='passed';sourceSha256=$hash.ToLowerInvariant();renderer=$receipt.renderer;fontQualityOverrides=$receipt.defaultFontQualityOverrides;labelChecks=$checks;output=$dir;pixelIdentityClaimed=$false}|ConvertTo-Json -Depth 6
}finally{$old.Dispose();$fresh.Dispose();$native.Dispose()}
