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
  'id="introduction"',
  'id="skills"',
  'id="journey"',
  'Janus Ibasco',
  'JanusIbasco-dev'
)

$forbidden = @(
  'id="contact"',
  'sound-toggle',
  'initSoundToggle',
  'initContactForm'
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

$presentForbidden = @()
foreach ($item in $forbidden) {
  if ($content -match [regex]::Escape($item)) {
    $presentForbidden += $item
  }
}

if ($presentForbidden.Count -gt 0) {
  Write-Host 'Found removed content that should no longer exist:' -ForegroundColor Red
  $presentForbidden | ForEach-Object { Write-Host "- $_" -ForegroundColor Red }
  exit 1
}

Write-Host 'Portfolio structure check passed.' -ForegroundColor Green

