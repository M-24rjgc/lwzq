/**
 * 下载AI生成图片的脚本
 * 为灵维智驱科技网站下载通义万象生成的高质量图片
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// AI生成图片配置
const aiGeneratedImages = [
    {
        filename: 'smart-insole-product.png',
        url: 'https://dashscope-result-wlcb-acdr-1.oss-cn-wulanchabu-acdr-1.aliyuncs.com/1d/79/20250527/8928fb36/8d0e79d4-901b-42e0-b2a1-5b5dbc2261bb2650493716.png?Expires=1748367989&OSSAccessKeyId=LTAI5tKPD3TMqf2Lna1fASuh&Signature=CKH7kw8wATGBWqUvOd5EtUenCiM%3D',
        description: 'Professional smart insole product photography',
        usage: '替换主页产品展示图，用于产品概览区域'
    },
    {
        filename: 'st-fusionnet-architecture-new.png',
        url: 'https://dashscope-result-wlcb-acdr-1.oss-cn-wulanchabu-acdr-1.aliyuncs.com/1d/0f/20250527/8928fb36/6011fca0-f41a-4e7e-8f8f-e4f88fc314351142171387.png?Expires=1748367997&OSSAccessKeyId=LTAI5tKPD3TMqf2Lna1fASuh&Signature=oWyd8IlaQg5ZGX2CdQwJacJB8UM%3D',
        description: 'ST-FusionNet AI model architecture diagram',
        usage: '用于技术页面架构展示，替换现有的SVG架构图'
    },
    {
        filename: 'runner-using-smart-insole.png',
        url: 'https://dashscope-result-wlcb-acdr-1.oss-cn-wulanchabu-acdr-1.aliyuncs.com/1d/84/20250527/8928fb36/bcc3a59f-dcaa-4647-944c-ce3519c3c0b71270262051.png?Expires=1748368010&OSSAccessKeyId=LTAI5tKPD3TMqf2Lna1fASuh&Signature=twvIdTtzWrob0CuW9Z7%2FQDwxycQ%3D',
        description: 'Professional runner using smart insole technology',
        usage: '用于产品使用场景展示，可用于主页hero区域或产品页面'
    }
];

/**
 * 下载图片到本地
 */
async function downloadImage(imageUrl, filename) {
    return new Promise((resolve, reject) => {
        const filePath = path.join('./images', filename);
        const file = fs.createWriteStream(filePath);
        
        console.log(`📥 正在下载: ${filename}`);
        console.log(`   URL: ${imageUrl.substring(0, 100)}...`);
        
        https.get(imageUrl, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
                return;
            }
            
            response.pipe(file);
            
            file.on('finish', () => {
                file.close();
                console.log(`✅ ${filename} 下载完成`);
                resolve(filePath);
            });
            
            file.on('error', (err) => {
                fs.unlink(filePath, () => {}); // 删除部分下载的文件
                reject(err);
            });
        }).on('error', reject);
    });
}

/**
 * 生成AI图片信息文档
 */
function generateAIImageInfo() {
    let doc = '\n---\n\n## AI生成图片资源\n\n';
    doc += '> 使用通义万象MCP工具生成的专业级图片\n\n';
    
    aiGeneratedImages.forEach(image => {
        doc += `### ${image.filename}\n`;
        doc += `- **文件名**: ${image.filename}\n`;
        doc += `- **描述**: ${image.description}\n`;
        doc += `- **用途**: ${image.usage}\n`;
        doc += `- **生成工具**: 通义万象MCP\n\n`;
    });
    
    return doc;
}

/**
 * 主函数
 */
async function main() {
    console.log('🤖 开始下载AI生成图片...\n');
    
    // 确保images目录存在
    if (!fs.existsSync('./images')) {
        fs.mkdirSync('./images');
    }
    
    let successCount = 0;
    let failCount = 0;
    
    for (const image of aiGeneratedImages) {
        try {
            await downloadImage(image.url, image.filename);
            successCount++;
            
            // 添加延迟避免请求过快
            await new Promise(resolve => setTimeout(resolve, 500));
            
        } catch (error) {
            console.error(`❌ ${image.filename} 下载失败:`, error.message);
            failCount++;
        }
    }
    
    // 更新图片资源信息文档
    try {
        const existingDoc = fs.readFileSync('./images/图片资源信息.md', 'utf8');
        const aiImageInfo = generateAIImageInfo();
        const updatedDoc = existingDoc + aiImageInfo;
        fs.writeFileSync('./images/图片资源信息.md', updatedDoc);
        console.log('\n📄 图片信息已更新到: ./images/图片资源信息.md');
    } catch (error) {
        console.log('\n⚠️  无法更新图片信息文档，请手动添加AI图片信息');
    }
    
    console.log('\n🎉 AI图片下载完成！');
    console.log(`✅ 成功: ${successCount} 张`);
    console.log(`❌ 失败: ${failCount} 张`);
    
    if (successCount > 0) {
        console.log('\n📋 使用建议：');
        console.log('1. smart-insole-product.png - 替换主页产品展示图');
        console.log('2. st-fusionnet-architecture-new.png - 用于技术页面架构展示');
        console.log('3. runner-using-smart-insole.png - 用于产品使用场景展示');
        console.log('\n💡 接下来可以更新HTML文件中的图片引用路径');
    }
}

// 运行脚本
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { downloadImage, aiGeneratedImages };
