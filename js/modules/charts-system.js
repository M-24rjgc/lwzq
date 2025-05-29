/**
 * 图表系统模块
 * 整合产品图表和技术图表功能
 */

class ChartsSystem {
    constructor() {
        this.charts = new Map();
        this.observers = new Map();
        this.isInitialized = false;
    }

    /**
     * 初始化图表系统
     */
    async init() {
        if (this.isInitialized) return;
        
        try {
            // 检查Chart.js是否已加载
            if (typeof Chart === 'undefined') {
                await this.loadChartJS();
            }
            
            // 初始化所有图表
            await this.initializeCharts();
            
            // 设置响应式监听
            this.setupResponsiveHandlers();
            
            this.isInitialized = true;
            console.log('📊 图表系统初始化完成');
        } catch (error) {
            console.error('❌ 图表系统初始化失败:', error);
        }
    }

    /**
     * 动态加载Chart.js
     */
    async loadChartJS() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * 初始化所有图表
     */
    async initializeCharts() {
        const chartConfigs = [
            { id: 'accuracy-chart', type: 'doughnut', data: this.getAccuracyData() },
            { id: 'performance-chart', type: 'line', data: this.getPerformanceData() },
            { id: 'features-chart', type: 'radar', data: this.getFeaturesData() },
            { id: 'usage-chart', type: 'bar', data: this.getUsageData() },
            { id: 'tech-comparison-chart', type: 'bar', data: this.getTechComparisonData() },
            { id: 'algorithm-performance-chart', type: 'line', data: this.getAlgorithmData() }
        ];

        for (const config of chartConfigs) {
            await this.createChart(config);
        }
    }

    /**
     * 创建单个图表
     */
    async createChart({ id, type, data }) {
        const canvas = document.getElementById(id);
        if (!canvas) return;

        // 使用Intersection Observer延迟加载
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.charts.has(id)) {
                    this.renderChart(canvas, type, data);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        observer.observe(canvas);
        this.observers.set(id, observer);
    }

    /**
     * 渲染图表
     */
    renderChart(canvas, type, data) {
        const ctx = canvas.getContext('2d');
        
        const config = {
            type,
            data,
            options: this.getChartOptions(type)
        };

        const chart = new Chart(ctx, config);
        this.charts.set(canvas.id, chart);

        // 添加动画效果
        this.addChartAnimations(chart);
    }

    /**
     * 获取图表通用配置
     */
    getChartOptions(type) {
        const baseOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            family: "'Noto Sans SC', sans-serif",
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#2563EB',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: true
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            }
        };

        // 根据图表类型添加特定配置
        switch (type) {
            case 'line':
                return {
                    ...baseOptions,
                    scales: {
                        x: {
                            grid: { display: false },
                            ticks: { font: { family: "'Noto Sans SC', sans-serif" } }
                        },
                        y: {
                            beginAtZero: true,
                            grid: { color: 'rgba(0, 0, 0, 0.1)' },
                            ticks: { font: { family: "'Noto Sans SC', sans-serif" } }
                        }
                    },
                    elements: {
                        line: { tension: 0.4 },
                        point: { radius: 6, hoverRadius: 8 }
                    }
                };

            case 'bar':
                return {
                    ...baseOptions,
                    scales: {
                        x: {
                            grid: { display: false },
                            ticks: { font: { family: "'Noto Sans SC', sans-serif" } }
                        },
                        y: {
                            beginAtZero: true,
                            grid: { color: 'rgba(0, 0, 0, 0.1)' },
                            ticks: { font: { family: "'Noto Sans SC', sans-serif" } }
                        }
                    }
                };

            case 'radar':
                return {
                    ...baseOptions,
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                                stepSize: 20,
                                font: { family: "'Noto Sans SC', sans-serif" }
                            },
                            grid: { color: 'rgba(0, 0, 0, 0.1)' }
                        }
                    }
                };

            case 'doughnut':
                return {
                    ...baseOptions,
                    cutout: '60%',
                    plugins: {
                        ...baseOptions.plugins,
                        legend: {
                            ...baseOptions.plugins.legend,
                            position: 'right'
                        }
                    }
                };

            default:
                return baseOptions;
        }
    }

    /**
     * 添加图表动画效果
     */
    addChartAnimations(chart) {
        // 添加悬浮效果
        chart.canvas.addEventListener('mousemove', (e) => {
            chart.canvas.style.cursor = 'pointer';
        });

        chart.canvas.addEventListener('mouseleave', (e) => {
            chart.canvas.style.cursor = 'default';
        });
    }

    /**
     * 准确率数据
     */
    getAccuracyData() {
        return {
            labels: ['步态识别准确率', '异常检测准确率', '建议准确率'],
            datasets: [{
                data: [92.3, 89.7, 94.1],
                backgroundColor: [
                    '#2563EB',
                    '#10B981',
                    '#8B5CF6'
                ],
                borderWidth: 0,
                hoverOffset: 10
            }]
        };
    }

    /**
     * 性能数据
     */
    getPerformanceData() {
        return {
            labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
            datasets: [{
                label: '响应时间 (ms)',
                data: [45, 42, 38, 35, 32, 28],
                borderColor: '#2563EB',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                fill: true
            }, {
                label: '准确率 (%)',
                data: [88.5, 89.2, 90.1, 91.5, 92.0, 92.3],
                borderColor: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true
            }]
        };
    }

    /**
     * 功能特性数据
     */
    getFeaturesData() {
        return {
            labels: ['实时性', '准确性', '稳定性', '易用性', '扩展性'],
            datasets: [{
                label: '步态精灵',
                data: [95, 92, 88, 90, 85],
                borderColor: '#2563EB',
                backgroundColor: 'rgba(37, 99, 235, 0.2)',
                pointBackgroundColor: '#2563EB'
            }, {
                label: '竞品平均',
                data: [75, 80, 78, 82, 70],
                borderColor: '#94A3B8',
                backgroundColor: 'rgba(148, 163, 184, 0.2)',
                pointBackgroundColor: '#94A3B8'
            }]
        };
    }

    /**
     * 使用统计数据
     */
    getUsageData() {
        return {
            labels: ['专业运动员', '业余跑者', '康复训练', '科研机构'],
            datasets: [{
                label: '用户数量',
                data: [1200, 3500, 800, 150],
                backgroundColor: [
                    '#2563EB',
                    '#10B981',
                    '#8B5CF6',
                    '#F59E0B'
                ]
            }]
        };
    }

    /**
     * 技术对比数据
     */
    getTechComparisonData() {
        return {
            labels: ['传统方法', '单一传感器', '多传感器融合', 'ST-FusionNet'],
            datasets: [{
                label: '准确率 (%)',
                data: [65, 78, 85, 92.3],
                backgroundColor: ['#94A3B8', '#F59E0B', '#10B981', '#2563EB']
            }]
        };
    }

    /**
     * 算法性能数据
     */
    getAlgorithmData() {
        return {
            labels: ['v1.0', 'v1.1', 'v1.2', 'v1.3', 'v2.0', 'v2.1'],
            datasets: [{
                label: '处理速度 (fps)',
                data: [30, 35, 42, 48, 55, 60],
                borderColor: '#2563EB',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                fill: true
            }, {
                label: '内存使用 (MB)',
                data: [120, 115, 108, 95, 85, 78],
                borderColor: '#EF4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                fill: true
            }]
        };
    }

    /**
     * 设置响应式处理
     */
    setupResponsiveHandlers() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.charts.forEach(chart => {
                    chart.resize();
                });
            }, 250);
        });
    }

    /**
     * 更新图表数据
     */
    updateChart(chartId, newData) {
        const chart = this.charts.get(chartId);
        if (chart) {
            chart.data = newData;
            chart.update('active');
        }
    }

    /**
     * 销毁所有图表
     */
    destroy() {
        this.charts.forEach(chart => chart.destroy());
        this.observers.forEach(observer => observer.disconnect());
        this.charts.clear();
        this.observers.clear();
        this.isInitialized = false;
    }
}

// 导出单例实例
export default new ChartsSystem();
