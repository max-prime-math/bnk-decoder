[CmdletBinding()]
param(
 [Parameter(Mandatory=$true)][string]$Bank,
 [string]$Output,
 [string]$Evidence
)
$ErrorActionPreference='Stop'
$candidates=@()
$installed=Get-Command node.exe -ErrorAction SilentlyContinue
if($installed){$candidates+=$installed.Source}
$runtimeRoot=Join-Path $env:LOCALAPPDATA 'OpenAI/Codex/runtimes/cua_node'
if(Test-Path -LiteralPath $runtimeRoot){
 $candidates+=Get-ChildItem -LiteralPath $runtimeRoot -Directory | ForEach-Object {Join-Path $_.FullName 'bin/node.exe'}
}
$nodePath=$null
foreach($candidate in $candidates | Select-Object -Unique){
 if(!(Test-Path -LiteralPath $candidate)){continue}
 $version=& $candidate --version
 if($LASTEXITCODE -eq 0 -and $version -match '^v(\d+)\.' -and [int]$Matches[1] -ge 24){$nodePath=$candidate;break}
}
if(!$nodePath){throw 'Node 24 or newer is required. No compatible installed Node or Codex runtime was found.'}
$arguments=@((Join-Path $PSScriptRoot 'examview-to-pqp.mjs'),$Bank)
if($Output){$arguments+=$Output}
if($Evidence){$arguments+=@('--evidence',$Evidence)}
& $nodePath @arguments
exit $LASTEXITCODE
