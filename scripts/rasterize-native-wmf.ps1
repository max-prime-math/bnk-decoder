[CmdletBinding()]
param([Parameter(Mandatory=$true)][string]$Directory)
$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
$dir=(Resolve-Path -LiteralPath $Directory).Path
$results=@()
foreach($file in Get-ChildItem -LiteralPath $dir -Filter '*.wmf'){
 $png=[IO.Path]::ChangeExtension($file.FullName,'.png')
 if(Test-Path -LiteralPath $png){throw "Refusing to overwrite $png"}
 $image=[Drawing.Image]::FromFile($file.FullName)
 try{
  $bitmap=New-Object Drawing.Bitmap($image.Width,$image.Height)
  try{$graphics=[Drawing.Graphics]::FromImage($bitmap);try{$graphics.Clear([Drawing.Color]::White);$graphics.DrawImage($image,0,0,$image.Width,$image.Height)}finally{$graphics.Dispose()};$bitmap.Save($png,[Drawing.Imaging.ImageFormat]::Png);$results+=@{wmf=$file.FullName;png=$png;width=$bitmap.Width;height=$bitmap.Height}}finally{$bitmap.Dispose()}
 }finally{$image.Dispose()}
}
$results|ConvertTo-Json -Depth 3
