/**
 * 灵维智驱科技 - 技术图表和数据可视化
 * 使用Chart.js创建交互式图表
 */

document.addEventListener('DOMContentLoaded', function() {
    // 检查Chart.js是否已加载，如果没有，动态加载它
    if (typeof Chart === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js@3.7.1/dist/chart.min.js';
        document.head.appendChild(script);

        // 等待Chart.js加载完成后初始化图表
        script.onload = initCharts;
    } else {
        // Chart.js已经加载，直接初始化图表
        initCharts();
    }
});

// 初始化所有图表
function initCharts() {
    // 初始化各种图表
    initTechnologyComparisonChart();
    initAccuracyProgressChart();
    initUserSatisfactionChart();
    initPerformanceMetricsChart();

    // 初始化研发背景图表
    initInjuryRateChart();
    initEconomyImprovementChart();
    initSolutionComparisonChart();

    // 为技术卡片添加动画效果
    animateTechCards();
}

// 技术比较图表
function initTechnologyComparisonChart() {
    const ctx = document.getElementById('technology-comparison-chart');
    if (!ctx) return;

    const data = {
        labels: ['步态分析精度', '实时响应速度', '电池续航', '传感器耐用性', '数据处理效率', '重量'],
        datasets: [
            {
                label: '步态精灵',
                data: [95, 98, 85, 90, 95, 88],
                backgroundColor: 'rgba(30, 136, 229, 0.2)',
                borderColor: 'rgba(30, 136, 229, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(30, 136, 229, 1)'
            },
            {
                label: '同类产品平均水平',
                data: [70, 65, 60, 75, 68, 80],
                backgroundColor: 'rgba(150, 150, 150, 0.2)',
                borderColor: 'rgba(150, 150, 150, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(150, 150, 150, 1)'
            }
        ]
    };

    const options = {
        scales: {
            r: {
                min: 0,
                max: 100,
                ticks: {
                    stepSize: 20,
                    display: false
                },
                pointLabels: {
                    font: {
                        size: 12,
                        family: "'Noto Sans SC', sans-serif"
                    }
                },
                grid: {
                    color: 'rgba(200, 200, 200, 0.3)'
                },
                angleLines: {
                    color: 'rgba(200, 200, 200, 0.3)'
                }
            }
        },
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    font: {
                        family: "'Noto Sans SC', sans-serif"
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return context.dataset.label + ': ' + context.raw + '%';
                    }
                }
            }
        },
        responsive: true,
        maintainAspectRatio: false
    };

    new Chart(ctx, {
        type: 'radar',
        data: data,
        options: options
    });
}

// 精度进步历程图表
function initAccuracyProgressChart() {
    const ctx = document.getElementById('accuracy-progress-chart');
    if (!ctx) return;

    const data = {
        labels: ['2022年Q1', '2022年Q2', '2022年Q3', '2022年Q4', '2023年Q1', '2023年Q2', '2023年Q3', '2023年Q4', '2024年Q1', '2024年Q2', '2024年Q3', '2024年Q4'],
        datasets: [
            {
                label: '走路姿态识别精度',
                data: [75, 78, 82, 85, 88, 90, 91, 92, 94, 95, 96, 97],
                borderColor: 'rgba(30, 136, 229, 1)',
                backgroundColor: 'rgba(30, 136, 229, 0.1)',
                fill: true,
                tension: 0.3
            },
            {
                label: '跑步姿态识别精度',
                data: [68, 72, 75, 78, 82, 85, 87, 89, 91, 93, 94, 95],
                borderColor: 'rgba(76, 175, 80, 1)',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                fill: true,
                tension: 0.3
            }
        ]
    };

    const options = {
        scales: {
            y: {
                min: 60,
                max: 100,
                ticks: {
                    callback: function(value) {
                        return value + '%';
                    }
                },
                title: {
                    display: true,
                    text: '精度百分比',
                    font: {
                        family: "'Noto Sans SC', sans-serif"
                    }
                }
            },
            x: {
                title: {
                    display: true,
                    text: '时间',
                    font: {
                        family: "'Noto Sans SC', sans-serif"
                    }
                },
                ticks: {
                    maxRotation: 45,
                    minRotation: 45
                }
            }
        },
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    font: {
                        family: "'Noto Sans SC', sans-serif"
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return context.dataset.label + ': ' + context.raw + '%';
                    }
                }
            }
        },
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            intersect: false,
            mode: 'index'
        }
    };

    new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    });
}

// 用户满意度图表
function initUserSatisfactionChart() {
    const ctx = document.getElementById('user-satisfaction-chart');
    if (!ctx) return;

    const data = {
        labels: ['舒适度', '易用性', '数据准确性', '应用体验', '电池续航', '改善跑步姿势'],
        datasets: [
            {
                label: '用户满意度',
                data: [4.8, 4.5, 4.9, 4.7, 4.3, 4.8],
                backgroundColor: [
                    'rgba(30, 136, 229, 0.7)',
                    'rgba(76, 175, 80, 0.7)',
                    'rgba(255, 193, 7, 0.7)',
                    'rgba(156, 39, 176, 0.7)',
                    'rgba(255, 87, 34, 0.7)',
                    'rgba(3, 169, 244, 0.7)'
                ],
                borderColor: [
                    'rgba(30, 136, 229, 1)',
                    'rgba(76, 175, 80, 1)',
                    'rgba(255, 193, 7, 1)',
                    'rgba(156, 39, 176, 1)',
                    'rgba(255, 87, 34, 1)',
                    'rgba(3, 169, 244, 1)'
                ],
                borderWidth: 2
            }
        ]
    };

    const options = {
        scales: {
            r: {
                min: 0,
                max: 5,
                ticks: {
                    stepSize: 1
                },
                pointLabels: {
                    font: {
                        size: 12,
                        family: "'Noto Sans SC', sans-serif"
                    }
                }
            }
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return '用户满意度: ' + context.raw + '/5';
                    }
                }
            }
        },
        responsive: true,
        maintainAspectRatio: false
    };

    new Chart(ctx, {
        type: 'polarArea',
        data: data,
        options: options
    });
}

// 性能指标图表
function initPerformanceMetricsChart() {
    const ctx = document.getElementById('performance-metrics-chart');
    if (!ctx) return;

    const data = {
        labels: ['跑步', '步行', '登山', '健身', '球类运动', '日常活动'],
        datasets: [
            {
                label: '检测准确率',
                data: [95, 97, 92, 89, 86, 98],
                backgroundColor: 'rgba(30, 136, 229, 0.7)'
            }
        ]
    };

    const options = {
        indexAxis: 'y',
        scales: {
            x: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    callback: function(value) {
                        return value + '%';
                    }
                }
            }
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return '准确率: ' + context.raw + '%';
                    }
                }
            }
        },
        responsive: true,
        maintainAspectRatio: false
    };

    new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
    });
}

// 为技术卡片添加滚动动画效果
function animateTechCards() {
    // 找到所有技术卡片
    const techCards = document.querySelectorAll('.tech-card');
    if (techCards.length === 0) return;

    // 创建Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // 如果元素可见
            if (entry.isIntersecting) {
                // 添加动画类
                entry.target.classList.add('animate');
                // 停止观察已经显示的元素
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 }); // 当20%的元素可见时触发

    // 观察每个卡片
    techCards.forEach(card => {
        observer.observe(card);
    });
}

// 研究数据可视化
function initResearchDataVisualization() {
    // 根据需要添加更多高级数据可视化
    // 例如：使用D3.js创建更复杂的可视化
}

// 添加交互性功能
function addTechInteractivity() {
    const techItems = document.querySelectorAll('.tech-item');
    if (techItems.length === 0) return;

    techItems.forEach(item => {
        item.addEventListener('click', function() {
            // 关闭所有打开的项目
            techItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    const details = otherItem.querySelector('.tech-details');
                    if (details) {
                        details.style.maxHeight = '0';
                    }
                }
            });

            // 切换当前项目
            this.classList.toggle('active');
            const details = this.querySelector('.tech-details');

            if (details) {
                if (this.classList.contains('active')) {
                    details.style.maxHeight = details.scrollHeight + 'px';
                } else {
                    details.style.maxHeight = '0';
                }
            }
        });
    });
}

// ==================== 研发背景图表 ====================

// 跑者损伤率统计图表
function initInjuryRateChart() {
    const ctx = document.getElementById('injury-rate-chart');
    if (!ctx) return;

    const data = {
        labels: ['膝关节', '踝关节', '髋部', '足部', '小腿', '大腿', '腰部', '其他'],
        datasets: [{
            label: '损伤发生率',
            data: [28, 22, 15, 12, 10, 8, 3, 2],
            backgroundColor: [
                'rgba(239, 68, 68, 0.8)',   // 红色 - 膝关节
                'rgba(245, 158, 11, 0.8)',  // 橙色 - 踝关节
                'rgba(251, 191, 36, 0.8)',  // 黄色 - 髋部
                'rgba(34, 197, 94, 0.8)',   // 绿色 - 足部
                'rgba(59, 130, 246, 0.8)',  // 蓝色 - 小腿
                'rgba(147, 51, 234, 0.8)',  // 紫色 - 大腿
                'rgba(236, 72, 153, 0.8)',  // 粉色 - 腰部
                'rgba(156, 163, 175, 0.8)'  // 灰色 - 其他
            ],
            borderColor: [
                'rgba(239, 68, 68, 1)',
                'rgba(245, 158, 11, 1)',
                'rgba(251, 191, 36, 1)',
                'rgba(34, 197, 94, 1)',
                'rgba(59, 130, 246, 1)',
                'rgba(147, 51, 234, 1)',
                'rgba(236, 72, 153, 1)',
                'rgba(156, 163, 175, 1)'
            ],
            borderWidth: 2
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return context.label + ': ' + context.raw + '%';
                    }
                }
            }
        }
    };

    new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: options
    });
}

// 跑步经济性提升图表
function initEconomyImprovementChart() {
    const ctx = document.getElementById('economy-improvement-chart');
    if (!ctx) return;

    const data = {
        labels: ['优化前', '优化后'],
        datasets: [
            {
                label: '能量消耗 (kcal/km)',
                data: [65, 60],
                backgroundColor: 'rgba(239, 68, 68, 0.7)',
                borderColor: 'rgba(239, 68, 68, 1)',
                borderWidth: 2,
                yAxisID: 'y'
            },
            {
                label: '跑步效率提升 (%)',
                data: [0, 8],
                backgroundColor: 'rgba(34, 197, 94, 0.7)',
                borderColor: 'rgba(34, 197, 94, 1)',
                borderWidth: 2,
                yAxisID: 'y1'
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: {
                    display: true,
                    text: '能量消耗 (kcal/km)',
                    font: {
                        family: "'Noto Sans SC', sans-serif"
                    }
                },
                ticks: {
                    beginAtZero: true
                }
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                title: {
                    display: true,
                    text: '效率提升 (%)',
                    font: {
                        family: "'Noto Sans SC', sans-serif"
                    }
                },
                grid: {
                    drawOnChartArea: false,
                },
                ticks: {
                    beginAtZero: true,
                    callback: function(value) {
                        return value + '%';
                    }
                }
            }
        },
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    font: {
                        family: "'Noto Sans SC', sans-serif"
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        if (context.datasetIndex === 0) {
                            return context.dataset.label + ': ' + context.raw + ' kcal/km';
                        } else {
                            return context.dataset.label + ': ' + context.raw + '%';
                        }
                    }
                }
            }
        }
    };

    new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
    });
}

// 现有解决方案对比图表
function initSolutionComparisonChart() {
    const ctx = document.getElementById('solution-comparison-chart');
    if (!ctx) return;

    const data = {
        labels: ['专业教练', '实验室设备', '消费级设备', '步态精灵'],
        datasets: [
            {
                label: '准确性',
                data: [60, 95, 40, 90],
                backgroundColor: 'rgba(59, 130, 246, 0.7)'
            },
            {
                label: '便携性',
                data: [90, 10, 85, 95],
                backgroundColor: 'rgba(34, 197, 94, 0.7)'
            },
            {
                label: '成本效益',
                data: [30, 15, 70, 85],
                backgroundColor: 'rgba(251, 191, 36, 0.7)'
            },
            {
                label: '实时性',
                data: [70, 20, 60, 95],
                backgroundColor: 'rgba(147, 51, 234, 0.7)'
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                title: {
                    display: true,
                    text: '评分 (0-100)',
                    font: {
                        family: "'Noto Sans SC', sans-serif"
                    }
                }
            },
            x: {
                title: {
                    display: true,
                    text: '解决方案类型',
                    font: {
                        family: "'Noto Sans SC', sans-serif"
                    }
                }
            }
        },
        plugins: {
            legend: {
                position: 'bottom',
                align: 'center',
                labels: {
                    font: {
                        family: "'Noto Sans SC', sans-serif",
                        size: 11
                    },
                    usePointStyle: true,
                    pointStyle: 'rect',
                    padding: 12,
                    boxWidth: 10,
                    boxHeight: 10,
                    textAlign: 'center',
                    generateLabels: function(chart) {
                        const original = Chart.defaults.plugins.legend.labels.generateLabels;
                        const labels = original.call(this, chart);

                        // 自定义图例样式，确保一排显示
                        labels.forEach((label, index) => {
                            label.fillStyle = chart.data.datasets[index].backgroundColor;
                            label.strokeStyle = chart.data.datasets[index].backgroundColor;
                            label.lineWidth = 0;
                        });

                        return labels;
                    }
                },
                maxHeight: 40,
                fullSize: false,
                // 确保图例在一排显示
                display: true,
                rtl: false
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return context.dataset.label + ': ' + context.raw + '/100';
                    }
                }
            }
        }
    };

    new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
    });
}
