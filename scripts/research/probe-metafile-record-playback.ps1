param([Parameter(Mandatory=$true)][string]$Path)
$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
Add-Type @'
using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
public static class RecordPlaybackProbe {
 [StructLayout(LayoutKind.Sequential)] public struct Rect { public int Left,Top,Right,Bottom; }
 public delegate int Callback(IntPtr dc,IntPtr table,IntPtr record,int handles,IntPtr data);
 [DllImport("gdi32.dll",CharSet=CharSet.Unicode)] public static extern IntPtr GetEnhMetaFile(string path);
 [DllImport("gdi32.dll")] public static extern bool DeleteEnhMetaFile(IntPtr emf);
 [DllImport("gdi32.dll")] public static extern bool EnumEnhMetaFile(IntPtr dc,IntPtr emf,Callback callback,IntPtr data,ref Rect rect);
 [DllImport("gdi32.dll",SetLastError=true)] public static extern bool PlayEnhMetaFileRecord(IntPtr dc,IntPtr table,IntPtr record,int handles);
 public static string[] Inspect(IntPtr dc,IntPtr emf,int width,int height){
  var failed=new List<string>();int ordinal=0;
  Callback callback=(hdc,table,record,handles,data)=>{int type=Marshal.ReadInt32(record);if(!PlayEnhMetaFileRecord(hdc,table,record,handles))failed.Add("record="+ordinal+" type="+type+" error="+Marshal.GetLastWin32Error());ordinal++;return 1;};
  var rect=new Rect{Right=width,Bottom=height};
  if(!EnumEnhMetaFile(dc,emf,callback,IntPtr.Zero,ref rect))throw new Exception("Enumeration failed");
  return failed.ToArray();
 }
}
'@
$pathResolved=(Resolve-Path -LiteralPath $Path).Path
$image=[Drawing.Image]::FromFile($pathResolved)
$bitmap=New-Object Drawing.Bitmap($image.Width,$image.Height)
$graphics=[Drawing.Graphics]::FromImage($bitmap)
$emf=[RecordPlaybackProbe]::GetEnhMetaFile($pathResolved)
try{
 $graphics.Clear([Drawing.Color]::White)
 $dc=$graphics.GetHdc()
 try{[RecordPlaybackProbe]::Inspect($dc,$emf,$bitmap.Width,$bitmap.Height)}finally{$graphics.ReleaseHdc($dc)}
}finally{[void][RecordPlaybackProbe]::DeleteEnhMetaFile($emf);$graphics.Dispose();$bitmap.Dispose();$image.Dispose()}
