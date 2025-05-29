/**
 * SEO增强模块
 * 动态生成结构化数据、优化元信息、提升搜索引擎可见性
 */

class SEOEnhancer {
    constructor() {
        this.structuredData = new Map();
        this.metaTags = new Map();
        this.isInitialized = false;
    }

    /**
     * 初始化SEO增强器
     */
    init() {
        if (this.isInitialized) return;

        try {
            // 生成结构化数据
            this.generateStructuredData();
            
            // 优化元信息
            this.optimizeMetaTags();
            
            // 添加Open Graph标签
            this.addOpenGraphTags();
            
            // 添加Twitter Card标签
            this.addTwitterCardTags();
            
            // 生成面包屑导航
            this.generateBreadcrumbs();
            
            // 添加JSON-LD结构化数据
            this.injectStructuredData();
            
            this.isInitialized = true;
            console.log('🔍 SEO增强器初始化完成');
        } catch (error) {
            console.error('❌ SEO增强器初始化失败:', error);
        }
    }

    /**
     * 生成结构化数据
     */
    generateStructuredData() {
        const currentPage = this.getCurrentPageType();
        
        switch (currentPage) {
            case 'home':
                this.generateOrganizationSchema();
                this.generateProductSchema();
                break;
            case 'product':
                this.generateProductDetailSchema();
                this.generateFAQSchema();
                break;
            case 'technology':
                this.generateTechnologySchema();
                break;
            case 'team':
                this.generateTeamSchema();
                break;
            case 'contact':
                this.generateContactSchema();
                break;
        }
    }

    /**
     * 获取当前页面类型
     */
    getCurrentPageType() {
        const path = window.location.pathname;
        
        if (path.includes('product')) return 'product';
        if (path.includes('technology')) return 'technology';
        if (path.includes('team')) return 'team';
        if (path.includes('contact')) return 'contact';
        return 'home';
    }

    /**
     * 生成组织结构化数据
     */
    generateOrganizationSchema() {
        const schema = {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "灵维智驱科技有限公司",
            "alternateName": "步态精灵",
            "url": "https://gait-spirit.com",
            "logo": "https://gait-spirit.com/images/logo.png",
            "description": "专业的智能跑步姿态分析系统开发商，致力于运动科技创新",
            "foundingDate": "2024",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "金明大道灵维科技园 A座 3层",
                "addressLocality": "开封市",
                "addressRegion": "河南省",
                "addressCountry": "CN"
            },
            "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "availableLanguage": "Chinese"
            },
            "sameAs": [
                "https://weibo.com/gaitspirit",
                "https://www.linkedin.com/company/gaitspirit"
            ]
        };
        
        this.structuredData.set('organization', schema);
    }

    /**
     * 生成产品结构化数据
     */
    generateProductSchema() {
        const schema = {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "步态精灵智能跑步姿态分析系统",
            "description": "基于多传感器融合技术的专业级智能跑步姿态分析系统，提供实时步态监测、个性化训练建议和运动数据分析",
            "brand": {
                "@type": "Brand",
                "name": "步态精灵"
            },
            "manufacturer": {
                "@type": "Organization",
                "name": "灵维智驱科技有限公司"
            },
            "category": "运动科技产品",
            "offers": {
                "@type": "Offer",
                "availability": "https://schema.org/InStock",
                "priceCurrency": "CNY"
            },
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "156",
                "bestRating": "5",
                "worstRating": "1"
            },
            "features": [
                "92.3%步态识别准确率",
                "实时数据分析",
                "个性化训练建议",
                "多传感器融合技术"
            ]
        };
        
        this.structuredData.set('product', schema);
    }

    /**
     * 生成FAQ结构化数据
     */
    generateFAQSchema() {
        const faqs = [
            {
                question: "步态精灵的准确率如何？",
                answer: "步态精灵采用ST-FusionNet算法，核心跑姿问题识别准确率达到92.3%，在同类产品中处于领先水平。"
            },
            {
                question: "产品适合哪些用户群体？",
                answer: "适合专业运动员、业余跑者、康复训练患者以及体育科研机构使用。"
            },
            {
                question: "如何获得技术支持？",
                answer: "您可以通过官网联系表单、客服热线或邮件获得专业技术支持。"
            }
        ];
        
        const schema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer
                }
            }))
        };
        
        this.structuredData.set('faq', schema);
    }

    /**
     * 生成技术结构化数据
     */
    generateTechnologySchema() {
        const schema = {
            "@context": "https://schema.org",
            "@type": "TechArticle",
            "headline": "ST-FusionNet：时空融合神经网络技术",
            "description": "基于多模态数据融合的创新AI算法，实现高精度步态分析",
            "author": {
                "@type": "Organization",
                "name": "灵维智驱科技有限公司"
            },
            "datePublished": "2024-01-01",
            "dateModified": "2025-01-28",
            "keywords": ["人工智能", "步态分析", "神经网络", "多传感器融合"],
            "about": {
                "@type": "Thing",
                "name": "步态分析技术"
            }
        };
        
        this.structuredData.set('technology', schema);
    }

    /**
     * 生成团队结构化数据
     */
    generateTeamSchema() {
        const team = [
            {
                name: "杨晓慧",
                jobTitle: "AI与算法顾问",
                affiliation: "河南大学"
            },
            {
                name: "刘海涛",
                jobTitle: "智能硬件与生物力学顾问",
                affiliation: "河南大学体育学院"
            },
            {
                name: "梁胜彬",
                jobTitle: "软件工程与大数据顾问",
                affiliation: "河南大学软件学院"
            }
        ];
        
        const schema = {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "mainEntity": {
                "@type": "Organization",
                "name": "灵维智驱科技有限公司",
                "employee": team.map(member => ({
                    "@type": "Person",
                    "name": member.name,
                    "jobTitle": member.jobTitle,
                    "worksFor": {
                        "@type": "Organization",
                        "name": member.affiliation
                    }
                }))
            }
        };
        
        this.structuredData.set('team', schema);
    }

    /**
     * 生成联系页面结构化数据
     */
    generateContactSchema() {
        const schema = {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "mainEntity": {
                "@type": "Organization",
                "name": "灵维智驱科技有限公司",
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "金明大道灵维科技园 A座 3层",
                    "addressLocality": "开封市",
                    "addressRegion": "河南省",
                    "postalCode": "475004",
                    "addressCountry": "CN"
                },
                "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": "34.808166",
                    "longitude": "114.303356"
                }
            }
        };
        
        this.structuredData.set('contact', schema);
    }

    /**
     * 优化元信息标签
     */
    optimizeMetaTags() {
        const pageData = this.getPageMetaData();
        
        // 设置基础meta标签
        this.setMetaTag('description', pageData.description);
        this.setMetaTag('keywords', pageData.keywords);
        this.setMetaTag('author', '灵维智驱科技有限公司');
        this.setMetaTag('robots', 'index, follow');
        this.setMetaTag('viewport', 'width=device-width, initial-scale=1.0');
        
        // 设置页面标题
        if (pageData.title) {
            document.title = pageData.title;
        }
    }

    /**
     * 获取页面元数据
     */
    getPageMetaData() {
        const currentPage = this.getCurrentPageType();
        
        const pageData = {
            home: {
                title: '步态精灵 - 智能跑步姿态分析系统 | 灵维智驱科技',
                description: '步态精灵是专业的智能跑步姿态分析系统，采用ST-FusionNet算法，92.3%识别准确率，提供实时步态监测和个性化训练建议。',
                keywords: '步态分析,智能跑步,姿态识别,运动科技,AI算法,传感器,训练指导'
            },
            product: {
                title: '产品介绍 - 步态精灵智能跑步姿态分析系统',
                description: '了解步态精灵的核心功能：实时步态监测、智能分析、个性化建议。多传感器融合技术，专业级运动数据分析。',
                keywords: '产品功能,步态监测,运动分析,智能鞋垫,传感器技术,数据可视化'
            },
            technology: {
                title: '技术研发 - ST-FusionNet算法与边缘云协同架构',
                description: '深入了解步态精灵的核心技术：ST-FusionNet时空融合神经网络、多模态数据融合、边缘云协同计算架构。',
                keywords: '人工智能,神经网络,算法研发,边缘计算,数据融合,技术创新'
            },
            team: {
                title: '团队介绍 - 专业的运动科技研发团队',
                description: '灵维智驱科技拥有资深的AI算法、生物力学、软件工程专家团队，致力于运动科技创新。',
                keywords: '研发团队,AI专家,生物力学,软件工程,学术顾问,技术实力'
            },
            contact: {
                title: '联系我们 - 步态精灵技术支持与商务合作',
                description: '联系灵维智驱科技，获得步态精灵产品技术支持、商务合作、学术交流等服务。河南省开封市。',
                keywords: '联系方式,技术支持,商务合作,客户服务,公司地址,开封'
            }
        };
        
        return pageData[currentPage] || pageData.home;
    }

    /**
     * 设置meta标签
     */
    setMetaTag(name, content) {
        let meta = document.querySelector(`meta[name="${name}"]`);
        
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = name;
            document.head.appendChild(meta);
        }
        
        meta.content = content;
        this.metaTags.set(name, content);
    }

    /**
     * 添加Open Graph标签
     */
    addOpenGraphTags() {
        const pageData = this.getPageMetaData();
        
        const ogTags = {
            'og:type': 'website',
            'og:title': pageData.title,
            'og:description': pageData.description,
            'og:url': window.location.href,
            'og:site_name': '步态精灵',
            'og:image': 'https://gait-spirit.com/images/og-image.jpg',
            'og:image:width': '1200',
            'og:image:height': '630',
            'og:locale': 'zh_CN'
        };
        
        Object.entries(ogTags).forEach(([property, content]) => {
            this.setOGTag(property, content);
        });
    }

    /**
     * 设置Open Graph标签
     */
    setOGTag(property, content) {
        let meta = document.querySelector(`meta[property="${property}"]`);
        
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('property', property);
            document.head.appendChild(meta);
        }
        
        meta.content = content;
    }

    /**
     * 添加Twitter Card标签
     */
    addTwitterCardTags() {
        const pageData = this.getPageMetaData();
        
        const twitterTags = {
            'twitter:card': 'summary_large_image',
            'twitter:title': pageData.title,
            'twitter:description': pageData.description,
            'twitter:image': 'https://gait-spirit.com/images/twitter-card.jpg'
        };
        
        Object.entries(twitterTags).forEach(([name, content]) => {
            this.setTwitterTag(name, content);
        });
    }

    /**
     * 设置Twitter标签
     */
    setTwitterTag(name, content) {
        let meta = document.querySelector(`meta[name="${name}"]`);
        
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = name;
            document.head.appendChild(meta);
        }
        
        meta.content = content;
    }

    /**
     * 生成面包屑导航
     */
    generateBreadcrumbs() {
        const breadcrumbContainer = document.querySelector('.breadcrumb');
        if (!breadcrumbContainer) return;
        
        const path = window.location.pathname;
        const breadcrumbs = this.getBreadcrumbData(path);
        
        const breadcrumbSchema = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbs.map((item, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": item.name,
                "item": item.url
            }))
        };
        
        this.structuredData.set('breadcrumb', breadcrumbSchema);
    }

    /**
     * 获取面包屑数据
     */
    getBreadcrumbData(path) {
        const breadcrumbs = [
            { name: '首页', url: '/' }
        ];
        
        if (path.includes('product')) {
            breadcrumbs.push({ name: '产品介绍', url: '/product.html' });
        } else if (path.includes('technology')) {
            breadcrumbs.push({ name: '技术研发', url: '/technology.html' });
        } else if (path.includes('team')) {
            breadcrumbs.push({ name: '团队介绍', url: '/team.html' });
        } else if (path.includes('contact')) {
            breadcrumbs.push({ name: '联系我们', url: '/contact.html' });
        }
        
        return breadcrumbs;
    }

    /**
     * 注入结构化数据
     */
    injectStructuredData() {
        // 移除现有的结构化数据
        const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
        existingScripts.forEach(script => script.remove());
        
        // 注入新的结构化数据
        this.structuredData.forEach((schema, key) => {
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.textContent = JSON.stringify(schema, null, 2);
            document.head.appendChild(script);
        });
        
        console.log(`📋 已注入 ${this.structuredData.size} 个结构化数据`);
    }

    /**
     * 获取SEO报告
     */
    getSEOReport() {
        return {
            structuredDataCount: this.structuredData.size,
            metaTagsCount: this.metaTags.size,
            pageTitle: document.title,
            metaDescription: this.metaTags.get('description'),
            hasOpenGraph: !!document.querySelector('meta[property^="og:"]'),
            hasTwitterCard: !!document.querySelector('meta[name^="twitter:"]'),
            structuredDataTypes: Array.from(this.structuredData.keys())
        };
    }
}

// 导出单例实例
export default new SEOEnhancer();
