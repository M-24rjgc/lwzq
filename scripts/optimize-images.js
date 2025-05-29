/**
 * 图片优化脚本
 * 自动将图片转换为WebP格式并重命名中文文件名
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 中文文件名映射表
const fileNameMapping = {
    'henu体育学院.png': 'henu-sports-school.png',
    '顾问邀请doubaoAI.png': 'advisor-invitation-doubao-ai.png',
    '专业团队.jpg': 'professional-team.jpg',
    '付凌霄.jpg': 'fu-lingxiao.jpg',
    '刘海涛老师.jpg': 'liu-haitao-teacher.jpg',
    '动作生物力学图标.png': 'biomechanics-icon.png',
    '吴雨泽.png': 'wu-yuze.png',
    '杨晓慧老师.png': 'yang-xiaohui-teacher.png',
    '架构图.png': 'architecture-diagram.png',
    '梁胜彬老师.jpg': 'liang-shengbin-teacher.jpg',
    '河大.png': 'henu-logo.png',
    '知识产权布局图示.png': 'ip-layout-diagram.png',
    '网图.png': 'network-diagram.png',
    '边云协同计算图标.png': 'edge-cloud-computing-icon.png',
    '多模态数据融合图标.png': 'multimodal-fusion-icon.png',
    '孟天赐.jpg': 'meng-tianci.jpg'
};

// 图片质量配置
const imageConfig = {
    jpeg: { quality: 85 },
    webp: { quality: 80 },
    png: { compressionLevel: 8 }
};

async function optimizeImages() {
    const imagesDir = path.join(__dirname, '../images');
    const files = fs.readdirSync(imagesDir);
    
    console.log('🖼️  开始优化图片资源...\n');
    
    for (const file of files) {
        const filePath = path.join(imagesDir, file);
        const stat = fs.statSync(filePath);
        
        if (!stat.isFile() || !isImageFile(file)) continue;
        
        try {
            // 重命名中文文件名
            const newFileName = fileNameMapping[file] || file;
            const newFilePath = path.join(imagesDir, newFileName);
            
            if (file !== newFileName) {
                fs.renameSync(filePath, newFilePath);
                console.log(`📝 重命名: ${file} → ${newFileName}`);
            }
            
            // 生成WebP版本
            await generateWebP(newFilePath, newFileName);
            
            // 优化原始图片
            await optimizeOriginal(newFilePath, newFileName);
            
        } catch (error) {
            console.error(`❌ 处理 ${file} 时出错:`, error.message);
        }
    }
    
    console.log('\n✅ 图片优化完成！');
}

function isImageFile(filename) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
    return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
}

async function generateWebP(filePath, fileName) {
    const ext = path.extname(fileName);
    const baseName = path.basename(fileName, ext);
    const webpPath = path.join(path.dirname(filePath), `${baseName}.webp`);
    
    if (fs.existsSync(webpPath)) return;
    
    await sharp(filePath)
        .webp(imageConfig.webp)
        .toFile(webpPath);
    
    const originalSize = fs.statSync(filePath).size;
    const webpSize = fs.statSync(webpPath).size;
    const savings = ((originalSize - webpSize) / originalSize * 100).toFixed(1);
    
    console.log(`🔄 生成WebP: ${fileName} → ${baseName}.webp (节省 ${savings}%)`);
}

async function optimizeOriginal(filePath, fileName) {
    const ext = path.extname(fileName).toLowerCase();
    const tempPath = filePath + '.tmp';
    
    try {
        if (ext === '.jpg' || ext === '.jpeg') {
            await sharp(filePath)
                .jpeg(imageConfig.jpeg)
                .toFile(tempPath);
        } else if (ext === '.png') {
            await sharp(filePath)
                .png(imageConfig.png)
                .toFile(tempPath);
        } else {
            return; // 不支持的格式
        }
        
        const originalSize = fs.statSync(filePath).size;
        const optimizedSize = fs.statSync(tempPath).size;
        
        if (optimizedSize < originalSize) {
            fs.renameSync(tempPath, filePath);
            const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
            console.log(`⚡ 优化: ${fileName} (节省 ${savings}%)`);
        } else {
            fs.unlinkSync(tempPath);
        }
    } catch (error) {
        if (fs.existsSync(tempPath)) {
            fs.unlinkSync(tempPath);
        }
        throw error;
    }
}

// 运行优化
if (require.main === module) {
    optimizeImages().catch(console.error);
}

module.exports = { optimizeImages };
