param([int]$Command=0,[switch]$Tree,[int]$ProcessId=0)
Add-Type -AssemblyName UIAutomationClient
Add-Type -AssemblyName UIAutomationTypes
Add-Type @"
using System; using System.Runtime.InteropServices;
public class EVOracleWin { [DllImport("user32.dll")] public static extern bool PostMessage(IntPtr h,uint m,IntPtr w,IntPtr l); }
"@
if($ProcessId){$p=Get-Process -Id $ProcessId}else{$p=Get-Process evpro | Select-Object -First 1}
if($Command){[void][EVOracleWin]::PostMessage($p.MainWindowHandle,273,[IntPtr]$Command,[IntPtr]::Zero);Start-Sleep -Milliseconds 400}
if($Tree){$all=[System.Windows.Automation.AutomationElement]::RootElement.FindAll([System.Windows.Automation.TreeScope]::Children,[System.Windows.Automation.Condition]::TrueCondition);foreach($w in $all){if($w.Current.ProcessId -eq $p.Id){$es=$w.FindAll([System.Windows.Automation.TreeScope]::Subtree,[System.Windows.Automation.Condition]::TrueCondition);foreach($e in $es){'{0} | {1} | {2} | {3}' -f $e.Current.ControlType.ProgrammaticName,$e.Current.Name,$e.Current.AutomationId,$e.Current.NativeWindowHandle}}}}

