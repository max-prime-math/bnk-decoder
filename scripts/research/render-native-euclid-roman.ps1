param([string]$Output='reports/rea-examview/native-chapter11.pqp.native-jkhH90/euclid-a5-roman-gdi.png')
Add-Type -AssemblyName System.Drawing
Add-Type @"
using System;using System.Runtime.InteropServices;using System.Text;
public class NativeGlyph {
 [DllImport("gdi32.dll")]public static extern IntPtr CreateCompatibleDC(IntPtr h);
 [DllImport("gdi32.dll")]public static extern bool DeleteDC(IntPtr h);
 [DllImport("gdi32.dll")]public static extern IntPtr SelectObject(IntPtr h,IntPtr o);
 [DllImport("gdi32.dll")]public static extern bool DeleteObject(IntPtr o);
 [DllImport("gdi32.dll",CharSet=CharSet.Unicode)]public static extern IntPtr CreateFont(int height,int width,int escape,int orient,int weight,uint italic,uint underline,uint strike,uint charset,uint outp,uint clip,uint quality,uint pitch,string face);
 [DllImport("gdi32.dll",EntryPoint="TextOutA")]public static extern bool TextOutA(IntPtr h,int x,int y,byte[] bytes,int length);
 [DllImport("gdi32.dll",EntryPoint="TextOutW",CharSet=CharSet.Unicode)]public static extern bool TextOutW(IntPtr h,int x,int y,string text,int length);
 [DllImport("gdi32.dll",CharSet=CharSet.Unicode)]public static extern int GetTextFace(IntPtr h,int n,StringBuilder face);
 [DllImport("gdi32.dll")]public static extern int SetBkMode(IntPtr h,int mode);
 [DllImport("gdi32.dll")]public static extern bool PatBlt(IntPtr h,int x,int y,int w,int he,uint op);
}
"@
$bitmap=New-Object Drawing.Bitmap(1000,460)
$hb=$bitmap.GetHbitmap();$dc=[NativeGlyph]::CreateCompatibleDC([IntPtr]::Zero);$oldBitmap=[NativeGlyph]::SelectObject($dc,$hb)
[void][NativeGlyph]::PatBlt($dc,0,0,1000,460,16711778)
$label=[NativeGlyph]::CreateFont(-23,0,0,0,400,0,0,0,0,0,0,0,0,'Arial');$rows=@()
try{
 $y=15
 foreach($charset in 0,2){foreach($mode in 'ANSI-A5','Unicode-00A5','Unicode-F0A5','ANSI-B0'){
 [void][NativeGlyph]::SelectObject($dc,$label);$heading="Euclid Symbol charset $charset / $mode";[void][NativeGlyph]::TextOutW($dc,15,$y,$heading,$heading.Length)
 $font=[NativeGlyph]::CreateFont(-46,0,0,0,400,0,0,0,$charset,0,0,0,18,'Euclid Symbol');$old=[NativeGlyph]::SelectObject($dc,$font);$face=New-Object Text.StringBuilder 128;[void][NativeGlyph]::GetTextFace($dc,128,$face)
 if($mode-eq'ANSI-A5'){[void][NativeGlyph]::TextOutA($dc,510,$y,[byte[]]@(165),1)}elseif($mode-eq'ANSI-B0'){[void][NativeGlyph]::TextOutA($dc,510,$y,[byte[]]@(176),1)}elseif($mode-eq'Unicode-00A5'){[void][NativeGlyph]::TextOutW($dc,510,$y,[string][char]165,1)}else{[void][NativeGlyph]::TextOutW($dc,510,$y,[string][char]61605,1)}
 $rows+=@{charset=$charset;mode=$mode;selectedFace=$face.ToString()};[void][NativeGlyph]::SelectObject($dc,$old);[void][NativeGlyph]::DeleteObject($font);$y+=54
 }}
 [void][NativeGlyph]::SelectObject($dc,$oldBitmap);$rendered=[Drawing.Image]::FromHbitmap($hb);try{$rendered.Save([IO.Path]::GetFullPath($Output),[Drawing.Imaging.ImageFormat]::Png)}finally{$rendered.Dispose()};$rows|ConvertTo-Json|Set-Content ($Output+'.json')
}finally{[void][NativeGlyph]::SelectObject($dc,$oldBitmap);[void][NativeGlyph]::DeleteObject($hb);[void][NativeGlyph]::DeleteObject($label);[void][NativeGlyph]::DeleteDC($dc);$bitmap.Dispose()}


