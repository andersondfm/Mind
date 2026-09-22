# Build e sobe o MIND no Docker Desktop (Windows).
# Uso: .\docker-up.ps1
# Opcional: .\docker-up.ps1 -Port 3000

param(
  [int]$Port = 8080,
  [string]$Image = 'mind',
  [string]$Name = 'mind'
)

$ErrorActionPreference = 'Stop'

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  Write-Error 'Docker nao encontrado. Abra o Docker Desktop e tente de novo.'
}

Write-Host ">> Build da imagem '$Image'..." -ForegroundColor Cyan
docker build -t $Image .

$existing = docker ps -aq --filter "name=^/${Name}$"
if ($existing) {
  Write-Host ">> Removendo container antigo '$Name'..." -ForegroundColor Yellow
  docker rm -f $Name | Out-Null
}

Write-Host ">> Subindo em http://localhost:$Port ..." -ForegroundColor Cyan
docker run -d --name $Name -p "${Port}:80" $Image | Out-Null

Start-Sleep -Seconds 1
$status = docker inspect -f '{{.State.Status}}' $Name 2>$null
if ($status -ne 'running') {
  Write-Error "Container nao ficou running. Veja: docker logs $Name"
}

Write-Host ""
Write-Host "MIND no ar: http://localhost:$Port" -ForegroundColor Green
Write-Host "Parar:      docker stop $Name"
Write-Host "Logs:       docker logs -f $Name"
Write-Host ""

try {
  Start-Process "http://localhost:$Port"
} catch {
  # sem browser padrao — ok
}
