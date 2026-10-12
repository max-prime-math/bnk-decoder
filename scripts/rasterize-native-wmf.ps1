[CmdletBinding()]
param([Parameter(Mandatory=$true)][string]$Directory)
$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
Add-Type @'
using System;
using System.Runtime.InteropServices;
public static class NativeMetafilePlayback {
 [StructLayout(LayoutKind.Sequential)] public struct Rect { public int Left,Top,Right,Bottom; }
 [DllImport("gdi32.dll",SetLastError=true)] public static extern IntPtr SetEnhMetaFileBits(uint length,byte[] bytes);
 [DllImport("gdi32.dll",SetLastError=true)] public static extern bool PlayEnhMetaFile(IntPtr dc,IntPtr emf,ref Rect rect);
 [DllImport("gdi32.dll")] public static extern bool DeleteEnhMetaFile(IntPtr emf);
 public delegate int Callback(IntPtr dc,IntPtr table,IntPtr record,int handles,IntPtr data);
 [DllImport("gdi32.dll")] public static extern bool EnumEnhMetaFile(IntPtr dc,IntPtr emf,Callback callback,IntPtr data,ref Rect rect);
 [DllImport("gdi32.dll",SetLastError=true)] public static extern bool PlayEnhMetaFileRecord(IntPtr dc,IntPtr table,IntPtr record,int handles);
 [DllImport("gdi32.dll")] public static extern bool PtVisible(IntPtr dc,int x,int y);
 [DllImport("gdi32.dll")] public static extern int SaveDC(IntPtr dc);
 [DllImport("gdi32.dll")] public static extern bool RestoreDC(IntPtr dc,int saved);
 public static int PlayChecked(IntPtr dc,IntPtr emf,ref Rect rect){
  int clipped=0;string failure=null;
  Callback callback=(hdc,table,record,handles,data)=>{
   if(!PlayEnhMetaFileRecord(hdc,table,record,handles)){
    int type=Marshal.ReadInt32(record);
    // SetPixelV legitimately reports failure for points outside the clip.
    if(type==15 && !PtVisible(hdc,Marshal.ReadInt32(record,8),Marshal.ReadInt32(record,12)))clipped++;
    else {failure="Rejected visible or unsupported EMF record type "+type;return 0;}
   }
   return 1;
  };
  int saved=SaveDC(dc);
  if(saved==0)throw new Exception("SaveDC failed");
  try{
   bool ok=EnumEnhMetaFile(dc,emf,callback,IntPtr.Zero,ref rect);
   if(!ok || failure!=null)throw new Exception(failure ?? "Checked EMF enumeration failed");
  }finally{RestoreDC(dc,saved);}
  return clipped;
 }
}
'@
$dir=(Resolve-Path -LiteralPath $Directory).Path
$results=@()
foreach($file in Get-ChildItem -LiteralPath $dir -Filter '*.wmf'){
 $png=[IO.Path]::ChangeExtension($file.FullName,'.png')
 if(Test-Path -LiteralPath $png){throw "Refusing to overwrite $png"}
 $image=[Drawing.Image]::FromFile($file.FullName)
 try{
  $bitmap=New-Object Drawing.Bitmap($image.Width,$image.Height)
  try{
   # Raster-only quality override: DEFAULT_QUALITY aliases tiny Arial glyphs into
   # solid boxes on this machine. Preserve the original metafile; change only
   # font quality in the temporary playback copy. Never rewrite font or text.
   $bytes=[IO.File]::ReadAllBytes($file.FullName)
   $qualityOverrides=0
   $clippedPixels=0
   $checkedReplay=$false
   $isEmf=$bytes.Length -ge 88 -and [BitConverter]::ToUInt32($bytes,0) -eq 1 -and [BitConverter]::ToUInt32($bytes,40) -eq 0x464D4520
   if($isEmf){
    $offset=0
    while($offset -lt $bytes.Length){
     if($offset+8 -gt $bytes.Length){throw 'Truncated EMF record header'}
     $type=[BitConverter]::ToUInt32($bytes,$offset);$size=[BitConverter]::ToUInt32($bytes,$offset+4)
     if($size -lt 8 -or $size -gt $bytes.Length-$offset){throw 'Invalid EMF record size'}
     if($type -eq 82){
      if($size -lt 104){throw 'Truncated EMF font record'}
      if($bytes[$offset+38] -eq 0){$bytes[$offset+38]=4;$qualityOverrides++}
     }
     $offset+=$size
    }
   }
   $graphics=[Drawing.Graphics]::FromImage($bitmap)
   try{
    $graphics.Clear([Drawing.Color]::White)
    if(-not $isEmf){$graphics.DrawImage($image,0,0,$image.Width,$image.Height)}else{
     $emf=[NativeMetafilePlayback]::SetEnhMetaFileBits($bytes.Length,$bytes)
     if($emf -eq [IntPtr]::Zero){throw "Native enhanced-metafile loading failed: $($file.FullName)"}
     try{
     $dc=$graphics.GetHdc()
     try{
      $rect=New-Object NativeMetafilePlayback+Rect
      $rect.Right=$bitmap.Width;$rect.Bottom=$bitmap.Height
      $played=[NativeMetafilePlayback]::PlayEnhMetaFile($dc,$emf,[ref]$rect)
     }finally{$graphics.ReleaseHdc($dc)}
     if(-not $played){
      # Repaint cleanly and inspect every native record. Only rejected pixels
      # proven outside the current clip can be harmlessly omitted.
      $graphics.Clear([Drawing.Color]::White)
      $dc=$graphics.GetHdc()
      try{$clippedPixels=[NativeMetafilePlayback]::PlayChecked($dc,$emf,[ref]$rect);$checkedReplay=$true}finally{$graphics.ReleaseHdc($dc)}
     }
     }finally{[void][NativeMetafilePlayback]::DeleteEnhMetaFile($emf)}
    }
   }finally{$graphics.Dispose()}
   $bitmap.Save($png,[Drawing.Imaging.ImageFormat]::Png)
   $results+=@{wmf=$file.FullName;png=$png;width=$bitmap.Width;height=$bitmap.Height;renderer=$(if($checkedReplay){'gdi32.EnumEnhMetaFile.checked'}elseif($isEmf){'gdi32.PlayEnhMetaFile'}else{'System.Drawing.DrawImage'});clippedPixelRecords=$clippedPixels;defaultFontQualityOverrides=$qualityOverrides;sourceSha256=(Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256).Hash.ToLowerInvariant()}
  }finally{$bitmap.Dispose()}
 }finally{$image.Dispose()}
}
$results|ConvertTo-Json -Depth 3
