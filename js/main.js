/**
 * 灵维智驱科技 - 主JavaScript文件
 * 包含网站的核心功能和交互效果
 */

document.addEventListener('DOMContentLoaded', function() {
    // 页面加载完成后移除加载动画
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        window.addEventListener('load', function() {
            loadingElement.style.opacity = '0';
            setTimeout(function() {
                loadingElement.style.display = 'none';
            }, 500);
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

    // 统计数字动画
    const statistics = document.querySelectorAll('.statistic-number');
    
    if (statistics.length > 0) {
        const animateStatistics = () => {
            statistics.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                const duration = 2000; // 持续2秒
                const startTime = performance.now();
                const startValue = 0;
                
                const updateNumber = (currentTime) => {
                    const elapsedTime = currentTime - startTime;
                    const progress = Math.min(elapsedTime / duration, 1);
                    const currentValue = Math.floor(progress * (target - startValue) + startValue);
                    
                    stat.textContent = currentValue.toLocaleString();
                    
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
                    animateStatistics();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        // 观察包含统计数字的容器
        const statsSection = document.querySelector('#statistics');
        if (statsSection) {
            observer.observe(statsSection);
        }
    }

    // 产品特性手风琴效果 - 修复版本
    const featureTabs = document.querySelectorAll('.feature-tab');
    
    if (featureTabs.length > 0) {
        featureTabs.forEach(tab => {
            const header = tab.querySelector('.feature-header');
            const content = tab.querySelector('.feature-content');
            const toggleIcon = tab.querySelector('.toggle-icon');
            
            header.addEventListener('click', () => {
                // 获取当前展开状态
                const isActive = tab.classList.contains('active');
                
                // 先关闭所有项
                featureTabs.forEach(otherTab => {
                    if (otherTab !== tab) {
                        otherTab.classList.remove('active');
                        const otherContent = otherTab.querySelector('.feature-content');
                        const otherIcon = otherTab.querySelector('.toggle-icon');
                        if (otherContent) {
                            otherContent.style.display = 'none';
                        }
                        if (otherIcon) {
                            otherIcon.textContent = '+';
                        }
                    }
                });
                
                // 切换当前项
                if (isActive) {
                    tab.classList.remove('active');
                    if (content) {
                        content.style.display = 'none';
                    }
                    if (toggleIcon) {
                        toggleIcon.textContent = '+';
                    }
                } else {
                    tab.classList.add('active');
                    if (content) {
                        content.style.display = 'block';
                    }
                    if (toggleIcon) {
                        toggleIcon.textContent = '-';
                    }
                }
            });
        });
    }

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
      // 初始化页面内导航
    initPageNavigation();
    
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
