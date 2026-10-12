[CmdletBinding()]
param([string]$Metafile='reports/rea-examview/native-publisher-dual-gzmjKi/native-publisher-dual-chapter04.pqp.native-g6GkhK/rtf-pictures-xziBhD/24.wmf')
$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
$source=(Resolve-Path -LiteralPath $Metafile).Path
$hash=(Get-FileHash -LiteralPath $source -Algorithm SHA256).Hash.ToLowerInvariant()
if($hash -ne '96ff06df799d19e7c279efb84f3d83e6b1a0df5154d01ce726dd7b2c211962b0'){throw 'This test requires the verified Chapter04 angle metafile'}
$dir=Join-Path (Resolve-Path '.tools').Path ('emf-clip-regression-'+[guid]::NewGuid().ToString('N'))
[void][IO.Directory]::CreateDirectory($dir)
Copy-Item -LiteralPath $source -Destination (Join-Path $dir 'angle.wmf')
$receipt=(& pwsh -NoProfile -File (Join-Path $PSScriptRoot '../rasterize-native-wmf.ps1') -Directory $dir | ConvertFrom-Json)
if($LASTEXITCODE -ne 0){throw 'Rasterization failed'}
if($receipt.renderer -ne 'gdi32.EnumEnhMetaFile.checked' -or $receipt.clippedPixelRecords -ne 20){throw 'Expected checked replay of exactly twenty clipped pixels'}
$bitmap=[Drawing.Bitmap]::FromFile((Join-Path $dir 'angle.png'))
try{
 if($bitmap.Width -ne 193 -or $bitmap.Height -ne 193){throw 'Wrong angle raster dimensions'}
 $ink=0;$rayInk=0;$axisInk=0
 for($y=0;$y -lt 193;$y++){for($x=0;$x -lt 193;$x++){
  $pixel=$bitmap.GetPixel($x,$y)
  if(($pixel.R+$pixel.G+$pixel.B) -lt 700){
   $ink++
   if($x -gt 105 -and $x -lt 188 -and $y -gt 52 -and $y -lt 92){$rayInk++}
   if($x -ge 94 -and $x -le 98 -and $y -gt 110 -and $y -lt 180){$axisInk++}
  }
 }}
 if($ink -lt 500 -or $ink -gt 2000 -or $rayInk -lt 100 -or $axisInk -lt 60){throw "Missing or corrupt drawing: ink=$ink ray=$rayInk axis=$axisInk"}
 if((Get-FileHash -LiteralPath $source -Algorithm SHA256).Hash.ToLowerInvariant() -ne $hash){throw 'Original metafile changed'}
 # A rejected unrelated operation must still fail, rather than silently pass
 # through the clipped-pixel exception. Change one pixel record into an invalid
 # SETMAPMODE in a separate synthetic file, keeping the original untouched.
 $badDir=Join-Path $dir 'rejected-record'
 [void][IO.Directory]::CreateDirectory($badDir)
 $bad=[IO.File]::ReadAllBytes($source)
 for($offset=0;$offset -lt $bad.Length;$offset+=[BitConverter]::ToUInt32($bad,$offset+4)){
  if([BitConverter]::ToUInt32($bad,$offset) -eq 15){
   [Array]::Copy([BitConverter]::GetBytes([uint32]17),0,$bad,$offset,4)
   [Array]::Copy([BitConverter]::GetBytes([uint32]0),0,$bad,$offset+8,4)
   break
  }
 }
 [IO.File]::WriteAllBytes((Join-Path $badDir 'invalid.wmf'),$bad)
 $rejectionOutput=(& pwsh -NoProfile -File (Join-Path $PSScriptRoot '../rasterize-native-wmf.ps1') -Directory $badDir 2>&1 | Out-String)
 if($LASTEXITCODE -eq 0 -or (Test-Path (Join-Path $badDir 'invalid.png')) -or $rejectionOutput -notmatch 'record type 17'){throw 'Unrelated rejected record was not rejected safely'}
 @{status='passed';sourceSha256=$hash;clippedPixelRecords=$receipt.clippedPixelRecords;renderer=$receipt.renderer;inkPixels=$ink;rayPixels=$rayInk;axisPixels=$axisInk;invalidOtherRecordRejected=$true;output=$dir}|ConvertTo-Json
}finally{$bitmap.Dispose()}
