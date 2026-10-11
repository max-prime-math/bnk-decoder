param(
  [Parameter(Mandatory = $true)][string]$ZipPath,
  [Parameter(Mandatory = $true)][string]$OutputPath,
  [switch]$IncludeAssetData
)
$ErrorActionPreference = 'Stop'
$resolvedOutput = [System.IO.Path]::GetFullPath($OutputPath)
if ([System.IO.File]::Exists($resolvedOutput)) { throw "Output already exists: $resolvedOutput" }
Add-Type -AssemblyName System.IO.Compression.FileSystem
Add-Type -AssemblyName System.Drawing

function Read-SecureXml([System.IO.Stream]$Stream) {
  $settings = New-Object System.Xml.XmlReaderSettings
  $settings.DtdProcessing = [System.Xml.DtdProcessing]::Prohibit
  $settings.XmlResolver = $null
  $settings.MaxCharactersInDocument = 100000000
  $reader = [System.Xml.XmlReader]::Create($Stream, $settings)
  try {
    $doc = New-Object System.Xml.XmlDocument
    $doc.XmlResolver = $null
    $doc.PreserveWhitespace = $true
    $doc.Load($reader)
    return ,$doc
  } finally { $reader.Dispose() }
}
function Attributes($Node) {
  $result = [ordered]@{}
  foreach ($attribute in $Node.Attributes) { $result[$attribute.Name] = $attribute.Value }
  return $result
}
function Xml-Tree($Node) {
  $children = @()
  foreach ($child in $Node.ChildNodes) { if ($child.NodeType -eq [System.Xml.XmlNodeType]::Element) { $children += Xml-Tree $child } }
  return [ordered]@{ name = $Node.LocalName; attributes = Attributes $Node; text = $Node.InnerText; children = $children }
}
function Materials($Node, [string]$XPath = ".//*[local-name()='mat_formattedtext' or local-name()='mattext']") {
  $result = @()
  if ($null -ne $Node) {
    foreach ($material in $Node.SelectNodes($XPath)) {
      # InnerText decodes exactly one XML entity layer; HTML remains an unmodified string.
      $result += [ordered]@{ element = $material.LocalName; attributes = Attributes $material; html = $material.InnerText }
    }
  }
  return ,$result
}
function Html-Attributes([string]$Tag) {
  $values = @{}
  $pattern = '(?<name>[\w:-]+)\s*=\s*(?:"(?<double>[^"]*)"|''(?<single>[^'']*)''|(?<bare>[^\s>]+))'
  foreach ($match in [regex]::Matches($Tag, $pattern)) {
    $value = if ($match.Groups['double'].Success) { $match.Groups['double'].Value } elseif ($match.Groups['single'].Success) { $match.Groups['single'].Value } else { $match.Groups['bare'].Value }
    $values[$match.Groups['name'].Value.ToLowerInvariant()] = [System.Net.WebUtility]::HtmlDecode($value)
  }
  return $values
}

$resolvedZip = [System.IO.Path]::GetFullPath($ZipPath)
$zip = [System.IO.Compression.ZipFile]::OpenRead($resolvedZip)
try {
  $entryMap = @{}
  foreach ($entry in $zip.Entries) {
    $name = $entry.FullName.Replace('\', '/')
    if ($entryMap.ContainsKey($name)) { throw "Duplicate ZIP entry: $name" }
    $entryMap[$name] = $entry
  }
  $items = @(); $assessments = @(); $documents = @(); $imageReferences = @(); $assets = @(); $types = [ordered]@{}
  foreach ($entry in $zip.Entries) {
    if ($entry.FullName -notmatch '(?i)(\.dat|\.xml)$') { continue }
    $stream = $entry.Open()
    try { $doc = Read-SecureXml $stream } finally { $stream.Dispose() }
    $documents += [ordered]@{ entry = $entry.FullName; root = $doc.DocumentElement.LocalName }
    foreach ($assessment in $doc.SelectNodes("//*[local-name()='assessment']")) { $assessments += [ordered]@{ entry = $entry.FullName; attributes = Attributes $assessment } }
    $ordinal = 0
    foreach ($item in $doc.SelectNodes("//*[local-name()='item']")) {
      $ordinal++
      $metadata = [ordered]@{}
      foreach ($field in $item.SelectNodes("./*[local-name()='itemmetadata']/*")) { $metadata[$field.LocalName] = $field.InnerText }
      $sourceId = $metadata['bbmd_asi_object_id']; $type = $metadata['bbmd_questiontype']
      if (-not $types.Contains($type)) { $types[$type] = 0 }; $types[$type]++
      $presentation = $item.SelectSingleNode("./*[local-name()='presentation']")
      $question = Materials $presentation ".//*[local-name()='flow' and @class='QUESTION_BLOCK']//*[local-name()='mat_formattedtext' or local-name()='mattext']"
      $responses = @()
      if ($presentation) { foreach ($response in $presentation.SelectNodes(".//*[local-name()='response_lid' or local-name()='response_str' or local-name()='response_num' or local-name()='response_xy']")) {
        $labels = @()
        foreach ($label in $response.SelectNodes(".//*[local-name()='response_label']")) { $labels += [ordered]@{ attributes = Attributes $label; materials = Materials $label } }
        $responses += [ordered]@{ element = $response.LocalName; attributes = Attributes $response; labels = $labels; parentMaterials = Materials $response.ParentNode; xml = $response.OuterXml }
      } }
      $matchingChoices = @()
      if ($presentation) { foreach ($flow in $presentation.SelectNodes(".//*[local-name()='flow' and @class='RIGHT_MATCH_BLOCK']/*[local-name()='flow']")) { $matchingChoices += ,(Materials $flow) } }
      $conditions = @(); $correctConditions = @(); $diagnostics = @()
      foreach ($condition in $item.SelectNodes("./*[local-name()='resprocessing']/*[local-name()='respcondition']")) {
        $parsedCondition = [ordered]@{ attributes = Attributes $condition; tree = Xml-Tree $condition; xml = $condition.OuterXml }
        $conditions += $parsedCondition
        if ($condition.SelectSingleNode("./*[local-name()='displayfeedback' and @linkrefid='correct']")) {
          $correctConditions += $parsedCondition
          foreach ($equal in $condition.SelectNodes(".//*[local-name()='varequal']")) {
            $responseId = $equal.GetAttribute('respident')
            if (-not @($responses | Where-Object { $_['attributes']['ident'] -eq $responseId }).Count) {
              $diagnostics += [ordered]@{ code = 'orphan-correct-response'; responseId = $responseId; answer = $equal.InnerText }
            }
          }
        }
      }
      $feedback = @()
      foreach ($node in $item.SelectNodes("./*[local-name()='itemfeedback']")) { $feedback += [ordered]@{ attributes = Attributes $node; materials = Materials $node; xml = $node.OuterXml } }
      $allMaterials = Materials $item
      foreach ($material in $allMaterials) { foreach ($match in [regex]::Matches($material.html, '(?is)<img\b[^>]*>')) {
        $attrs = Html-Attributes $match.Value; $src = $attrs['src']; $path = $null; $exists = $false
        if ($src -and $src -notmatch '^[A-Za-z][A-Za-z0-9+.-]*:') {
          $path = [System.Uri]::UnescapeDataString(($src -split '[?#]', 2)[0]).Replace('\', '/').TrimStart('/')
          $exists = $entryMap.ContainsKey($path)
          if (-not $exists) {
            $folder = ($entry.FullName.Replace('\', '/') -replace '[^/]+$', '')
            if ($entryMap.ContainsKey($folder + $path)) { $path = $folder + $path; $exists = $true }
          }
        }
        $imageReferences += [ordered]@{ sourceId = $sourceId; entry = $entry.FullName; source = $src; zipEntry = $path; exists = $exists; width = $attrs['width']; height = $attrs['height']; attributes = $attrs }
      } }
      $items += [ordered]@{ entry = $entry.FullName; ordinal = $ordinal; sourceId = $sourceId; type = $type; attributes = Attributes $item; metadata = $metadata; question = $question; responses = $responses; matchingChoices = $matchingChoices; conditions = $conditions; correctConditions = $correctConditions; feedback = $feedback; materials = $allMaterials; diagnostics = $diagnostics; xml = $item.OuterXml }
    }
  }
  foreach ($path in @($imageReferences | Where-Object { $_['exists'] } | ForEach-Object { $_['zipEntry'] } | Select-Object -Unique)) {
    $entry = $entryMap[$path]; $stream = $entry.Open(); $memory = New-Object System.IO.MemoryStream
    try { $stream.CopyTo($memory); $bytes = $memory.ToArray() } finally { $stream.Dispose(); $memory.Dispose() }
    $hash = [System.Security.Cryptography.SHA256]::Create()
    try { $digest = ([System.BitConverter]::ToString($hash.ComputeHash($bytes))).Replace('-', '').ToLowerInvariant() } finally { $hash.Dispose() }
    $asset = [ordered]@{ entry = $path; byteLength = $bytes.Length; sha256 = $digest }
    $imageStream = New-Object System.IO.MemoryStream(,$bytes)
    try {
      $image = [System.Drawing.Image]::FromStream($imageStream)
      try { $asset['pixelWidth'] = $image.Width; $asset['pixelHeight'] = $image.Height } finally { $image.Dispose() }
    } catch { $asset['dimensionError'] = $_.Exception.Message }
    finally { $imageStream.Dispose() }
    if ($IncludeAssetData) { $asset['base64'] = [Convert]::ToBase64String($bytes) }
    $assets += $asset
  }
  $result = [ordered]@{ schema = 'examview-native-blackboard-inventory-v1'; zip = $resolvedZip; assessments = $assessments; documents = $documents; itemCount = $items.Count; types = $types; items = $items; imageReferences = $imageReferences; missingImageReferences = @($imageReferences | Where-Object { -not $_.exists }); assets = $assets; limitations = @('Native export inventory; no claim that export contains every BNK field or that a PQP conversion is semantically complete.'); }
  [System.IO.Directory]::CreateDirectory([System.IO.Path]::GetDirectoryName($resolvedOutput)) | Out-Null
  $outputBytes = (New-Object System.Text.UTF8Encoding($false)).GetBytes(($result | ConvertTo-Json -Depth 100))
  $outputStream = [System.IO.File]::Open($resolvedOutput, [System.IO.FileMode]::CreateNew, [System.IO.FileAccess]::Write)
  try { $outputStream.Write($outputBytes, 0, $outputBytes.Length) } finally { $outputStream.Dispose() }
  [ordered]@{ output = $resolvedOutput; itemCount = $items.Count; types = $types; images = $imageReferences.Count; uniqueAssets = $assets.Count; missingImages = $result.missingImageReferences.Count } | ConvertTo-Json -Depth 10
} finally { $zip.Dispose() }
