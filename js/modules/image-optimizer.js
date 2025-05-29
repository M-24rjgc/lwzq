/**
 * 图片优化模块
 * 包含懒加载、WebP支持、响应式图片等功能
 */

class ImageOptimizer {
    constructor() {
        this.observer = null;
        this.supportsWebP = false;
        this.resourceIndex = null;
        this.loadedImages = new Set();
        this.preloadedImages = new Set();
    }

    /**
     * 初始化图片优化器
     */
    async init() {
        try {
            // 检测WebP支持
            await this.detectWebPSupport();
            
            // 加载资源索引
            await this.loadResourceIndex();
            
            // 预加载关键图片
            this.preloadCriticalImages();
            
            // 初始化懒加载
            this.initLazyLoading();
            
            // 设置响应式图片
            this.setupResponsiveImages();
            
            console.log('🖼️ 图片优化器初始化完成');
        } catch (error) {
            console.error('❌ 图片优化器初始化失败:', error);
        }
    }

    /**
     * 检测WebP支持
     */
    async detectWebPSupport() {
        return new Promise((resolve) => {
            const webP = new Image();
            webP.onload = webP.onerror = () => {
                this.supportsWebP = (webP.height === 2);
                console.log(`WebP支持: ${this.supportsWebP ? '✅' : '❌'}`);
                resolve(this.supportsWebP);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }

    /**
     * 加载资源索引
     */
    async loadResourceIndex() {
        try {
            const response = await fetch('/assets/resource-index.json');
            this.resourceIndex = await response.json();
        } catch (error) {
            console.warn('⚠️ 无法加载资源索引，使用默认配置');
            this.resourceIndex = { images: {}, preloadImages: [], lazyLoadImages: [] };
        }
    }

    /**
     * 预加载关键图片
     */
    preloadCriticalImages() {
        if (!this.resourceIndex?.preloadImages) return;

        this.resourceIndex.preloadImages.forEach(imagePath => {
            this.preloadImage(imagePath);
        });
    }

    /**
     * 预加载单张图片
     */
    preloadImage(src) {
        if (this.preloadedImages.has(src)) return;

        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        
        // 如果支持WebP，优先预加载WebP版本
        if (this.supportsWebP && src.includes('.jpg') || src.includes('.png')) {
            const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
            link.href = webpSrc;
        }
        
        document.head.appendChild(link);
        this.preloadedImages.add(src);
    }

    /**
     * 初始化懒加载
     */
    initLazyLoading() {
        // 创建Intersection Observer
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px 0px', // 提前50px开始加载
            threshold: 0.01
        });

        // 观察所有懒加载图片
        this.observeLazyImages();
    }

    /**
     * 观察懒加载图片
     */
    observeLazyImages() {
        const lazyImages = document.querySelectorAll('img[data-src], img[loading="lazy"]');
        
        lazyImages.forEach(img => {
            // 设置占位符
            if (!img.src && !img.dataset.src) {
                img.src = this.generatePlaceholder(img);
            }
            
            this.observer.observe(img);
        });
    }

    /**
     * 加载图片
     */
    async loadImage(img) {
        const src = img.dataset.src || img.src;
        if (!src || this.loadedImages.has(src)) return;

        try {
            // 获取最优图片源
            const optimizedSrc = this.getOptimizedImageSrc(src);
            
            // 创建新图片对象进行预加载
            const newImg = new Image();
            
            // 设置加载状态
            img.classList.add('loading');
            
            await new Promise((resolve, reject) => {
                newImg.onload = resolve;
                newImg.onerror = reject;
                newImg.src = optimizedSrc;
            });

            // 应用图片
            img.src = optimizedSrc;
            img.classList.remove('loading');
            img.classList.add('loaded');
            
            // 移除data-src属性
            if (img.dataset.src) {
                delete img.dataset.src;
            }
            
            this.loadedImages.add(src);
            
            // 触发自定义事件
            img.dispatchEvent(new CustomEvent('imageLoaded', {
                detail: { originalSrc: src, optimizedSrc }
            }));
            
        } catch (error) {
            console.error('图片加载失败:', src, error);
            img.classList.remove('loading');
            img.classList.add('error');
            
            // 设置错误占位符
            img.src = this.generateErrorPlaceholder();
        }
    }

    /**
     * 获取优化后的图片源
     */
    getOptimizedImageSrc(src) {
        // 如果支持WebP，尝试使用WebP版本
        if (this.supportsWebP) {
            const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
            return webpSrc;
        }
        
        return src;
    }

    /**
     * 生成占位符
     */
    generatePlaceholder(img) {
        const width = img.getAttribute('width') || 400;
        const height = img.getAttribute('height') || 300;
        
        // 生成SVG占位符
        const svg = `
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#f3f4f6"/>
                <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="sans-serif" font-size="14">
                    加载中...
                </text>
            </svg>
        `;
        
        return `data:image/svg+xml;base64,${btoa(svg)}`;
    }

    /**
     * 生成错误占位符
     */
    generateErrorPlaceholder() {
        const svg = `
            <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#fee2e2"/>
                <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#dc2626" font-family="sans-serif" font-size="14">
                    图片加载失败
                </text>
            </svg>
        `;
        
        return `data:image/svg+xml;base64,${btoa(svg)}`;
    }

    /**
     * 设置响应式图片
     */
    setupResponsiveImages() {
        const responsiveImages = document.querySelectorAll('img[data-responsive]');
        
        responsiveImages.forEach(img => {
            this.makeImageResponsive(img);
        });
    }

    /**
     * 使图片响应式
     */
    makeImageResponsive(img) {
        const baseSrc = img.src || img.dataset.src;
        if (!baseSrc) return;

        // 生成不同尺寸的srcset
        const srcset = this.generateSrcSet(baseSrc);
        const sizes = this.generateSizes(img);
        
        if (srcset) {
            img.srcset = srcset;
        }
        
        if (sizes) {
            img.sizes = sizes;
        }
    }

    /**
     * 生成srcset
     */
    generateSrcSet(baseSrc) {
        const sizes = [400, 800, 1200, 1600];
        const ext = baseSrc.split('.').pop();
        const baseName = baseSrc.replace(`.${ext}`, '');
        
        const srcsetArray = sizes.map(size => {
            const src = `${baseName}-${size}w.${this.supportsWebP ? 'webp' : ext}`;
            return `${src} ${size}w`;
        });
        
        return srcsetArray.join(', ');
    }

    /**
     * 生成sizes属性
     */
    generateSizes(img) {
        // 根据图片的用途生成合适的sizes
        if (img.classList.contains('hero-image')) {
            return '100vw';
        } else if (img.classList.contains('feature-image')) {
            return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
        } else if (img.classList.contains('thumbnail')) {
            return '(max-width: 768px) 50vw, 25vw';
        }
        
        return '(max-width: 768px) 100vw, 50vw';
    }

    /**
     * 手动触发图片加载
     */
    loadImageNow(selector) {
        const img = document.querySelector(selector);
        if (img && this.observer) {
            this.loadImage(img);
            this.observer.unobserve(img);
        }
    }

    /**
     * 获取图片加载统计
     */
    getLoadingStats() {
        return {
            totalLoaded: this.loadedImages.size,
            totalPreloaded: this.preloadedImages.size,
            supportsWebP: this.supportsWebP
        };
    }

    /**
     * 销毁优化器
     */
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        
        this.loadedImages.clear();
        this.preloadedImages.clear();
    }
}

// 导出单例实例
export default new ImageOptimizer();
