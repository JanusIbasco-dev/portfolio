$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$index = Join-Path $root 'index.html'

if (-not (Test-Path $index)) {
  throw 'index.html not found.'
}

$content = Get-Content -Path $index -Raw
$required = @(
  'id="home"',
  'id="about"',
  'id="skills"',
  'id="projects"',
  'id="journey"',
  'id="contact"',
  'Janus Ibasco',
  'janusibasco433@gmail.com',
  'JanusIbasco-dev'
)

$missing = @()
foreach ($item in $required) {
  if ($content -notmatch [regex]::Escape($item)) {
    $missing += $item
  }
}

if ($missing.Count -gt 0) {
  Write-Host 'Missing expected content:' -ForegroundColor Red
  $missing | ForEach-Object { Write-Host "- $_" -ForegroundColor Red }
  exit 1
}

Write-Host 'Portfolio structure check passed.' -ForegroundColor Green

