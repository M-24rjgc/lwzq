/**
 * Lighthouse CI 配置文件
 * 用于自动化性能测试和质量检查
 */

module.exports = {
  ci: {
    collect: {
      // 要测试的URL列表
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/product.html',
        'http://localhost:3000/technology.html',
        'http://localhost:3000/team.html',
        'http://localhost:3000/contact.html'
      ],
      // 启动本地服务器
      startServerCommand: 'npx serve . -p 3000',
      startServerReadyPattern: 'Local:',
      startServerReadyTimeout: 30000,
      // 收集设置
      numberOfRuns: 3, // 每个页面运行3次取平均值
      settings: {
        // 模拟移动设备
        preset: 'desktop', // 或 'mobile'
        // 禁用某些审计以加快速度
        skipAudits: [
          'canonical', // 跳过canonical URL检查
          'robots-txt', // 跳过robots.txt检查
        ],
        // 自定义用户代理
        emulatedUserAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    },
    assert: {
      // 性能预算设置
      assertions: {
        // 性能指标
        'categories:performance': ['error', { minScore: 0.8 }], // 性能分数至少80分
        'categories:accessibility': ['error', { minScore: 0.9 }], // 可访问性至少90分
        'categories:best-practices': ['error', { minScore: 0.8 }], // 最佳实践至少80分
        'categories:seo': ['error', { minScore: 0.9 }], // SEO至少90分
        
        // 核心Web指标
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }], // FCP < 2s
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }], // LCP < 2.5s
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }], // CLS < 0.1
        'total-blocking-time': ['warn', { maxNumericValue: 300 }], // TBT < 300ms
        
        // 其他重要指标
        'speed-index': ['warn', { maxNumericValue: 3000 }], // SI < 3s
        'interactive': ['warn', { maxNumericValue: 3500 }], // TTI < 3.5s
        
        // 资源优化
        'unused-css-rules': ['warn', { maxLength: 0 }], // 无未使用的CSS
        'unused-javascript': ['warn', { maxLength: 0 }], // 无未使用的JS
        'modern-image-formats': ['warn', { maxLength: 0 }], // 使用现代图片格式
        'offscreen-images': ['warn', { maxLength: 0 }], // 懒加载屏幕外图片
        
        // 可访问性
        'color-contrast': ['error', { maxLength: 0 }], // 颜色对比度
        'image-alt': ['error', { maxLength: 0 }], // 图片alt属性
        'heading-order': ['warn', { maxLength: 0 }], // 标题层级
        
        // SEO
        'meta-description': ['error', { maxLength: 0 }], // meta描述
        'document-title': ['error', { maxLength: 0 }], // 页面标题
        'hreflang': ['warn', { maxLength: 0 }], // 语言标记
        
        // 最佳实践
        'uses-https': ['error', { maxLength: 0 }], // 使用HTTPS
        'is-on-https': ['error', { maxLength: 0 }], // 在HTTPS上
        'no-vulnerable-libraries': ['error', { maxLength: 0 }], // 无漏洞库
      }
    },
    upload: {
      // 上传到临时存储
      target: 'temporary-public-storage',
      // 或者上传到自定义服务器
      // target: 'lhci',
      // serverBaseUrl: 'https://your-lhci-server.com',
      // token: 'your-build-token'
    },
    server: {
      // 如果使用LHCI服务器
      // port: 9001,
      // storage: {
      //   storageMethod: 'sql',
      //   sqlDialect: 'sqlite',
      //   sqlDatabasePath: './lhci.db'
      // }
    },
    wizard: {
      // 向导配置（首次设置时使用）
      // npm run lighthouse:wizard
    }
  },
  
  // 自定义审计配置
  extends: 'lighthouse:default',
  
  // 自定义设置
  settings: {
    // 网络限制
    throttlingMethod: 'simulate',
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0
    },
    
    // 屏幕模拟
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false
    },
    
    // 表单因子
    formFactor: 'desktop',
    
    // 审计配置
    onlyAudits: null, // 运行所有审计
    onlyCategories: null, // 运行所有类别
    
    // 输出配置
    output: ['html', 'json'],
    
    // 清除存储
    clearStorageTypes: ['cookies', 'localstorage', 'sessionstorage', 'websql', 'indexeddb'],
    
    // 禁用设备模拟
    disableDeviceEmulation: false,
    
    // 禁用存储重置
    disableStorageReset: false,
    
    // 最大等待时间
    maxWaitForFcp: 30000,
    maxWaitForLoad: 45000,
    
    // 跳过审计
    skipAudits: [
      'canonical', // 跳过canonical检查（开发环境）
      'robots-txt', // 跳过robots.txt检查
      'tap-targets', // 跳过触摸目标检查（桌面版）
    ]
  }
};

// 环境特定配置
if (process.env.CI) {
  // CI环境配置
  module.exports.ci.collect.numberOfRuns = 1; // CI中只运行一次以节省时间
  module.exports.ci.collect.settings.preset = 'mobile'; // CI中测试移动版本
}

if (process.env.NODE_ENV === 'production') {
  // 生产环境配置
  module.exports.ci.assert.assertions['categories:performance'][1].minScore = 0.9; // 生产环境要求更高性能
  module.exports.ci.collect.url = [
    'https://gait-spirit.com/',
    'https://gait-spirit.com/product.html',
    'https://gait-spirit.com/technology.html',
    'https://gait-spirit.com/team.html',
    'https://gait-spirit.com/contact.html'
  ];
}
