[CmdletBinding()]
param([Parameter(Mandatory=$true)][string]$RequestsPath,[Parameter(Mandatory=$true)][string]$OutputPath)
$ErrorActionPreference='Stop'
$output=[IO.Path]::GetFullPath($OutputPath)
if(Test-Path -LiteralPath $output){throw "Refusing to overwrite $output"}
$inputPath=(Resolve-Path -LiteralPath $RequestsPath).Path
$input=Get-Content -LiteralPath $inputPath -Raw|ConvertFrom-Json
$requests=if($input.PSObject.Properties.Name-contains'requests'){@($input.requests)}else{@($input)}
Add-Type -AssemblyName System.Drawing
Add-Type @"
using System;using System.Text;using System.Runtime.InteropServices;
public class EVFontSelectionProbe {
 [DllImport("gdi32.dll")]public static extern IntPtr CreateCompatibleDC(IntPtr h);
 [DllImport("gdi32.dll")]public static extern bool DeleteDC(IntPtr h);
 [DllImport("gdi32.dll")]public static extern IntPtr SelectObject(IntPtr h,IntPtr o);
 [DllImport("gdi32.dll")]public static extern bool DeleteObject(IntPtr o);
 [DllImport("gdi32.dll",CharSet=CharSet.Unicode)]public static extern IntPtr CreateFont(int height,int width,int escape,int orient,int weight,uint italic,uint underline,uint strike,uint charset,uint outp,uint clip,uint quality,uint pitch,string face);
 [DllImport("gdi32.dll",CharSet=CharSet.Unicode)]public static extern int GetTextFace(IntPtr h,int n,StringBuilder face);
}
"@
$installed=New-Object Drawing.Text.InstalledFontCollection
try{$fontNames=@($installed.Families|ForEach-Object {$_.Name})}finally{$installed.Dispose()}
$dc=[EVFontSelectionProbe]::CreateCompatibleDC([IntPtr]::Zero)
if($dc-eq[IntPtr]::Zero){throw 'CreateCompatibleDC failed'}
$results=@()
try{
 foreach($request in $requests){
  $name=[string]$request.name;$charset=[int]$request.charset;$pitch=[int]$request.pitchAndFamily;$weight=[int]$request.weight;$size=[double]$request.size
  if(!$name -or $name.Length-gt31 -or $charset-lt0 -or $charset-gt255 -or $pitch-lt0 -or $pitch-gt255 -or $weight-lt0 -or $weight-gt1000 -or $size-le0 -or $size-gt200){throw "Invalid font request: $($request|ConvertTo-Json -Compress)"}
  $height=-[int][Math]::Round($size*96/72)
  $font=[EVFontSelectionProbe]::CreateFont($height,0,0,0,$weight,0,0,0,$charset,0,0,0,$pitch,$name)
  if($font-eq[IntPtr]::Zero){throw "CreateFont failed for $name"}
  $previous=[EVFontSelectionProbe]::SelectObject($dc,$font)
  try{
   $face=New-Object Text.StringBuilder 256
   if([EVFontSelectionProbe]::GetTextFace($dc,256,$face)-le0){throw "GetTextFace failed for $name"}
   $selected=$face.ToString();$substituted=![string]::Equals($name,$selected,[StringComparison]::OrdinalIgnoreCase)
   $present=@($fontNames|Where-Object {[string]::Equals($_,$name,[StringComparison]::OrdinalIgnoreCase)}).Count-gt0
   $results+=[ordered]@{requested=$name;requestedFace=$name;name=$name;selected=$selected;selectedFace=$selected;missing=!$present;substitution=$substituted;substituted=$substituted;fontSubstituted=$substituted;requestedFamilyEnumerated=$present;charset=$charset;pitchAndFamily=$pitch;weight=$weight;size=$size;heightPixels=$height;dpi=96;request=$request;authority='controlled-replay';observation='Windows GDI CreateFontW/GetTextFaceW with supplied source font parameters';limitations=@('missing means no exact requested family name in this caller process InstalledFontCollection; aliases and application-private fonts remain unknown','Font selection does not establish the missing original font glyph meanings or the exact ExamView drawing pipeline')}
  }finally{[void][EVFontSelectionProbe]::SelectObject($dc,$previous);[void][EVFontSelectionProbe]::DeleteObject($font)}
 }
}finally{[void][EVFontSelectionProbe]::DeleteDC($dc)}
[void][IO.Directory]::CreateDirectory([IO.Path]::GetDirectoryName($output))
$json=ConvertTo-Json -InputObject @($results) -Depth 8
$stream=[IO.File]::Open($output,[IO.FileMode]::CreateNew,[IO.FileAccess]::Write)
try{$bytes=[Text.Encoding]::UTF8.GetBytes($json);$stream.Write($bytes,0,$bytes.Length)}finally{$stream.Dispose()}
Write-Output $json
