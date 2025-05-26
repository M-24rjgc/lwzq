/**
 * 灵维智驱科技 - 主JavaScript文件
 * 包含网站的核心功能和交互效果
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化主题系统
    initThemeSystem();

    // 页面加载完成后移除加载动画
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        // 添加更流畅的加载动画
        loadingElement.style.transition = 'opacity 0.6s ease, visibility 0.6s ease';

        window.addEventListener('load', function() {
            loadingElement.style.opacity = '0';
            loadingElement.style.visibility = 'hidden';
            setTimeout(function() {
                loadingElement.style.display = 'none';
                // 触发页面入场动画
                document.body.classList.add('page-loaded');
            }, 600);
        });
    }

    // 导航菜单切换功能
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // 滚动时导航栏效果
    const header = document.querySelector('header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // 添加滚动样式
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // 滚动隐藏/显示导航栏
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            header.classList.add('nav-hidden');
        } else {
            header.classList.remove('nav-hidden');
        }

        lastScrollTop = scrollTop;
    });

    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });

                // 如果是在移动设备上，点击后关闭导航菜单
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            }
        });
    });

    // 统计数字动画 - 智谱AI风格
    const statistics = document.querySelectorAll('.stat-number');

    if (statistics.length > 0) {
        const animateStatistics = () => {
            statistics.forEach(stat => {
                const target = parseFloat(stat.getAttribute('data-target'));
                const duration = 2500; // 持续2.5秒
                const startTime = performance.now();
                const startValue = 0;

                const updateNumber = (currentTime) => {
                    const elapsedTime = currentTime - startTime;
                    const progress = Math.min(elapsedTime / duration, 1);

                    // 使用缓动函数使动画更自然
                    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                    const currentValue = easeOutQuart * (target - startValue) + startValue;

                    // 根据数值类型格式化显示
                    if (target >= 1000) {
                        stat.textContent = Math.floor(currentValue).toLocaleString();
                    } else if (target % 1 !== 0) {
                        stat.textContent = currentValue.toFixed(1);
                    } else {
                        stat.textContent = Math.floor(currentValue);
                    }

                    if (progress < 1) {
                        requestAnimationFrame(updateNumber);
                    }
                };

                requestAnimationFrame(updateNumber);
            });
        };

        // 创建Intersection Observer来触发动画
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 添加延迟，让动画更有层次感
                    setTimeout(() => {
                        animateStatistics();
                    }, 300);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        // 观察包含统计数字的容器
        const statsSection = document.querySelector('#stats-section');
        if (statsSection) {
            observer.observe(statsSection);
        }
    }

    // 产品特性手风琴功能已移至 product-features.js 文件中处理

    // 常见问题(FAQ)手风琴效果
    const faqItems = document.querySelectorAll('.faq-item');

    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            const icon = item.querySelector('.toggle-icon'); // 修改为正确的类名

            question.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');

                // 关闭所有其他项
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        const otherIcon = otherItem.querySelector('.toggle-icon'); // 修改为正确的类名
                        if (otherAnswer) {
                            otherAnswer.style.display = 'none';
                        }
                        if (otherIcon) {
                            otherIcon.textContent = '+';
                        }
                    }
                });

                // 切换当前项
                if (isOpen) {
                    item.classList.remove('active');
                    if (answer) {
                        answer.style.display = 'none';
                    }
                    if (icon) {
                        icon.textContent = '+';
                    }
                } else {
                    item.classList.add('active');
                    if (answer) {
                        answer.style.display = 'block';
                    }
                    if (icon) {
                        icon.textContent = '-';
                    }
                }
            });
        });
    }

    // 产品规格标签页切换
    const specsTabs = document.querySelectorAll('.specs-tab');
    const specsPanels = document.querySelectorAll('.specs-panel');

    if (specsTabs.length > 0) {
        specsTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.getAttribute('data-tab');

                // 移除所有标签和面板的激活状态
                specsTabs.forEach(t => t.classList.remove('active'));
                specsPanels.forEach(p => p.classList.remove('active'));

                // 激活当前标签和对应面板
                tab.classList.add('active');
                const targetPanel = document.getElementById(targetTab + '-specs');
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
            });
        });
    }

    // 表单验证
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            let isValid = true;
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');

            // 简单验证
            if (!nameInput.value.trim()) {
                showError(nameInput, '请输入您的姓名');
                isValid = false;
            } else {
                removeError(nameInput);
            }

            if (!emailInput.value.trim()) {
                showError(emailInput, '请输入您的邮箱');
                isValid = false;
            } else if (!isValidEmail(emailInput.value)) {
                showError(emailInput, '请输入有效的邮箱地址');
                isValid = false;
            } else {
                removeError(emailInput);
            }

            if (!messageInput.value.trim()) {
                showError(messageInput, '请输入您的留言');
                isValid = false;
            } else {
                removeError(messageInput);
            }

            if (isValid) {
                // 显示成功消息（实际项目中会发送到服务器）
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.textContent = '感谢您的留言，我们会尽快回复您！';

                // 在表单后插入成功消息
                contactForm.insertAdjacentElement('afterend', successMessage);

                // 重置表单
                contactForm.reset();

                // 3秒后移除成功消息
                setTimeout(function() {
                    successMessage.remove();
                }, 3000);
            }
        });

        // 辅助函数
        function showError(input, message) {
            // 移除已存在的错误信息
            removeError(input);

            // 创建新的错误消息
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;

            // 在输入框后插入错误消息
            input.parentNode.insertBefore(errorDiv, input.nextSibling);

            // 添加错误样式
            input.classList.add('error');
        }

        function removeError(input) {
            const errorMessage = input.nextElementSibling;
            if (errorMessage && errorMessage.classList.contains('error-message')) {
                errorMessage.remove();
            }

            // 移除错误样式
            input.classList.remove('error');
        }

        function isValidEmail(email) {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }
    }    // 初始化滚动显示动画
    initScrollAnimations();

    // 初始化用户见证轮播
    initTestimonialsCarousel();

    // 初始化滚动进度指示器
    initScrollProgress();

    // 初始化页面内导航
    initPageNavigation();

    // 初始化滚动动画
    initAdvancedScrollAnimations();

    // 初始化图片懒加载
    initLazyLoading();

    // 初始化地图功能
    initMapSection();

    // 产品展示区域动画效果
    const productShowcase = document.querySelector('.product-showcase');
    if (productShowcase) {
        // 使用Intersection Observer监测元素是否进入视口
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 元素进入视口，添加动画类
                    productShowcase.classList.add('animate-showcase');
                    // 已经观察到了，不再需要观察
                    observer.unobserve(productShowcase);
                }
            });
        }, { threshold: 0.2 }); // 当元素20%进入视口时触发

        // 开始观察
        observer.observe(productShowcase);
    }

    // 为产品特点列表添加逐项出现的效果
    const listItems = document.querySelectorAll('.product-highlights-list li');
    if (listItems.length) {
        listItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';

            setTimeout(() => {
                item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 300 + (index * 200)); // 每项延迟200ms出现
        });
    }

    // 视频演示模态框功能
    const modal = document.getElementById('videoModal');
    const demoButtons = document.querySelectorAll('[data-action="watch-demo"]');
    const closeModal = document.querySelector('.close-modal');

    // 打开模态框
    demoButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // 禁止滚动
        });
    });

    // 关闭模态框
    if(closeModal) {
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // 恢复滚动
        });
    }

    // 点击模态框外部关闭
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // 恢复滚动
        }
    });
});

// 滚动显示动画
function initScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in, .slide-up, .slide-left, .slide-right');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(element => {
        observer.observe(element);
    });
}

// 滚动至顶部按钮功能
const scrollToTopBtn = document.getElementById('scroll-to-top');
if (scrollToTopBtn) {
    // 监听滚动事件
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {  // 用户滚动超过300px时显示按钮
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    // 添加点击事件
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'  // 平滑滚动
        });
    });
}

// 页面内导航的激活状态管理
function initPageNavigation() {
    const pageNav = document.querySelector('.page-nav');
    if (!pageNav) return;

    const navLinks = pageNav.querySelectorAll('a');
    const sections = [];

    // 收集所有目标部分
    navLinks.forEach(link => {
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            sections.push({
                id: targetId,
                element: targetSection,
                link: link
            });
        }
    });

    // 滚动监听
    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + 200; // 200px的偏移，以便稍微提前激活导航项

        // 找出当前在视口中的部分
        let current = sections[0];
        sections.forEach(section => {
            const sectionTop = section.element.offsetTop;
            const sectionHeight = section.element.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section;
            }
        });

        // 移除所有激活状态，再添加当前部分的激活状态
        navLinks.forEach(link => link.classList.remove('active'));
        current.link.classList.add('active');

        // 确保当前激活的导航项在视图中（在溢出滚动的情况下）
        if (window.innerWidth <= 991) {
            const navContainer = pageNav.querySelector('ul');
            const activeItem = current.link.parentElement;
            const activeItemLeft = activeItem.offsetLeft;
            const containerScrollLeft = navContainer.scrollLeft;
            const containerWidth = navContainer.offsetWidth;

            if (activeItemLeft < containerScrollLeft ||
                activeItemLeft + activeItem.offsetWidth > containerScrollLeft + containerWidth) {
                navContainer.scrollLeft = activeItemLeft - containerWidth / 2 + activeItem.offsetWidth / 2;
            }
        }
    }

    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // 初始更新
}

// 用户见证轮播功能
function initTestimonialsCarousel() {
    const testimonialsContainer = document.querySelector('.testimonials-carousel');
    if (!testimonialsContainer) return;

    const testimonials = testimonialsContainer.querySelectorAll('.testimonial-item');
    if (testimonials.length <= 1) return;  // 如果只有一个见证则不需要轮播

    // 创建导航按钮
    const navContainer = document.createElement('div');
    navContainer.className = 'testimonial-nav';

    // 添加左右箭头按钮
    const prevBtn = document.createElement('button');
    prevBtn.className = 'testimonial-btn prev';
    prevBtn.innerHTML = '&lt;';
    prevBtn.setAttribute('aria-label', '上一个见证');

    const nextBtn = document.createElement('button');
    nextBtn.className = 'testimonial-btn next';
    nextBtn.innerHTML = '&gt;';
    nextBtn.setAttribute('aria-label', '下一个见证');

    navContainer.appendChild(prevBtn);
    navContainer.appendChild(nextBtn);

    // 添加指示器
    const indicators = document.createElement('div');
    indicators.className = 'testimonial-indicators';

    testimonials.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = index === 0 ? 'indicator active' : 'indicator';
        dot.setAttribute('data-index', index);
        indicators.appendChild(dot);
    });

    navContainer.appendChild(indicators);
    testimonialsContainer.appendChild(navContainer);

    // 初始化当前索引
    let currentIndex = 0;    // 显示指定索引的见证
    function showTestimonial(index) {
        // 应用淡出效果
        testimonials.forEach(item => {
            if (item.style.display !== 'none') {
                item.classList.add('fade-out');
                setTimeout(() => {
                    // 隐藏所有见证并移除ARIA状态
                    item.style.display = 'none';
                    item.setAttribute('aria-hidden', 'true');
                    item.setAttribute('tabindex', '-1');
                    item.classList.remove('fade-out');
                }, 300); // 等待淡出动画完成
            }
        });

        // 短暂延迟后显示新的见证
        setTimeout(() => {
            // 显示当前索引的见证并添加ARIA状态
            testimonials[index].style.display = 'grid';
            testimonials[index].setAttribute('aria-hidden', 'false');
            testimonials[index].setAttribute('tabindex', '0');
            testimonials[index].classList.add('fade-in');

            // 移除动画类
            setTimeout(() => {
                testimonials[index].classList.remove('fade-in');
            }, 500);

            // 更新指示器
            const dots = indicators.querySelectorAll('.indicator');
            dots.forEach((dot, i) => {
                dot.classList.remove('active');
                dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
            });
            dots[index].classList.add('active');
        }, 300); // 等待前一个见证淡出后再显示新的
    }

    // 初始显示第一个见证
    showTestimonial(0);

    // 点击上一个
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
        showTestimonial(currentIndex);
    });

    // 点击下一个
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(currentIndex);
    });

    // 添加键盘导航
    testimonialsContainer.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
            showTestimonial(currentIndex);
            e.preventDefault();
        } else if (e.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % testimonials.length;
            showTestimonial(currentIndex);
            e.preventDefault();
        }
    });

    // 设置容器的tabindex以接收键盘事件
    testimonialsContainer.setAttribute('tabindex', '0');
    testimonialsContainer.setAttribute('role', 'region');
    testimonialsContainer.setAttribute('aria-label', '用户见证轮播');

    // 点击指示器
    indicators.querySelectorAll('.indicator').forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.getAttribute('data-index'));
            currentIndex = index;
            showTestimonial(currentIndex);
        });
    });

    // 自动轮播
    let autoplayTimer;

    function startAutoplay() {
        autoplayTimer = setInterval(() => {
            currentIndex = (currentIndex + 1) % testimonials.length;
            showTestimonial(currentIndex);
        }, 5000); // 5秒切换一次
    }

    function stopAutoplay() {
        clearInterval(autoplayTimer);
    }

    // 启动自动轮播
    startAutoplay();

    // 鼠标悬停时暂停轮播
    testimonialsContainer.addEventListener('mouseenter', stopAutoplay);
    testimonialsContainer.addEventListener('mouseleave', startAutoplay);

    // 添加触摸滑动支持
    let touchStartX = 0;
    let touchEndX = 0;

    testimonialsContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});

    testimonialsContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, {passive: true});

    function handleSwipe() {
        const threshold = 50; // 最小滑动距离
        if (touchEndX < touchStartX - threshold) {
            // 向左滑动，显示下一个
            currentIndex = (currentIndex + 1) % testimonials.length;
            showTestimonial(currentIndex);
        } else if (touchEndX > touchStartX + threshold) {
            // 向右滑动，显示上一个
            currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
            showTestimonial(currentIndex);
        }
    }
}

// 主题系统 - 智谱AI风格
function initThemeSystem() {
    // 检查用户偏好
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');

    // 应用主题
    document.documentElement.setAttribute('data-theme', theme);

    // 创建主题切换按钮
    createThemeToggle();

    // 监听系统主题变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        }
    });
}

function createThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = `
        <svg class="sun-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
        <svg class="moon-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
    `;

    themeToggle.addEventListener('click', toggleTheme);

    // 添加到导航栏
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        const themeItem = document.createElement('li');
        themeItem.appendChild(themeToggle);
        navMenu.appendChild(themeItem);
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    // 添加切换动画
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
}

// 增强的滚动动画系统
function initEnhancedScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;

                // 添加延迟动画效果
                if (element.dataset.delay) {
                    setTimeout(() => {
                        element.classList.add('visible');
                    }, parseInt(element.dataset.delay));
                } else {
                    element.classList.add('visible');
                }

                // 为子元素添加交错动画
                const children = element.querySelectorAll('.stagger-child');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('visible');
                    }, index * 100);
                });

                observer.unobserve(element);
            }
        });
    }, observerOptions);

    // 观察所有动画元素
    const animatedElements = document.querySelectorAll('.fade-in, .slide-left, .slide-right, .scale-in');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// 性能优化的滚动处理
function initOptimizedScrollHandling() {
    let ticking = false;

    function updateScrollEffects() {
        const scrollTop = window.pageYOffset;

        // 视差效果
        const parallaxElements = document.querySelectorAll('.parallax');
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrollTop * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });

        ticking = false;
    }

    function requestScrollUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestScrollUpdate, { passive: true });
}

// 微交互增强
function initMicroInteractions() {
    // 按钮点击波纹效果
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn')) {
            createRippleEffect(e);
        }
    });

    // 卡片悬停效果
    const cards = document.querySelectorAll('.feature-item, .tech-item, .team-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = 'var(--box-shadow-xl)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'var(--box-shadow)';
        });
    });
}

function createRippleEffect(e) {
    const button = e.target;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    `;

    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// 滚动进度指示器
function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) return;

    function updateScrollProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;

        progressBar.style.width = scrollPercent + '%';
    }

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress(); // 初始化
}

// 初始化所有增强功能
document.addEventListener('DOMContentLoaded', function() {
    initEnhancedScrollAnimations();
    initOptimizedScrollHandling();
    initMicroInteractions();
});

// 添加CSS动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    .theme-toggle {
        background: none;
        border: none;
        cursor: pointer;
        padding: 8px;
        border-radius: var(--border-radius);
        transition: all var(--transition-smooth);
        color: var(--text-dark);
        position: relative;
        overflow: hidden;
    }

    .theme-toggle:hover {
        background-color: rgba(37, 99, 235, 0.1);
        transform: scale(1.1);
    }

    .theme-toggle .sun-icon,
    .theme-toggle .moon-icon {
        transition: all var(--transition-smooth);
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    [data-theme="light"] .theme-toggle .moon-icon,
    [data-theme="dark"] .theme-toggle .sun-icon {
        opacity: 0;
        transform: translate(-50%, -50%) rotate(180deg);
    }

    [data-theme="light"] .theme-toggle .sun-icon,
    [data-theme="dark"] .theme-toggle .moon-icon {
        opacity: 1;
        transform: translate(-50%, -50%) rotate(0deg);
    }

    .stagger-child {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s ease;
    }

    .stagger-child.visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// 高级滚动动画系统
function initAdvancedScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll, .feature-item, .tech-item, .team-card');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // 添加延迟效果，让动画更有层次
                setTimeout(() => {
                    entry.target.classList.add('in-view');
                }, index * 100);

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        element.classList.add('animate-on-scroll');
        observer.observe(element);
    });
}

// 图片懒加载系统
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy-image');
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => {
            img.classList.add('lazy-image');
            imageObserver.observe(img);
        });
    } else {
        // 降级处理：直接加载所有图片
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.classList.add('loaded');
        });
    }
}

// 增强的视觉效果
function initVisualEnhancements() {
    // 为主要图片添加悬浮效果
    const productImages = document.querySelectorAll('.main-product-image, .tech-diagram');
    productImages.forEach(img => {
        img.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05) rotate(1deg)';
        });

        img.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    // 添加背景渐变动画到hero区域
    const heroSection = document.querySelector('#hero');
    if (heroSection) {
        heroSection.classList.add('gradient-bg');
    }
}

// 地图功能初始化
function initMapSection() {
    const mapPlaceholder = document.querySelector('.map-placeholder');
    if (!mapPlaceholder) return;

    // 地图交互功能已简化，移除了遮挡地图的信息覆盖层

    // 为地图占位符添加交互功能
    mapPlaceholder.addEventListener('click', function() {
        // 可以在这里集成真实的高德地图
        showMapModal();
    });

    // 移除了地图信息覆盖层，避免遮挡地图内容
}

// 显示地图模态框（未来可集成真实地图）
function showMapModal() {
    const modal = document.createElement('div');
    modal.className = 'map-modal';
    modal.innerHTML = `
        <div class="map-modal-content">
            <div class="map-modal-header">
                <h3>灵维智驱科技位置</h3>
                <button class="close-map-modal">&times;</button>
            </div>
            <div class="map-modal-body">
                <div class="location-info">
                    <h4>📍 公司地址</h4>
                    <p>河南省开封市金明大道灵维科技园 A座 3层</p>
                    <h4>🚗 导航建议</h4>
                    <p>导航至"河南大学金明校区"，沿金明大道向南1.7公里</p>
                    <h4>📞 联系电话</h4>
                    <p>+86 1234 5678 90</p>
                </div>
                <div class="map-actions">
                    <button class="btn btn-primary" onclick="openExternalMap()">
                        在高德地图中打开
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // 关闭模态框
    const closeBtn = modal.querySelector('.close-map-modal');
    closeBtn.addEventListener('click', function() {
        document.body.removeChild(modal);
        document.body.style.overflow = 'auto';
    });

    // 点击外部关闭
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
            document.body.style.overflow = 'auto';
        }
    });
}

// 打开外部地图应用
function openExternalMap(routeType = 'marker') {
    const companyLng = 114.303356;
    const companyLat = 34.808166;
    const companyName = encodeURIComponent('灵维智驱科技');

    if (routeType === 'marker') {
        // 显示标记位置
        const amapUrl = `https://uri.amap.com/marker?position=${companyLng},${companyLat}&name=${companyName}&src=myapp&coordinate=gaode&callnative=1`;
        window.open(amapUrl, '_blank');
    } else {
        // 路线规划
        let url = `https://uri.amap.com/navigation?to=${companyLng},${companyLat}&toname=${companyName}&coordinate=gaode&callnative=1`;

        switch(routeType) {
            case 'driving':
                url += '&mode=car';
                break;
            case 'transit':
                url += '&mode=bus';
                break;
            case 'walking':
                url += '&mode=walk';
                break;
        }

        window.open(url, '_blank');
    }
}

// 路线规划功能（由HTML按钮调用）
// 这个函数已经被openExternalMap替代，保留以防兼容性问题
