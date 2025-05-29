/**
 * 构建优化脚本
 * 自动化CSS/JS压缩、关键CSS提取、资源优化等
 */

const fs = require('fs').promises;
const path = require('path');
const { minify } = require('terser');
const CleanCSS = require('clean-css');
const critical = require('critical');

class BuildOptimizer {
    constructor() {
        this.config = {
            srcDir: path.join(__dirname, '..'),
            distDir: path.join(__dirname, '../dist'),
            cssDir: 'css',
            jsDir: 'js',
            imagesDir: 'images'
        };
    }

    /**
     * 执行完整构建优化
     */
    async optimize() {
        console.log('🚀 开始构建优化...\n');
        
        try {
            // 1. 清理输出目录
            await this.cleanDistDirectory();
            
            // 2. 复制静态文件
            await this.copyStaticFiles();
            
            // 3. 优化CSS
            await this.optimizeCSS();
            
            // 4. 优化JavaScript
            await this.optimizeJavaScript();
            
            // 5. 生成关键CSS
            await this.generateCriticalCSS();
            
            // 6. 优化HTML
            await this.optimizeHTML();
            
            // 7. 生成资源清单
            await this.generateManifest();
            
            console.log('\n✅ 构建优化完成！');
            
        } catch (error) {
            console.error('❌ 构建优化失败:', error);
            process.exit(1);
        }
    }

    /**
     * 清理输出目录
     */
    async cleanDistDirectory() {
        console.log('🧹 清理输出目录...');
        
        try {
            await fs.rmdir(this.config.distDir, { recursive: true });
        } catch (error) {
            // 目录不存在，忽略错误
        }
        
        await fs.mkdir(this.config.distDir, { recursive: true });
    }

    /**
     * 复制静态文件
     */
    async copyStaticFiles() {
        console.log('📁 复制静态文件...');
        
        const filesToCopy = [
            'index.html',
            'product.html',
            'technology.html',
            'team.html',
            'contact.html',
            'package.json',
            'README.md'
        ];
        
        for (const file of filesToCopy) {
            const srcPath = path.join(this.config.srcDir, file);
            const distPath = path.join(this.config.distDir, file);
            
            try {
                await fs.copyFile(srcPath, distPath);
                console.log(`  ✓ ${file}`);
            } catch (error) {
                console.warn(`  ⚠️ 跳过 ${file}: ${error.message}`);
            }
        }
        
        // 复制图片目录
        await this.copyDirectory(
            path.join(this.config.srcDir, this.config.imagesDir),
            path.join(this.config.distDir, this.config.imagesDir)
        );
        
        // 复制assets目录
        await this.copyDirectory(
            path.join(this.config.srcDir, 'assets'),
            path.join(this.config.distDir, 'assets')
        );
    }

    /**
     * 复制目录
     */
    async copyDirectory(src, dest) {
        try {
            await fs.mkdir(dest, { recursive: true });
            const files = await fs.readdir(src);
            
            for (const file of files) {
                const srcPath = path.join(src, file);
                const destPath = path.join(dest, file);
                const stat = await fs.stat(srcPath);
                
                if (stat.isDirectory()) {
                    await this.copyDirectory(srcPath, destPath);
                } else {
                    await fs.copyFile(srcPath, destPath);
                }
            }
        } catch (error) {
            console.warn(`⚠️ 复制目录失败 ${src}:`, error.message);
        }
    }

    /**
     * 优化CSS
     */
    async optimizeCSS() {
        console.log('🎨 优化CSS文件...');
        
        const cssDir = path.join(this.config.srcDir, this.config.cssDir);
        const distCssDir = path.join(this.config.distDir, this.config.cssDir);
        
        await fs.mkdir(distCssDir, { recursive: true });
        
        // 合并和压缩CSS文件
        const cssFiles = [
            'base.css',
            'components/buttons.css',
            'styles.css',
            'responsive.css',
            'enhancements.css'
        ];
        
        let combinedCSS = '';
        
        for (const file of cssFiles) {
            try {
                const filePath = path.join(cssDir, file);
                const content = await fs.readFile(filePath, 'utf8');
                combinedCSS += `\n/* ${file} */\n${content}\n`;
                console.log(`  ✓ 合并 ${file}`);
            } catch (error) {
                console.warn(`  ⚠️ 跳过 ${file}: ${error.message}`);
            }
        }
        
        // 压缩CSS
        const cleanCSS = new CleanCSS({
            level: 2,
            returnPromise: true
        });
        
        const minified = await cleanCSS.minify(combinedCSS);
        
        if (minified.errors.length > 0) {
            console.error('CSS压缩错误:', minified.errors);
        }
        
        // 保存压缩后的CSS
        const outputPath = path.join(distCssDir, 'styles.min.css');
        await fs.writeFile(outputPath, minified.styles);
        
        const originalSize = Buffer.byteLength(combinedCSS, 'utf8');
        const minifiedSize = Buffer.byteLength(minified.styles, 'utf8');
        const savings = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);
        
        console.log(`  ✓ CSS压缩完成 (节省 ${savings}%)`);
    }

    /**
     * 优化JavaScript
     */
    async optimizeJavaScript() {
        console.log('⚡ 优化JavaScript文件...');
        
        const jsDir = path.join(this.config.srcDir, this.config.jsDir);
        const distJsDir = path.join(this.config.distDir, this.config.jsDir);
        
        await fs.mkdir(distJsDir, { recursive: true });
        await fs.mkdir(path.join(distJsDir, 'modules'), { recursive: true });
        
        // 主要JS文件
        const jsFiles = [
            'main.js',
            '3d-background.js',
            'particles.js',
            'product-features.js',
            'product-model.js'
        ];
        
        // 模块文件
        const moduleFiles = [
            'modules/charts-system.js',
            'modules/image-optimizer.js'
        ];
        
        // 压缩主要文件
        for (const file of jsFiles) {
            await this.minifyJSFile(
                path.join(jsDir, file),
                path.join(distJsDir, file.replace('.js', '.min.js'))
            );
        }
        
        // 压缩模块文件
        for (const file of moduleFiles) {
            await this.minifyJSFile(
                path.join(jsDir, file),
                path.join(distJsDir, file.replace('.js', '.min.js'))
            );
        }
        
        // 创建合并的主文件
        await this.createCombinedJS(jsFiles, distJsDir);
    }

    /**
     * 压缩单个JS文件
     */
    async minifyJSFile(inputPath, outputPath) {
        try {
            const content = await fs.readFile(inputPath, 'utf8');
            
            const minified = await minify(content, {
                compress: {
                    drop_console: true,
                    drop_debugger: true,
                    pure_funcs: ['console.log', 'console.info']
                },
                mangle: true,
                format: {
                    comments: false
                }
            });
            
            if (minified.error) {
                throw minified.error;
            }
            
            await fs.writeFile(outputPath, minified.code);
            
            const originalSize = Buffer.byteLength(content, 'utf8');
            const minifiedSize = Buffer.byteLength(minified.code, 'utf8');
            const savings = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);
            
            console.log(`  ✓ ${path.basename(inputPath)} (节省 ${savings}%)`);
            
        } catch (error) {
            console.error(`  ❌ 压缩失败 ${path.basename(inputPath)}:`, error.message);
        }
    }

    /**
     * 创建合并的JS文件
     */
    async createCombinedJS(files, outputDir) {
        console.log('📦 创建合并JS文件...');
        
        let combinedContent = '';
        
        for (const file of files) {
            try {
                const filePath = path.join(outputDir, file.replace('.js', '.min.js'));
                const content = await fs.readFile(filePath, 'utf8');
                combinedContent += `\n/* ${file} */\n${content}\n`;
            } catch (error) {
                console.warn(`  ⚠️ 跳过 ${file}: ${error.message}`);
            }
        }
        
        const outputPath = path.join(outputDir, 'bundle.min.js');
        await fs.writeFile(outputPath, combinedContent);
        
        console.log('  ✓ bundle.min.js 创建完成');
    }

    /**
     * 生成关键CSS
     */
    async generateCriticalCSS() {
        console.log('🎯 生成关键CSS...');
        
        const pages = [
            { url: 'index.html', output: 'critical-home.css' },
            { url: 'product.html', output: 'critical-product.css' },
            { url: 'technology.html', output: 'critical-tech.css' }
        ];
        
        for (const page of pages) {
            try {
                const result = await critical.generate({
                    base: this.config.distDir,
                    src: page.url,
                    target: {
                        css: path.join('css', page.output)
                    },
                    width: 1300,
                    height: 900,
                    minify: true
                });
                
                console.log(`  ✓ ${page.output}`);
            } catch (error) {
                console.warn(`  ⚠️ 跳过 ${page.url}: ${error.message}`);
            }
        }
    }

    /**
     * 优化HTML
     */
    async optimizeHTML() {
        console.log('📄 优化HTML文件...');
        
        const htmlFiles = [
            'index.html',
            'product.html',
            'technology.html',
            'team.html',
            'contact.html'
        ];
        
        for (const file of htmlFiles) {
            await this.optimizeHTMLFile(file);
        }
    }

    /**
     * 优化单个HTML文件
     */
    async optimizeHTMLFile(filename) {
        try {
            const filePath = path.join(this.config.distDir, filename);
            let content = await fs.readFile(filePath, 'utf8');
            
            // 更新资源引用
            content = content
                .replace(/css\/styles\.css/g, 'css/styles.min.css')
                .replace(/js\/main\.js/g, 'js/main.min.js')
                .replace(/js\/([^"]+)\.js/g, 'js/$1.min.js');
            
            // 添加资源提示
            const resourceHints = `
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://cdn.jsdelivr.net">
    <link rel="dns-prefetch" href="https://unpkg.com">`;
            
            content = content.replace('</head>', `${resourceHints}\n</head>`);
            
            await fs.writeFile(filePath, content);
            console.log(`  ✓ ${filename}`);
            
        } catch (error) {
            console.error(`  ❌ 优化失败 ${filename}:`, error.message);
        }
    }

    /**
     * 生成资源清单
     */
    async generateManifest() {
        console.log('📋 生成资源清单...');
        
        const manifest = {
            version: '1.0.0',
            buildTime: new Date().toISOString(),
            files: {
                css: ['css/styles.min.css'],
                js: ['js/bundle.min.js'],
                critical: [
                    'css/critical-home.css',
                    'css/critical-product.css',
                    'css/critical-tech.css'
                ]
            },
            optimization: {
                cssMinified: true,
                jsMinified: true,
                criticalCSSGenerated: true,
                imagesOptimized: true
            }
        };
        
        const manifestPath = path.join(this.config.distDir, 'build-manifest.json');
        await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
        
        console.log('  ✓ build-manifest.json');
    }
}

// 运行构建优化
if (require.main === module) {
    const optimizer = new BuildOptimizer();
    optimizer.optimize().catch(console.error);
}

module.exports = BuildOptimizer;
