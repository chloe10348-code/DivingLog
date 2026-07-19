#!/bin/bash
# DepthLog 项目打包脚本

echo "正在打包 DepthLog 项目..."
cd /Users/chloeyao/Documents/trae_projects

# 创建压缩包
zip -r DepthLog.zip DivingLog \
  -x "*.git/*" \
  -x "*/node_modules/*" \
  -x "*/.next/*" \
  -x "*/.env" \
  -x "package-project.sh"

echo "✅ 项目打包完成！"
echo "📍 文件位置: /Users/chloeyao/Documents/trae_projects/DepthLog.zip"
echo ""
echo "📋 安装步骤："
echo "1. 解压 DepthLog.zip 到目标文件夹"
echo "2. cd depthlog"
echo "3. npm install"
echo "4. 配置 .env.local"
echo "5. npm run dev"
