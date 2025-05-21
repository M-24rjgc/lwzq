/**
 * 步态精灵产品页图表
 * 数据可视化展示
 */

document.addEventListener('DOMContentLoaded', function() {
    initProductCharts();
});

// 初始化产品页图表
function initProductCharts() {
    // 用户改善效果统计图
    const improvementCtx = document.getElementById('improvementChart');
    if (improvementCtx) {
        new Chart(improvementCtx, {
            type: 'bar',
            data: {
                labels: ['跑姿表现', '运动损伤减少', '舒适度提升', '跑步效率改善', '体能提升'],
                datasets: [{
                    label: '4周后',
                    data: [32, 48, 65, 28, 20],
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }, {
                    label: '8周后',
                    data: [58, 73, 82, 54, 45],
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }, {
                    label: '12周后',
                    data: [78, 86, 93, 76, 68],
                    backgroundColor: 'rgba(153, 102, 255, 0.6)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        title: {
                            display: true,
                            text: '改善百分比',
                            font: {
                                family: "'Noto Sans SC', sans-serif"
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: '评估维度',
                            font: {
                                family: "'Noto Sans SC', sans-serif"
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
                                return context.dataset.label + ': ' + context.raw + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    // 产品精度对比图
    const accuracyCtx = document.getElementById('accuracyChart');
    if (accuracyCtx) {
        new Chart(accuracyCtx, {
            type: 'radar',
            data: {
                labels: [
                    '步频准确度',
                    '着地模式识别',
                    '步态周期划分',
                    '内/外翻角度',
                    '垂直冲击力',
                    '支撑时间'
                ],
                datasets: [{
                    label: '步态精灵',
                    data: [95, 92, 94, 91, 93, 96],
                    fill: true,
                    backgroundColor: 'rgba(54, 162, 235, 0.3)',
                    borderColor: 'rgb(54, 162, 235)',
                    pointBackgroundColor: 'rgb(54, 162, 235)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(54, 162, 235)'
                }, {
                    label: '竞品A',
                    data: [88, 78, 82, 79, 85, 90],
                    fill: true,
                    backgroundColor: 'rgba(255, 99, 132, 0.3)',
                    borderColor: 'rgb(255, 99, 132)',
                    pointBackgroundColor: 'rgb(255, 99, 132)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(255, 99, 132)'
                }, {
                    label: '竞品B',
                    data: [85, 80, 76, 82, 80, 85],
                    fill: true,
                    backgroundColor: 'rgba(75, 192, 192, 0.3)',
                    borderColor: 'rgb(75, 192, 192)',
                    pointBackgroundColor: 'rgb(75, 192, 192)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(75, 192, 192)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                elements: {
                    line: {
                        borderWidth: 2
                    }
                },
                scales: {
                    r: {
                        angleLines: {
                            display: true
                        },
                        suggestedMin: 50,
                        suggestedMax: 100,
                        ticks: {
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
                                return context.dataset.label + ': ' + context.raw + '%';
                            }
                        }
                    }
                }
            }
        });
    }
}
