# Script đồng bộ giao diện từ dự án nguồn sang MH Shop
# Sử dụng: .\sync-ui.ps1 -SourcePath "D:\code\source-project"

param(
    [Parameter(Mandatory=$true)]
    [string]$SourcePath,
    
    [Parameter(Mandatory=$false)]
    [string]$TargetPath = "D:\code\mh-shop"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Script Đồng Bộ Giao Diện MH Shop" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra đường dẫn nguồn
if (-not (Test-Path $SourcePath)) {
    Write-Host "❌ Lỗi: Không tìm thấy dự án nguồn tại: $SourcePath" -ForegroundColor Red
    exit 1
}

# Kiểm tra đường dẫn đích
if (-not (Test-Path $TargetPath)) {
    Write-Host "❌ Lỗi: Không tìm thấy dự án đích tại: $TargetPath" -ForegroundColor Red
    exit 1
}

Write-Host "📁 Dự án nguồn: $SourcePath" -ForegroundColor Green
Write-Host "📁 Dự án đích: $TargetPath" -ForegroundColor Green
Write-Host ""

# Hàm copy với thông báo
function Copy-WithMessage {
    param(
        [string]$Source,
        [string]$Destination,
        [string]$Description
    )
    
    if (Test-Path $Source) {
        Write-Host "📋 Đang copy: $Description..." -ForegroundColor Yellow
        try {
            # Tạo thư mục đích nếu chưa tồn tại
            $destDir = Split-Path -Parent $Destination
            if (-not (Test-Path $destDir)) {
                New-Item -ItemType Directory -Path $destDir -Force | Out-Null
            }
            
            Copy-Item -Path $Source -Destination $Destination -Recurse -Force -ErrorAction Stop
            Write-Host "   ✅ Hoàn thành: $Description" -ForegroundColor Green
            return $true
        }
        catch {
            Write-Host "   ❌ Lỗi khi copy $Description : $_" -ForegroundColor Red
            return $false
        }
    }
    else {
        Write-Host "   ⚠️  Không tìm thấy: $Source (bỏ qua)" -ForegroundColor Yellow
        return $false
    }
}

# Bước 1: Copy Components
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "BƯỚC 1: Copy Components" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

$sourceComponents = Join-Path $SourcePath "src\components"
$targetComponents = Join-Path $TargetPath "src\components"

if (Test-Path $sourceComponents) {
    # Copy từng thư mục con để tránh ghi đè toàn bộ
    $componentDirs = Get-ChildItem -Path $sourceComponents -Directory -ErrorAction SilentlyContinue
    foreach ($dir in $componentDirs) {
        $sourceDir = $dir.FullName
        $targetDir = Join-Path $targetComponents $dir.Name
        Copy-WithMessage -Source $sourceDir -Destination $targetDir -Description "Components/$($dir.Name)"
    }
}
else {
    Write-Host "⚠️  Không tìm thấy thư mục components trong dự án nguồn" -ForegroundColor Yellow
}

Write-Host ""

# Bước 2: Copy CSS và Fonts
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "BƯỚC 2: Copy CSS và Fonts" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

# Copy CSS
$sourceCss = Join-Path $SourcePath "src\app\css"
$targetCss = Join-Path $TargetPath "src\app\css"
Copy-WithMessage -Source $sourceCss -Destination $targetCss -Description "CSS files"

# Copy Fonts
$sourceFonts = Join-Path $SourcePath "src\app\fonts"
$targetFonts = Join-Path $TargetPath "src\app\fonts"
Copy-WithMessage -Source $sourceFonts -Destination $targetFonts -Description "Font files"

Write-Host ""

# Bước 3: Copy Images
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "BƯỚC 3: Copy Images" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

$sourceImages = Join-Path $SourcePath "public\images"
$targetImages = Join-Path $TargetPath "public\images"
Copy-WithMessage -Source $sourceImages -Destination $targetImages -Description "Images"

Write-Host ""

# Bước 4: Copy Types
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "BƯỚC 4: Copy Types" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

$sourceTypes = Join-Path $SourcePath "src\types"
$targetTypes = Join-Path $TargetPath "src\types"

if (Test-Path $sourceTypes) {
    # Copy từng file để tránh ghi đè hoàn toàn
    $typeFiles = Get-ChildItem -Path $sourceTypes -File -ErrorAction SilentlyContinue
    foreach ($file in $typeFiles) {
        $sourceFile = $file.FullName
        $targetFile = Join-Path $targetTypes $file.Name
        
        # Kiểm tra file đích đã tồn tại chưa
        if (Test-Path $targetFile) {
            Write-Host "⚠️  File đã tồn tại: $($file.Name) (bỏ qua, cần merge thủ công)" -ForegroundColor Yellow
        }
        else {
            Copy-WithMessage -Source $sourceFile -Destination $targetFile -Description "Types/$($file.Name)"
        }
    }
}
else {
    Write-Host "⚠️  Không tìm thấy thư mục types trong dự án nguồn" -ForegroundColor Yellow
}

Write-Host ""

# Bước 5: Copy Context
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "BƯỚC 5: Copy Context Providers" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

$sourceContext = Join-Path $SourcePath "src\app\context"
$targetContext = Join-Path $TargetPath "src\app\context"
Copy-WithMessage -Source $sourceContext -Destination $targetContext -Description "Context providers"

Write-Host ""

# Bước 6: Copy Redux (nếu có)
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "BƯỚC 6: Copy Redux Store (nếu có)" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

$sourceRedux = Join-Path $SourcePath "src\redux"
$targetRedux = Join-Path $TargetPath "src\redux"

if (Test-Path $sourceRedux) {
    $confirm = Read-Host "Dự án nguồn có Redux. Bạn có muốn copy Redux? (y/n)"
    if ($confirm -eq "y" -or $confirm -eq "Y") {
        Copy-WithMessage -Source $sourceRedux -Destination $targetRedux -Description "Redux store"
    }
    else {
        Write-Host "   ⏭️  Bỏ qua Redux" -ForegroundColor Yellow
    }
}
else {
    Write-Host "   ℹ️  Dự án nguồn không có Redux" -ForegroundColor Gray
}

Write-Host ""

# Tóm tắt
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "✅ Hoàn thành copy files!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Các bước tiếp theo:" -ForegroundColor Yellow
Write-Host "   1. Cập nhật package.json với dependencies cần thiết" -ForegroundColor White
Write-Host "   2. Cập nhật src/app/layout.tsx với imports CSS và providers" -ForegroundColor White
Write-Host "   3. Kiểm tra và điều chỉnh import paths trong components" -ForegroundColor White
Write-Host "   4. Chạy: npm install" -ForegroundColor White
Write-Host "   5. Chạy: npm run dev và kiểm tra" -ForegroundColor White
Write-Host ""
Write-Host "📖 Xem file SYNC_GUIDE.md để biết chi tiết các bước tiếp theo" -ForegroundColor Cyan
Write-Host ""





