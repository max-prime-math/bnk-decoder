[CmdletBinding()]
param([Parameter(Mandatory=$true)][string]$Face,[Parameter(Mandatory=$true)][int]$CodePoint,[Parameter(Mandatory=$true)][string]$Output,[int]$Charset=2,[int]$PitchFamily=18,[double]$SizePoints=11,[int]$Weight=400,[int]$ItalicFlag=0,[int]$UnderlineFlag=0)
$ErrorActionPreference='Stop'
if($CodePoint-lt0 -or $CodePoint-gt65535 -or ($CodePoint-ge55296 -and $CodePoint-le57343)){throw 'CodePoint must be one BMP nonsurrogate character'}
if($Charset-lt0 -or $Charset-gt255 -or $PitchFamily-lt0 -or $PitchFamily-gt255 -or $SizePoints-le0 -or $SizePoints-gt200 -or $Weight-lt0 -or $Weight-gt1000 -or $ItalicFlag-notin0,1 -or $UnderlineFlag-notin0,1){throw 'Invalid font parameters'}
$out=[IO.Path]::GetFullPath($Output);if((Test-Path -LiteralPath $out)-or(Test-Path -LiteralPath ($out+'.json'))){throw 'Refusing to overwrite glyph output'}
[void][IO.Directory]::CreateDirectory([IO.Path]::GetDirectoryName($out))
Add-Type -AssemblyName System.Drawing
Add-Type @"
using System;using System.Runtime.InteropServices;using System.Text;
public class EVNativeFontGlyph {
 [StructLayout(LayoutKind.Sequential)]public struct Size{public int Width;public int Height;}
 [StructLayout(LayoutKind.Sequential)]public struct TextMetric{public int Height,Ascent,Descent,InternalLeading,ExternalLeading,AveCharWidth,MaxCharWidth,Weight,Overhang,DigitizedAspectX,DigitizedAspectY; public ushort FirstChar,LastChar,DefaultChar,BreakChar; public byte Italic,Underlined,StruckOut,PitchAndFamily,CharSet;}
 [DllImport("gdi32.dll",EntryPoint="GetTextMetricsW")]public static extern bool GetTextMetrics(IntPtr h,out TextMetric metric);
 [DllImport("gdi32.dll")]public static extern IntPtr CreateCompatibleDC(IntPtr h);
 [DllImport("gdi32.dll")]public static extern bool DeleteDC(IntPtr h);
 [DllImport("gdi32.dll")]public static extern IntPtr SelectObject(IntPtr h,IntPtr o);
 [DllImport("gdi32.dll")]public static extern bool DeleteObject(IntPtr o);
 [DllImport("gdi32.dll",CharSet=CharSet.Unicode)]public static extern IntPtr CreateFont(int height,int width,int escape,int orient,int weight,uint italic,uint underline,uint strike,uint charset,uint outp,uint clip,uint quality,uint pitch,string face);
 [DllImport("gdi32.dll",EntryPoint="TextOutW",CharSet=CharSet.Unicode)]public static extern bool TextOut(IntPtr h,int x,int y,string text,int length);
 [DllImport("gdi32.dll",EntryPoint="GetTextExtentPoint32W",CharSet=CharSet.Unicode)]public static extern bool TextExtent(IntPtr h,string text,int length,out Size size);
 [DllImport("gdi32.dll",CharSet=CharSet.Unicode)]public static extern int GetTextFace(IntPtr h,int n,StringBuilder face);
 [DllImport("gdi32.dll")]public static extern bool PatBlt(IntPtr h,int x,int y,int w,int he,uint op);
}
"@
$dc=[EVNativeFontGlyph]::CreateCompatibleDC([IntPtr]::Zero)
$font=[EVNativeFontGlyph]::CreateFont(-[int][Math]::Round($SizePoints*96/72),0,0,0,$Weight,$ItalicFlag,$UnderlineFlag,0,$Charset,0,0,0,$PitchFamily,$Face)
if($font-eq[IntPtr]::Zero){throw 'CreateFont failed'}
$oldFont=[EVNativeFontGlyph]::SelectObject($dc,$font)
try{
 $actual=New-Object Text.StringBuilder 256;[void][EVNativeFontGlyph]::GetTextFace($dc,256,$actual)
 $metrics=New-Object EVNativeFontGlyph+TextMetric;if(![EVNativeFontGlyph]::GetTextMetrics($dc,[ref]$metrics)){throw 'GetTextMetrics failed'}
 $text=[string][char]$CodePoint;$extent=New-Object EVNativeFontGlyph+Size
 if(![EVNativeFontGlyph]::TextExtent($dc,$text,1,[ref]$extent)){throw 'GetTextExtentPoint32 failed'}
 $pad=2;$width=[Math]::Max(1,$extent.Width)+2*$pad;$height=[Math]::Max(1,$extent.Height)+2*$pad
 $bitmap=New-Object Drawing.Bitmap($width,$height);$hb=$bitmap.GetHbitmap();$oldBitmap=[EVNativeFontGlyph]::SelectObject($dc,$hb)
 try{[void][EVNativeFontGlyph]::PatBlt($dc,0,0,$width,$height,16711778);if(![EVNativeFontGlyph]::TextOut($dc,$pad,$pad,$text,1)){throw 'TextOutW failed'};[void][EVNativeFontGlyph]::SelectObject($dc,$oldBitmap);$rendered=[Drawing.Image]::FromHbitmap($hb);try{$rendered.Save($out,[Drawing.Imaging.ImageFormat]::Png)}finally{$rendered.Dispose()}}finally{[void][EVNativeFontGlyph]::SelectObject($dc,$oldBitmap);[void][EVNativeFontGlyph]::DeleteObject($hb);$bitmap.Dispose()}
 $receipt=[ordered]@{requestedFace=$Face;selectedFace=$actual.ToString();fontSubstituted=$Face-ne$actual.ToString();sourceCodePoint=$CodePoint;sourceCodePointHex=('U+{0:X4}'-f$CodePoint);charset=$Charset;pitchFamily=$PitchFamily;sizePoints=$SizePoints;weight=$Weight;italicFlag=$ItalicFlag;underlineFlag=$UnderlineFlag;ascentPixels=$metrics.Ascent;descentPixels=$metrics.Descent;baselineFromBottomPixels=$height-($pad+$metrics.Ascent);dpi=96;widthPixels=$width;heightPixels=$height;paddingPixels=$pad;advancePixels=$extent.Width;output=$out;sha256=(Get-FileHash -LiteralPath $out -Algorithm SHA256).Hash;observation='Controlled native Windows GDI rendering; selected fallback font is preserved, original font semantics are not inferred'}
 $receipt|ConvertTo-Json|Set-Content -LiteralPath ($out+'.json');$receipt|ConvertTo-Json
}finally{[void][EVNativeFontGlyph]::SelectObject($dc,$oldFont);[void][EVNativeFontGlyph]::DeleteObject($font);[void][EVNativeFontGlyph]::DeleteDC($dc)}

