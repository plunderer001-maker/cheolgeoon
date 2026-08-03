$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$assetRoot = Join-Path $projectRoot "public\images\cheolgeoon"
$rawDir = Join-Path $assetRoot "_raw"
$sourceDir = Join-Path $assetRoot "source"
$heroDir = Join-Path $assetRoot "hero"
$sectionDir = Join-Path $assetRoot "sections"
$thumbDir = Join-Path $assetRoot "thumbs"
$ogDir = Join-Path $assetRoot "og"
$manifestPath = Join-Path $assetRoot "image-manifest.json"

New-Item -ItemType Directory -Force -Path $rawDir, $sourceDir, $heroDir, $sectionDir, $thumbDir, $ogDir | Out-Null

$driveImages = @(
  @{ id = "1J5cJfFeu_aVkA1JMI0Chk2bYsWD6X47n"; name = "demolition-work-001.jpg" },
  @{ id = "1B7kyYJ_WYz_I4vTyMkfMvCzjtTmsAVGo"; name = "demolition-work-002.jpg" },
  @{ id = "1hyb1ljcot_TNMTPLH-kROOH3xzxJerYD"; name = "demolition-work-003.jpg" },
  @{ id = "1uOS679SVmWCADorTw2XK1WouqSl98sJU"; name = "demolition-work-004.jpg" },
  @{ id = "1csSp6bWp50HXBJtSSyCbqp0XYN6Xifbp"; name = "demolition-work-005.jpg" },
  @{ id = "106Ma3XyzHiV_Amebj1qrNi6SHwr8zK7_"; name = "demolition-work-006.jpg" },
  @{ id = "1Fj7PsxWRIqDk3ZsQj0HAAR-ut2Fc5Y75"; name = "demolition-work-007.jpg" },
  @{ id = "1sr4nzH5s-qHLPN3QIdLtc2ilgrfm4b6L"; name = "demolition-work-008.jpg" },
  @{ id = "1q7CVi3AWbFrsxQs_ftEecRBjzKtopXkW"; name = "demolition-work-009.jpg" },
  @{ id = "1w0KmZkoljAhgCH9QLGTjp4GA7Ppw735Z"; name = "demolition-work-010.jpg" },
  @{ id = "12OcUcSr3mQYtd2iZqiFEMGtxy7oFx4A0"; name = "demolition-work-011.jpg" },
  @{ id = "1hLTzWvqEBuk-dxuIbjZHAdw0ydJNxNtp"; name = "demolition-work-012.jpg" },
  @{ id = "194e4-xOGhsi9BjdDw1N5nJ1avy2CgHU1"; name = "demolition-work-013.jpg" },
  @{ id = "1V-Bx754M0vAP-4jF5gUjiZs3Kcol3oXs"; name = "demolition-work-014.jpg" },
  @{ id = "1uIJve5Su5Lr8urw11GiVOqRMV9vpHj9C"; name = "demolition-work-015.jpg" },
  @{ id = "1eonmLb4PSm-G5hbtfRAr7GZTjkmUGbs0"; name = "demolition-work-016.jpg" },
  @{ id = "1hF6uCDx4L7GobjclJfXVICZb2Qa4-wzR"; name = "demolition-work-017.jpg" },
  @{ id = "1uM8umHuAyaY5-rwEIFumruRyS8-5aSow"; name = "demolition-work-018.jpg" },
  @{ id = "1mb5gJEj55ZC-bX_jI6qfwMj8qxUE6crz"; name = "demolition-work-019.jpg" },
  @{ id = "1gMMR3FE8gKQfFBLqq4TXtK34fmlUzFh9"; name = "demolition-work-020.jpg" },
  @{ id = "1MsZ8sdnEBQcvAINkFEktwoBYTg8WLLN6"; name = "demolition-work-021.jpg" },
  @{ id = "1VV8YeVxuWCswlmR0K1qN7fXwtPBG6L9Q"; name = "demolition-work-022.jpg" },
  @{ id = "1SCQ9AsuMf36gT9ylCrszz0LCcZXDeoyn"; name = "demolition-work-023.jpg" },
  @{ id = "1UeF5b1USCcWyNBh_Zk6f8RNNWy1cRU9N"; name = "demolition-work-024.jpg" },
  @{ id = "1UdbjmitBHk20UPelO7LcJDVOgeumCzqS"; name = "demolition-work-025.jpg" },
  @{ id = "14387PpWFG5P3xC7TxIoRfngwgDlLAMUt"; name = "demolition-work-026.jpg" },
  @{ id = "1HFfvXKwTG5EaT2DsBYz2B2Ji6BRL3URs"; name = "demolition-work-027.jpg" },
  @{ id = "1wlhL78e-29DVts1cSQFjLLX5cFoc1-hS"; name = "demolition-work-028.jpg" },
  @{ id = "1a2afPvwW3VuA42or0vwscUvYnCrMLwxu"; name = "demolition-work-029.jpg" },
  @{ id = "1930lNr2o3zkHigIQOmyArIRSiZ2xk3Oj"; name = "demolition-work-030.jpg" },
  @{ id = "10p5_O4lWe_8nCUv7wzdZ94x5Pj0WwsQo"; name = "demolition-work-031.jpg" },
  @{ id = "1oizxdYmZ3hZ6mCJPLrjd4Z7fKznpL028"; name = "demolition-work-032.jpg" },
  @{ id = "1ihCzgimW8BRPvYTSpo3swhXntgJW4sfN"; name = "demolition-work-033.jpg" },
  @{ id = "1R_U5x0AKnkS-z8fuQ9t7H6SQWtJ6VgKl"; name = "demolition-work-034.jpg" },
  @{ id = "19fAOzjCtXt6NYmw5Qze6AxL0QX3Gofln"; name = "demolition-work-035.jpg" },
  @{ id = "1jBVTfq8ZY7mybn3ssgT2zMBUDc0ilInp"; name = "demolition-work-036.jpg" },
  @{ id = "18H2t7wnmQ4o_09B7MeSsU74vufICS4yG"; name = "demolition-work-037.jpg" },
  @{ id = "1vu8u-di0XbT76I_TJzf7Y_aUnGApwJcS"; name = "demolition-work-038.jpg" },
  @{ id = "1BgOnBLOKFBVdz8_BKDj27kZlMsMIuJLx"; name = "demolition-work-039.jpg" },
  @{ id = "1ZvRy8alsX2TgfzAGeh8F6RH6_yYMN2d3"; name = "demolition-work-040.jpg" },
  @{ id = "18yAIycrEjlFHA0IppufMnLA7qlwzCnMs"; name = "demolition-work-041.jpg" },
  @{ id = "14fur25c-wNIDfSK1PamCA9-yfoKkTSVY"; name = "demolition-work-042.jpg" },
  @{ id = "1krSjs9mJjkVfuS_eQexqXnbyK5_0mWgw"; name = "demolition-work-043.jpg" },
  @{ id = "1aqy1HO8BUNIFlv4GnGNcbRD8ohR4c2_r"; name = "demolition-work-044.jpg" },
  @{ id = "19L09zL1aOdgDNQChFTJUVMKnM1nypLZo"; name = "demolition-work-045.jpg" }
)

foreach ($image in $driveImages) {
  $rawPath = Join-Path $rawDir $image.name
  if (-not (Test-Path -LiteralPath $rawPath)) {
    $url = "https://drive.google.com/uc?export=download&id=$($image.id)"
    Invoke-WebRequest -Uri $url -OutFile $rawPath -MaximumRedirection 5 -TimeoutSec 60
  }
}

$python = "C:\Users\LG\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
$script = Join-Path $PSScriptRoot "build-cheolgeoon-image-assets.py"
& $python $script $assetRoot

Get-Content -LiteralPath $manifestPath
