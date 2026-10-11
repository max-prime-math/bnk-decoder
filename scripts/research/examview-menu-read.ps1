param([int]$ProcessId,[long]$WindowHandle=0)
Add-Type @"
using System;using System.Text;using System.Runtime.InteropServices;public class EVMenuRead{[DllImport("user32.dll")]public static extern IntPtr GetMenu(IntPtr h);[DllImport("user32.dll")]public static extern int GetMenuItemCount(IntPtr h);[DllImport("user32.dll")]public static extern IntPtr GetSubMenu(IntPtr h,int i);[DllImport("user32.dll",CharSet=CharSet.Unicode)]public static extern int GetMenuString(IntPtr h,int i,StringBuilder s,int n,uint f);[DllImport("user32.dll")]public static extern uint GetMenuItemID(IntPtr h,int i);}
"@
function ReadM($h){for($i=0;$i-lt[EVMenuRead]::GetMenuItemCount($h);$i++){$s=New-Object Text.StringBuilder 512;[void][EVMenuRead]::GetMenuString($h,$i,$s,512,1024);'{0} [{1}]'-f$s,[EVMenuRead]::GetMenuItemID($h,$i);$sub=[EVMenuRead]::GetSubMenu($h,$i);if($sub-ne[IntPtr]::Zero){ReadM $sub}}};if(!$WindowHandle){$WindowHandle=(Get-Process -Id $ProcessId).MainWindowHandle};ReadM([EVMenuRead]::GetMenu([IntPtr]$WindowHandle))

