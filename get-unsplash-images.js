/**
 * 获取Unsplash高质量图片的脚本
 * 为灵维智驱科技网站获取合适的图片资源
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Unsplash API配置
const UNSPLASH_ACCESS_KEY = 'EhOjxt7ld5OCWPqfPqBha8eTg1B7xTeoR0z-ESFBY0s';
const BASE_URL = 'https://api.unsplash.com';

// 图片搜索关键词和对应的文件名
const imageQueries = [
    {
        query: 'running shoes technology',
        filename: 'hero-running-tech.jpg',
        description: '主页Hero区域背景图'
    },
    {
        query: 'sports analytics data visualization',
        filename: 'data-analytics.jpg',
        description: '数据分析展示图'
    },
    {
        query: 'smart insole technology',
        filename: 'smart-insole.jpg',
        description: '智能鞋垫产品图'
    },
    {
        query: 'gait analysis biomechanics',
        filename: 'gait-analysis.jpg',
        description: '步态分析功能图'
    },
    {
        query: 'real time coaching sports',
        filename: 'realtime-guidance.jpg',
        description: '实时指导功能图'
    },
    {
        query: 'data visualization dashboard',
        filename: 'visualization.jpg',
        description: '可视化分析图'
    },
    {
        query: 'personalized training plan',
        filename: 'training-plan.jpg',
        description: '个性化训练方案图'
    },
    {
        query: 'sports community social',
        filename: 'data-community.jpg',
        description: '数据管理与社群图'
    },
    {
        query: 'team collaboration technology',
        filename: 'team-collaboration.jpg',
        description: '团队协作图'
    },
    {
        query: 'modern office workspace',
        filename: 'office-workspace.jpg',
        description: '办公环境图'
    }
];

/**
 * 从Unsplash搜索图片
 */
async function searchUnsplashImage(query, orientation = 'landscape') {
    return new Promise((resolve, reject) => {
        const url = `${BASE_URL}/search/photos?query=${encodeURIComponent(query)}&orientation=${orientation}&per_page=1&order_by=relevant`;
        
        const options = {
            headers: {
                'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
                'User-Agent': 'LingWei-Tech-Website/1.0'
            }
        };

        https.get(url, options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    if (result.results && result.results.length > 0) {
                        const photo = result.results[0];
                        resolve({
                            id: photo.id,
                            url: photo.urls.regular,
                            downloadUrl: photo.urls.full,
                            description: photo.description || photo.alt_description,
                            photographer: photo.user.name,
                            photographerUrl: photo.user.links.html,
                            unsplashUrl: photo.links.html
                        });
                    } else {
                        reject(new Error(`No images found for query: ${query}`));
                    }
                } catch (error) {
                    reject(error);
                }
            });
        }).on('error', reject);
    });
}

/**
 * 下载图片到本地
 */
async function downloadImage(imageUrl, filename) {
    return new Promise((resolve, reject) => {
        const filePath = path.join('./images', filename);
        const file = fs.createWriteStream(filePath);
        
        https.get(imageUrl, (response) => {
            response.pipe(file);
            
            file.on('finish', () => {
                file.close();
                console.log(`✅ 下载完成: ${filename}`);
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
 * 生成图片信息文档
 */
function generateImageInfo(imageData, query, filename) {
    return `
## ${query.description}
- **文件名**: ${filename}
- **搜索关键词**: ${query.query}
- **描述**: ${imageData.description || '无描述'}
- **摄影师**: [${imageData.photographer}](${imageData.photographerUrl})
- **Unsplash链接**: [查看原图](${imageData.unsplashUrl})
- **图片ID**: ${imageData.id}

`;
}

/**
 * 主函数
 */
async function main() {
    console.log('🎨 开始获取Unsplash高质量图片...\n');
    
    // 确保images目录存在
    if (!fs.existsSync('./images')) {
        fs.mkdirSync('./images');
    }
    
    let imageInfoDoc = '# 网站图片资源信息\n\n';
    imageInfoDoc += '> 所有图片均来自Unsplash，遵循Unsplash License\n\n';
    
    for (const query of imageQueries) {
        try {
            console.log(`🔍 搜索: ${query.query}`);
            const imageData = await searchUnsplashImage(query.query);
            
            console.log(`📥 下载: ${query.filename}`);
            await downloadImage(imageData.downloadUrl, query.filename);
            
            // 添加到文档
            imageInfoDoc += generateImageInfo(imageData, query, query.filename);
            
            // 避免API限制，添加延迟
            await new Promise(resolve => setTimeout(resolve, 1000));
            
        } catch (error) {
            console.error(`❌ 处理 ${query.query} 时出错:`, error.message);
        }
    }
    
    // 保存图片信息文档
    fs.writeFileSync('./images/图片资源信息.md', imageInfoDoc);
    
    console.log('\n🎉 图片获取完成！');
    console.log('📄 图片信息已保存到: ./images/图片资源信息.md');
}

// 运行脚本
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { searchUnsplashImage, downloadImage };
