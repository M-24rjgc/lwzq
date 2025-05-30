# 步态精灵智能跑步姿态分析系统官网

这是灵维智驱科技开发的"步态精灵"产品官方网站的源代码仓库。

## 📖 项目简介

步态精灵是一款专业级智能跑步姿态分析系统，采用超薄柔性传感技术，结合高精度IMU与足压传感器阵列，为跑者提供全面、精确的跑步姿态分析与指导。

### 🎯 核心价值
- **专业级分析**：基于生物力学原理的科学跑姿评估
- **实时反馈**：边缘计算技术实现毫秒级响应
- **个性化指导**：AI算法提供定制化训练建议
- **数据驱动**：全面的运动数据记录与分析

## 🚀 技术特点

### 核心技术优势
- **多模态数据融合**：结合IMU和足压阵列数据，全面分析跑步姿态
- **高精度识别**：核心跑姿问题识别准确率>92.3%
- **边缘-云协同**：轻量化边缘端模型实时反馈，云端深度分析
- **ST-FusionNet架构**：自主研发的时空融合神经网络

### 创新亮点
- **新颖性**：首创多传感器融合的跑姿分析技术
- **创造性**：独特的AI算法架构设计
- **实用性**：面向实际应用场景的产品化解决方案

## 🌐 网站结构

### 页面架构
- **首页** (`index.html`)：产品概览与核心特点展示
- **产品页** (`product.html`)：详细的产品功能与规格介绍
- **技术与研发** (`technology.html`)：核心技术与研发能力展示
- **团队介绍** (`team.html`)：团队背景与专业能力
- **联系我们** (`contact.html`)：合作咨询与客户服务

### 功能特性
- **响应式设计**：完美适配桌面端、平板和移动设备
- **交互式地图**：集成高德地图API的来访路线指导
- **3D动效**：Three.js粒子系统营造科技感
- **图片懒加载**：优化页面加载性能
- **AI生成图片**：专业级产品展示图片

## 🛠️ 开发技术

### 前端技术栈
- **HTML5 + CSS3**：现代化网页标准
- **原生JavaScript (ES6+)**：高性能交互逻辑
- **响应式设计**：移动优先的设计理念
- **Three.js**：3D粒子动效系统

### 设计系统
- **CSS变量**：统一的设计令牌系统
- **Flexbox/Grid**：现代化布局技术
- **动画库**：自定义CSS动画效果
- **图标系统**：SVG矢量图标库

### 性能优化
- **图片懒加载**：Intersection Observer API
- **代码分离**：模块化JavaScript架构
- **缓存策略**：浏览器缓存优化
- **压缩优化**：资源文件压缩

## 📁 项目结构

```
├── index.html              # 主页
├── product.html            # 产品页面
├── technology.html         # 技术页面
├── team.html              # 团队页面
├── contact.html           # 联系页面
├── css/                   # 样式文件
│   ├── styles.css         # 主样式文件
│   ├── responsive.css     # 响应式样式
│   └── enhancements.css   # 增强效果样式
├── js/                    # JavaScript文件
│   ├── main.js           # 主逻辑文件
│   ├── particles.js      # 粒子效果
│   ├── 3d-background.js  # 3D背景效果
│   ├── product-charts.js # 产品图表
│   ├── product-features.js # 产品功能
│   ├── product-model.js  # 产品模型
│   └── tech-charts.js    # 技术图表
├── images/               # 图片资源
│   ├── *.jpg            # 产品和场景图片
│   ├── *.png            # AI生成的专业图片
│   ├── *.svg            # 矢量图标和架构图
│   └── 图片资源信息.md   # 图片资源详细说明
└── package.json         # 项目配置文件
```

## 🎨 视觉设计

### 设计理念
- **现代科技感**：蓝色系主色调，体现专业与创新
- **用户友好**：清晰的信息层次和直观的交互设计
- **品牌一致性**：统一的视觉语言和设计规范

### 色彩系统
- **主色调**：现代蓝色系 (#2563EB, #3B82F6, #8B5CF6)
- **辅助色**：绿色 (#10B981) 和橙色 (#F59E0B)
- **渐变效果**：多色渐变背景增强视觉层次

### 动画效果
- **滚动动画**：元素进入视口时的渐进式加载
- **悬浮效果**：鼠标交互的视觉反馈
- **背景动画**：动态渐变和粒子效果

## 🗺️ 地图功能

### 来访路线指导
- **精确定位**：基于高德地图API的准确地理位置
- **多种路线**：支持驾车、公交、步行路线规划
- **交互体验**：点击地图查看详细信息和导航

### 技术实现
- **地图集成**：高德地图API集成
- **坐标定位**：公司坐标 (114.303356, 34.808166)
- **路线规划**：外部地图应用链接
- **响应式设计**：移动端优化显示

## 🚀 部署说明

### 部署要求
- **静态网站托管**：支持HTML/CSS/JS的任何平台
- **HTTPS支持**：推荐使用HTTPS协议
- **CDN加速**：建议配置CDN提升访问速度

### 推荐平台
- **Vercel**：零配置部署，自动HTTPS
- **Netlify**：持续集成，表单处理
- **GitHub Pages**：免费托管，版本控制
- **阿里云OSS**：国内访问优化

### 部署步骤
1. 克隆或下载项目文件
2. 上传到静态网站托管平台
3. 配置域名和HTTPS（可选）
4. 测试所有功能正常运行

## 📱 浏览器兼容性

### 支持的浏览器
- **现代浏览器**：Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **移动浏览器**：iOS Safari 13+, Chrome Mobile 80+
- **降级支持**：IE 11（基础功能）

### 功能支持
- **核心功能**：所有浏览器完全支持
- **增强效果**：现代浏览器支持动画和3D效果
- **渐进增强**：老版本浏览器保证基础体验

## 🔧 开发指南

### 本地开发
```bash
# 克隆项目
git clone [repository-url]

# 进入项目目录
cd gait-spirit-website

# 启动本地服务器（可选）
python -m http.server 8000
# 或使用Node.js
npx serve .

# 访问 http://localhost:8000
```

### 文件修改
- **样式修改**：编辑 `css/` 目录下的CSS文件
- **脚本修改**：编辑 `js/` 目录下的JavaScript文件
- **内容修改**：直接编辑HTML文件
- **图片替换**：替换 `images/` 目录下的图片文件

### 性能优化建议
- **图片优化**：使用WebP格式，适当压缩
- **代码压缩**：生产环境压缩CSS和JS
- **缓存配置**：设置适当的缓存策略
- **CDN配置**：使用CDN加速静态资源

## 📄 许可证与版权

### 版权信息
© 2025 灵维智驱科技有限公司. 版权所有.

### 图片资源许可
- **Unsplash图片**：遵循Unsplash License，可商业使用
- **AI生成图片**：通义万象生成，公司拥有使用权
- **SVG图标**：自主设计，公司版权所有

### 使用条款
- 本项目代码仅供灵维智驱科技有限公司使用
- 未经授权不得复制、分发或修改
- 图片资源使用需遵循相应许可协议

## 📞 技术支持

### 联系方式
- **公司地址**：河南省开封市金明大道灵维科技园 A座 3层
- **技术支持**：请通过官网联系表单提交技术问题
- **合作咨询**：请访问联系页面获取详细联系方式

### 更新日志
- **2025.01.27**：完成视觉优化和地图功能集成
- **2025.01.27**：添加AI生成图片和动画效果
- **2025.01.27**：优化响应式设计和性能

---

*最后更新：2025年1月27日*
