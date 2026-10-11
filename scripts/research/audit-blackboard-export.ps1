param(
  [string[]]$ZipPaths = @('reports/rea-examview/runtime-oracle/chapter01-auto.zip', 'reports/rea-examview/runtime-oracle/chapter01-blackboard.zip'),
  [string]$OutputPath = 'reports/rea-examview/runtime-oracle/blackboard-audit.json'
)
$ErrorActionPreference = 'Stop'
$reports = @()
foreach ($zipPath in $ZipPaths) {
  $fixturePath = [System.IO.Path]::ChangeExtension([System.IO.Path]::GetFullPath($zipPath), ".audit-$([Guid]::NewGuid().ToString('N')).inventory.json")
  & (Join-Path $PSScriptRoot '../blackboard-to-json.ps1') -ZipPath $zipPath -OutputPath $fixturePath | Out-Null
  $fixture = Get-Content -LiteralPath $fixturePath -Raw | ConvertFrom-Json
  $matching = @()
  foreach ($item in $fixture.items | Where-Object type -eq 'Matching') {
    $mapping = @()
    foreach ($condition in $item.correctConditions) {
      $mapping += $condition.tree
    }
    $matching += [ordered]@{ sourceId = $item.sourceId; responseCount = $item.responses.Count; rightChoiceCount = $item.matchingChoices.Count; responses = $item.responses; correctConditions = $mapping; diagnostics = $item.diagnostics }
  }
  $feedback = @($fixture.items | ForEach-Object {
    $item = $_
    foreach ($f in $item.feedback) {
      $nonempty = @($f.materials | Where-Object { $_.html.Length -gt 0 })
      if ($nonempty.Count) { [ordered]@{ sourceId = $item.sourceId; feedbackId = $f.attributes.ident; materials = $nonempty } }
    }
  })
  $references = @($fixture.imageReferences | ForEach-Object {
    $reference = $_; $asset = $fixture.assets | Where-Object entry -eq $reference.zipEntry | Select-Object -First 1
    [ordered]@{ sourceId = $reference.sourceId; source = $reference.source; exists = $reference.exists; htmlWidth = $reference.width; htmlHeight = $reference.height; pixelWidth = $asset.pixelWidth; pixelHeight = $asset.pixelHeight }
  })
  $reports += [ordered]@{ zip = $fixture.zip; fixture = $fixturePath; itemCount = $fixture.itemCount; types = $fixture.types; matching = $matching; nonemptyFeedback = $feedback; imageReferences = $references; missingImageReferences = $fixture.missingImageReferences; assets = $fixture.assets }
}
$result = [ordered]@{ evidence = 'Securely parsed native ExamView Blackboard export ZIPs; HTML entity layer decoded once; no PQP fidelity claim.'; reports = $reports }
$resolvedOutput = [System.IO.Path]::GetFullPath($OutputPath)
[System.IO.Directory]::CreateDirectory([System.IO.Path]::GetDirectoryName($resolvedOutput)) | Out-Null
[System.IO.File]::WriteAllText($resolvedOutput, ($result | ConvertTo-Json -Depth 100), (New-Object System.Text.UTF8Encoding($false)))
Write-Output $resolvedOutput
