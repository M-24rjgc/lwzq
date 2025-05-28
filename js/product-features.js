// 优化版本的手风琴功能 - 默认全部收起
document.addEventListener('DOMContentLoaded', function() {
    const featureTabs = document.querySelectorAll('.feature-tab');

    // 初始化所有标签页为收起状态
    featureTabs.forEach(tab => {
        tab.classList.remove('active');
        const content = tab.querySelector('.feature-content');
        const icon = tab.querySelector('.toggle-icon');
        if (content) {
            content.style.maxHeight = '0';
        }
        if (icon) {
            icon.textContent = '+';
        }
    });

    featureTabs.forEach(tab => {
        const header = tab.querySelector('.feature-header');
        const content = tab.querySelector('.feature-content');
        const toggleIcon = tab.querySelector('.toggle-icon');

        if (!header || !content) return;

        header.addEventListener('click', () => {
            const isActive = tab.classList.contains('active');

            // 关闭所有其他标签页
            featureTabs.forEach(otherTab => {
                if (otherTab !== tab) {
                    otherTab.classList.remove('active');
                    const otherContent = otherTab.querySelector('.feature-content');
                    const otherIcon = otherTab.querySelector('.toggle-icon');
                    if (otherContent) {
                        otherContent.style.maxHeight = '0';
                    }
                    if (otherIcon) {
                        otherIcon.textContent = '+';
                    }
                }
            });

            // 切换当前标签页
            if (isActive) {
                // 如果当前是展开的，则收起
                tab.classList.remove('active');
                content.style.maxHeight = '0';
                if (toggleIcon) {
                    toggleIcon.textContent = '+';
                }
            } else {
                // 如果当前是收起的，则展开
                tab.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
                if (toggleIcon) {
                    toggleIcon.textContent = '-';
                }
            }
        });
    });

    // Trigger scroll animations
    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // Product model interaction
    const productImg = document.querySelector('.product-3d-img');
    if(productImg) {        let rotation = 0;
        let scale = 1;
        let translateY = 0;

        const updateTransform = () => {
            productImg.style.transform = `rotate(${rotation}deg) scale(${scale}) translateY(${translateY}px)`;
        };

        document.getElementById('rotateLeft').addEventListener('click', () => {
            rotation -= 10;
            updateTransform();
        });

        document.getElementById('rotateRight').addEventListener('click', () => {
            rotation += 10;
            updateTransform();
        });

        document.getElementById('zoomIn').addEventListener('click', () => {
            if(scale < 1.5) {
                scale += 0.1;
                updateTransform();
            }
        });

        document.getElementById('zoomOut').addEventListener('click', () => {
            if(scale > 0.6) {
                scale -= 0.1;
                updateTransform();
            }
        });

        // 保存初始动画
        const originalAnimation = productImg.style.animation;

        // 鼠标悬停时暂停动画
        productImg.addEventListener('mouseenter', () => {
            productImg.style.animation = 'none';
        });

        // 鼠标离开时恢复动画
        productImg.addEventListener('mouseleave', () => {
            productImg.style.animation = originalAnimation;
            // 重置变换
            rotation = 0;
            scale = 1;
            translateY = 0;
            updateTransform();
        });
    }

    // 规格标签切换功能
    const specTabs = document.querySelectorAll('.specs-tab');
    specTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 移除所有标签的active类
            specTabs.forEach(t => t.classList.remove('active'));

            // 添加当前标签的active类
            tab.classList.add('active');

            // 获取要显示的面板ID
            const panelId = tab.dataset.tab + '-specs';

            // 隐藏所有面板
            document.querySelectorAll('.specs-panel').forEach(panel => {
                panel.classList.remove('active');
            });

            // 显示当前选中的面板
            document.getElementById(panelId).classList.add('active');
        });
    });
});
