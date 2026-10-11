[CmdletBinding()]
param([Parameter(Mandatory=$true)][string]$Bank,[Parameter(Mandatory=$true)][string]$Output,[string]$RtfOutput,[string]$UpgradedBankOutput,[switch]$CaptureBimodalPresentations,[int]$ProcessId=0,[switch]$KeepOpen,[int]$TimeoutSeconds=90)
$ErrorActionPreference='Stop'
Add-Type @"
using System;using System.Text;using System.Runtime.InteropServices;using System.Collections.Generic;
public class EVExportWin {
 public delegate bool EnumProc(IntPtr h,IntPtr p);
 [DllImport("user32.dll")]static extern bool EnumWindows(EnumProc f,IntPtr p);
 [DllImport("user32.dll")]static extern bool EnumChildWindows(IntPtr h,EnumProc f,IntPtr p);
 [DllImport("user32.dll")]static extern uint GetWindowThreadProcessId(IntPtr h,out uint p);
 [DllImport("user32.dll",CharSet=CharSet.Unicode)]static extern int GetWindowText(IntPtr h,StringBuilder s,int n);
 [DllImport("user32.dll",CharSet=CharSet.Unicode)]static extern int GetClassName(IntPtr h,StringBuilder s,int n);
 [DllImport("user32.dll")]static extern int GetDlgCtrlID(IntPtr h);
 [DllImport("user32.dll")]public static extern bool PostMessage(IntPtr h,uint m,IntPtr w,IntPtr l);
 [DllImport("user32.dll",CharSet=CharSet.Unicode)]public static extern IntPtr SendMessage(IntPtr h,uint m,IntPtr w,string l);
 [DllImport("user32.dll",CharSet=CharSet.Unicode)]public static extern IntPtr SendMessage(IntPtr h,uint m,IntPtr w,StringBuilder l); [DllImport("user32.dll")]public static extern IntPtr GetMenu(IntPtr h);
 [DllImport("user32.dll")]public static extern IntPtr GetSubMenu(IntPtr h,int p);
 [DllImport("user32.dll",CharSet=CharSet.Unicode)]public static extern int GetMenuString(IntPtr h,int p,StringBuilder s,int n,uint flags);
 public class W {public IntPtr H;public string Name;public string Class;public int Id;}
 public static string Text(IntPtr h){var s=new StringBuilder(2048);SendMessage(h,13,(IntPtr)2048,s);return s.ToString();} static W Describe(IntPtr h){var s=new StringBuilder(2048);SendMessage(h,13,(IntPtr)2048,s);var c=new StringBuilder(256);GetClassName(h,c,256);return new W{H=h,Name=s.ToString(),Class=c.ToString(),Id=GetDlgCtrlID(h)};}
 public static W[] Windows(int pid){var a=new List<W>();EnumWindows((h,p)=>{uint id;GetWindowThreadProcessId(h,out id);if(id==pid)a.Add(Describe(h));return true;},IntPtr.Zero);return a.ToArray();}
 public static W[] Children(IntPtr parent){var a=new List<W>();EnumChildWindows(parent,(h,p)=>{a.Add(Describe(h));return true;},IntPtr.Zero);return a.ToArray();}
}
"@
$source=(Resolve-Path -LiteralPath $Bank).Path
$outputPath=[IO.Path]::GetFullPath($Output)
if((Test-Path -LiteralPath $outputPath)-or(Test-Path -LiteralPath ($outputPath+'.receipt.json'))){throw "Output or receipt already exists: $outputPath"}
if([IO.Path]::GetExtension($outputPath) -ne '.zip'){throw 'Output must have .zip extension'}
$rtfPath=if($RtfOutput){[IO.Path]::GetFullPath($RtfOutput)}else{$null}
if($rtfPath -and (Test-Path -LiteralPath $rtfPath)){throw 'RTF output already exists'} 
if($rtfPath){[void][IO.Directory]::CreateDirectory([IO.Path]::GetDirectoryName($rtfPath))}
$outputParent=[IO.Path]::GetDirectoryName($outputPath)
[void][IO.Directory]::CreateDirectory($outputParent)
if($CaptureBimodalPresentations){
 if(!$rtfPath){throw 'CaptureBimodalPresentations requires RtfOutput'}
 foreach($suffix in 'bimodal-mc','bimodal-sa'){
  $z=[IO.Path]::Combine($outputParent,[IO.Path]::GetFileNameWithoutExtension($outputPath)+'.'+$suffix+'.zip')
  $r=[IO.Path]::Combine([IO.Path]::GetDirectoryName($rtfPath),[IO.Path]::GetFileNameWithoutExtension($rtfPath)+'.'+$suffix+'.rtf')
  foreach($path in $z,$r){if(Test-Path -LiteralPath $path){throw "Alternate output already exists: $path"}}
 }
}
$upgradedPath=if($UpgradedBankOutput){[IO.Path]::GetFullPath($UpgradedBankOutput)}else{$null}
if($upgradedPath){
 if([IO.Path]::GetExtension($upgradedPath)-ne'.bnk'){throw 'UpgradedBankOutput must have .bnk extension'}
 if(Test-Path -LiteralPath $upgradedPath){throw "Upgraded bank output already exists: $upgradedPath"}
 [void][IO.Directory]::CreateDirectory([IO.Path]::GetDirectoryName($upgradedPath))
}
$before=(Get-FileHash -LiteralPath $source -Algorithm SHA256).Hash
$runDir=Join-Path $outputParent ('export-work-'+[Guid]::NewGuid().ToString('N'))
[void][IO.Directory]::CreateDirectory($runDir)
$copy=Join-Path $runDir ([IO.Path]::GetFileName($source))
Copy-Item -LiteralPath $source -Destination $copy
$owned=$ProcessId -eq 0
if($owned){$exe=Join-Path $PSScriptRoot '../ExamView/evpro.exe';$exe=[IO.Path]::GetFullPath($exe);$process=Start-Process -FilePath $exe -WindowStyle Hidden -PassThru;$ProcessId=$process.Id}
else{$process=Get-Process -Id $ProcessId;if($process.ProcessName -ne 'evpro'){throw 'ProcessId must identify evpro'}}
function Post($h,[int]$message,[int]$value,$l=[IntPtr]::Zero){[void][EVExportWin]::PostMessage($h,$message,[IntPtr]$value,$l)}
function Wait-Dialog([string]$title){$deadline=(Get-Date).AddSeconds($TimeoutSeconds);do{$wins=@([EVExportWin]::Windows($ProcessId));$found=$wins|Where-Object {$_.Name -eq $title}|Select-Object -First 1;if($found){return $found};Start-Sleep -Milliseconds 150}while((Get-Date)-lt $deadline);throw "Timed out awaiting '$title', windows: $($wins.Name -join ', ')"}
function Set-Edit($w,[int]$id,[string]$value){$e=[EVExportWin]::Children($w.H)|Where-Object {$_.Id -eq $id -and $_.Class -match 'Edit'}|Select-Object -First 1;if(!$e){throw "Missing edit $id on $($w.Name)"};[void][EVExportWin]::SendMessage($e.H,12,[IntPtr]::Zero,$value); Write-Verbose ("Set filename: "+[EVExportWin]::Text($e.H))}
function Accept($w){Post $w.H 273 1}
function Export-NativePair([string]$outputPath,[string]$rtfPath){
 Post $main.H 273 31606
 $dialog=Wait-Dialog 'Export Question Bank';Set-Edit $dialog 1148 $outputPath;Accept $dialog
 $dialog=Wait-Dialog 'Export to Blackboard 7.1-9.0';Set-Edit $dialog 2003 ([IO.Path]::GetFileNameWithoutExtension($source));Set-Edit $dialog 2008 ('ev_'+[Guid]::NewGuid().ToString('N'));Accept $dialog
 $deadline=(Get-Date).AddSeconds($TimeoutSeconds);$lastSize=-1;$stable=0
 do{Start-Sleep -Milliseconds 350;if(Test-Path -LiteralPath $outputPath){$size=(Get-Item -LiteralPath $outputPath).Length;if($size -gt 0 -and $size -eq $lastSize){$stable++}else{$stable=0};$lastSize=$size}}while($stable -lt 3 -and (Get-Date)-lt $deadline)
 if($stable -lt 3){throw 'Blackboard export timed out'}
 Add-Type -AssemblyName System.IO.Compression.FileSystem
 $zip=[IO.Compression.ZipFile]::OpenRead($outputPath);try{if(!$zip.GetEntry('00001_questions.dat')){throw 'Export ZIP does not contain question XML'}}finally{$zip.Dispose()}
 if($rtfPath){
  Post $main.H 273 31600
  $dialog=Wait-Dialog 'Export Question Bank';Set-Edit $dialog 1148 $rtfPath;Accept $dialog
  $deadline=(Get-Date).AddSeconds($TimeoutSeconds);$lastSize=-1;$stable=0
  do{Start-Sleep -Milliseconds 300;if(Test-Path -LiteralPath $rtfPath){$size=(Get-Item -LiteralPath $rtfPath).Length;if($size-gt0 -and $size-eq$lastSize){$stable++}else{$stable=0};$lastSize=$size}}while($stable-lt3 -and (Get-Date)-lt$deadline)
  if($stable-lt3){throw 'RTF export timed out'}
  $stream=[IO.File]::OpenRead($rtfPath);try{$head=New-Object byte[] 6;[void]$stream.Read($head,0,6);if([Text.Encoding]::ASCII.GetString($head)-ne'{\rtf1'){throw 'Invalid RTF export'}}finally{$stream.Dispose()}
 }
 return [ordered]@{output=$outputPath;outputSha256=(Get-FileHash -LiteralPath $outputPath -Algorithm SHA256).Hash;rtfOutput=$rtfPath;rtfSha256=if($rtfPath){(Get-FileHash -LiteralPath $rtfPath -Algorithm SHA256).Hash}else{$null}}
}
try{
 if($owned){Start-Sleep -Seconds 3}
 $deadline=(Get-Date).AddSeconds(15)
 do{$wins=@([EVExportWin]::Windows($ProcessId));$process.Refresh();$main=$wins|Where-Object {$_.Class -eq 'ExamView32_FrameClass'}|Select-Object -First 1
 if($owned){foreach($w in $wins){
 if(!$main -and $w.Name-eq'Welcome'){$kids=[EVExportWin]::Children($w.H);if($kids|Where-Object {$_.Id-eq10 -and $_.Name.Replace('&','')-eq'OK'}){foreach($field in @(2,4,6,8)){Set-Edit $w $field 'BNK Decoder'};$ok=$kids|Where-Object {$_.Id-eq10}|Select-Object -First 1;Post $ok.H 245 0}}if($w.H -ne $main.H){$close=[EVExportWin]::Children($w.H)|Where-Object {$_.Name.Replace('&','') -eq 'Close'}|Select-Object -First 1;if($close){Post $close.H 245 0}}}}
 Start-Sleep -Milliseconds 200
 }while(!$main -and (Get-Date)-lt $deadline)
 if(!$main){throw 'Owned ExamView main window did not appear (single instance redirect or startup failure)'}
 # Main window remains available even during welcome dialogs; finish owned startup closes.
 if($owned){Start-Sleep -Milliseconds 500;foreach($w in [EVExportWin]::Windows($ProcessId)){if($w.H -ne $main.H){$close=[EVExportWin]::Children($w.H)|Where-Object {$_.Name.Replace('&','') -eq 'Close'}|Select-Object -First 1;if($close){Post $close.H 245 0}}}}
 $modeDeadline=(Get-Date).AddSeconds(15)
 do{
  if($owned){foreach($window in [EVExportWin]::Windows($ProcessId)){if($window.H-ne$main.H){$close=[EVExportWin]::Children($window.H)|Where-Object {$_.Name.Replace('&','')-eq'Close'}|Select-Object -First 1;if($close){Post $close.H 245 0}}}}
  Start-Sleep -Milliseconds 250
  $menu=[EVExportWin]::GetSubMenu([EVExportWin]::GetMenu($main.H),0);$label=New-Object Text.StringBuilder 512;[void][EVExportWin]::GetMenuString($menu,0,$label,512,1024)
  if($label.ToString()-match'Question Bank'){break}
  Post $main.H 273 30018
 }while((Get-Date)-lt$modeDeadline)
 if($label.ToString()-notmatch'Question Bank'){throw 'ExamView did not switch to question bank editor'}
 Write-Verbose (([EVExportWin]::Windows($ProcessId)|ForEach-Object {"window $($_.Name) class $($_.Class)"}) -join "; "); Post $main.H 273 30501
 $dialog=Wait-Dialog 'Open';Set-Edit $dialog 1148 $copy;Accept $dialog
 $deadline=(Get-Date).AddSeconds($TimeoutSeconds);do{Start-Sleep -Milliseconds 200;$open=@([EVExportWin]::Windows($ProcessId)|Where-Object {$_.Name-eq'Open'})}while($open.Count -and (Get-Date)-lt $deadline)
 if($open.Count){throw 'BNK open did not finish'}
 if($upgradedPath){
  Post $main.H 273 30503
  $dialog=Wait-Dialog 'Save As';Set-Edit $dialog 1148 $upgradedPath;Accept $dialog
  $deadline=(Get-Date).AddSeconds($TimeoutSeconds);$lastSize=-1;$stable=0
  do{Start-Sleep -Milliseconds 350;if(Test-Path -LiteralPath $upgradedPath){$size=(Get-Item -LiteralPath $upgradedPath).Length;if($size-gt16 -and $size-eq$lastSize){$stable++}else{$stable=0};$lastSize=$size}}while($stable-lt3 -and (Get-Date)-lt$deadline)
  if($stable-lt3){throw 'Native Save As timed out'}
 }
 $primaryEvidence=Export-NativePair $outputPath $rtfPath
 $alternates=@()
 if($CaptureBimodalPresentations){
  foreach($mode in @(@{name='multiple-choice';suffix='bimodal-mc';command=30591},@{name='short-answer';suffix='bimodal-sa';command=30590})){
   Post $main.H 273 $mode.command
   Start-Sleep -Milliseconds 250
   $alternateZip=[IO.Path]::Combine($outputParent,[IO.Path]::GetFileNameWithoutExtension($outputPath)+'.'+$mode.suffix+'.zip')
   $alternateRtf=[IO.Path]::Combine([IO.Path]::GetDirectoryName($rtfPath),[IO.Path]::GetFileNameWithoutExtension($rtfPath)+'.'+$mode.suffix+'.rtf')
   $evidence=Export-NativePair $alternateZip $alternateRtf
   $evidence.mode=$mode.name;$evidence.presentationCommand=$mode.command;$evidence.sameLoadedBank=$true
   $alternates+=$evidence
  }
 }
 $upgradedBank=$null
 if($upgradedPath){
  Post $main.H 273 30504
  $deadline=(Get-Date).AddSeconds(10);$upgradeHash=$null
  do{
   Start-Sleep -Milliseconds 150
   foreach($window in [EVExportWin]::Windows($ProcessId)){
    if($window.Name-eq'Caution'){
     $children=[EVExportWin]::Children($window.H)
     $message=$children|Where-Object {$_.Name-match'The question bank has not been saved.*Save changes to the question bank'}
     $no=$children|Where-Object {$_.Id-eq7 -and $_.Name.Replace('&','')-eq'No'}|Select-Object -First 1
     if($message -and $no){Post $window.H 273 7 $no.H}
    }
   }
   try{$upgradeHash=(Get-FileHash -LiteralPath $upgradedPath -Algorithm SHA256 -ErrorAction Stop).Hash}catch{}
  }while(!$upgradeHash -and (Get-Date)-lt$deadline)
  if(!$upgradeHash){throw 'Saved upgraded bank remains locked after closing its owned document'}
  $stream=[IO.File]::OpenRead($upgradedPath);try{$headerBytes=New-Object byte[] 16;[void]$stream.Read($headerBytes,0,16);$upgradeHeader=[Text.Encoding]::ASCII.GetString($headerBytes)}finally{$stream.Dispose()}
  if($upgradeHeader -ne ([string][char]26+'FSCBNK#W#06#00#')){throw "Native Save As did not produce the expected v06 bank: $upgradeHeader"}
  $upgradedBank=[ordered]@{path=$upgradedPath;sha256=$upgradeHash;header=$upgradeHeader;saveAsCommand=30503;savedBeforePrimaryExport=$true;sameLoadedBank=$true}
 }
 $after=(Get-FileHash -LiteralPath $source -Algorithm SHA256).Hash
 if($after -ne $before){throw 'Source hash changed during export'}
 $receipt=[ordered]@{source=$source;sourceSha256=$before;sourceHashAfter=$after;output=$outputPath;rtfOutput=$rtfPath;rtfSha256=if($rtfPath){(Get-FileHash -LiteralPath $rtfPath -Algorithm SHA256).Hash}else{$null};sameLoadedBank=$true;bimodalPresentationMode='stored';upgradedBank=$upgradedBank;alternateEvidence=$alternates;outputSha256=(Get-FileHash -LiteralPath $outputPath -Algorithm SHA256).Hash;processId=$ProcessId;ownedProcess=$owned;bankCopy=$copy;noCalculateValuesCommand=$true;nativeLoadEvaluation='Unknown: ExamView may evaluate algorithm variables on load';exportCommand=31606;completedUtc=[DateTime]::UtcNow.ToString('o')}
 $receipt|ConvertTo-Json -Depth 8|Set-Content -LiteralPath ($outputPath+'.receipt.json')
 $receipt|ConvertTo-Json -Depth 8
 if($owned -and !$KeepOpen){
  Post $main.H 273 30517
  $deadline=(Get-Date).AddSeconds(5)
  do{
   Start-Sleep -Milliseconds 100
   if($process.HasExited){break}
   foreach($window in [EVExportWin]::Windows($ProcessId)){
    if($window.Name-eq'Caution'){
     $children=[EVExportWin]::Children($window.H)
     $message=$children|Where-Object {$_.Name-match'The question bank has not been saved.*Save changes to the question bank'}
     $no=$children|Where-Object {$_.Id-eq7 -and $_.Name.Replace('&','')-eq'No'}|Select-Object -First 1
     if($message -and $no){Post $window.H 273 7 $no.H}
    }
   }
  }while((Get-Date)-lt$deadline)
  if(!$process.HasExited){Write-Warning "Owned ExamView process $ProcessId did not close; it was retained for inspection."}
 }
}catch{Write-Warning "Owned work directory retained at $runDir; process $ProcessId retained for inspection.";throw}

















