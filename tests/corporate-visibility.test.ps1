$html = Get-Content -Raw -Encoding utf8 'index.html'

$checks = @(
  @{ Name = 'Gift Set Corporate CTA is hidden'; Pattern = '<a href="#corporate"[\s\S]*?class="[^"]*\bhidden\b[^"]*"' },
  @{ Name = 'Corporate section is hidden'; Pattern = '<section id="corporate" class="[^"]*\bhidden\b[^"]*"' },
  @{ Name = 'Corporate footer link is hidden'; Pattern = '<li class="hidden"><a href="#corporate"' }
)

foreach ($check in $checks) {
  if ($html -notmatch $check.Pattern) {
    throw $check.Name
  }
}
