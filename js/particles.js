/**
 * 灵维智驱科技 - WebGL粒子效果
 * 使用Three.js创建动态粒子背景
 */

class ParticleSystem {
    constructor(containerId) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        // 初始化变量
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;
        this.particleCount = this.isMobile() ? 1000 : 2000; // 根据设备性能调整粒子数量

        // 初始化场景
        this.init();
        this.animate();
    }

    isMobile() {
        return window.innerWidth <= 768;
    }

    init() {
        // 创建场景
        this.scene = new THREE.Scene();
        
        // 设置相机
        const aspectRatio = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspectRatio, 1, 5000);
        this.camera.position.z = 1000;
        
        // 创建粒子系统
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const sizes = [];
        const colors = [];
        
        // 定义颜色
        const primaryColor = new THREE.Color(0x1E88E5); // 蓝色
        const secondaryColor = new THREE.Color(0x4CAF50); // 绿色
        
        // 生成粒子
        for (let i = 0; i < this.particleCount; i++) {
            // 随机位置
            const x = Math.random() * 2000 - 1000;
            const y = Math.random() * 2000 - 1000;
            const z = Math.random() * 2000 - 1000;
            vertices.push(x, y, z);
            
            // 随机大小
            sizes.push(Math.random() * 5 + 2);
            
            // 根据位置生成介于主色和次色之间的颜色
            const distanceFromCenter = Math.sqrt(x * x + y * y + z * z);
            const maxDistance = Math.sqrt(3 * 1000 * 1000);
            const ratio = distanceFromCenter / maxDistance;
            
            const color = new THREE.Color().lerpColors(
                primaryColor,
                secondaryColor,
                Math.sin(ratio * Math.PI) // 使用正弦函数使过渡更平滑
            );
            
            colors.push(color.r, color.g, color.b);
        }
        
        // 设置几何体属性
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        
        // 创建粒子材质
        const material = new THREE.PointsMaterial({
            size: 5,
            sizeAttenuation: true,
            vertexColors: true,
            transparent: true,
            opacity: 0.7
        });
        
        // 创建粒子系统
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
        
        // 创建渲染器
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true 
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);
        
        // 添加事件监听
        document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this), false);
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
    }

    onDocumentMouseMove(event) {
        this.mouseX = (event.clientX - this.windowHalfX) * 0.05;
        this.mouseY = (event.clientY - this.windowHalfY) * 0.05;
    }

    onWindowResize() {
        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;
        
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    render() {
        // 缓慢旋转粒子系统
        const time = Date.now() * 0.00005;
        
        this.particles.rotation.x = time * 0.2;
        this.particles.rotation.y = time * 0.1;
        
        // 基于鼠标位置的相机动画
        this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.05;
        this.camera.position.y += (-this.mouseY - this.camera.position.y) * 0.05;
        this.camera.lookAt(this.scene.position);
        
        // 渲染场景
        this.renderer.render(this.scene, this.camera);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.render();
    }
}

// 当文档加载完成后初始化粒子系统
document.addEventListener('DOMContentLoaded', function() {
    // 检查是否存在粒子容器元素
    if (document.getElementById('particle-container')) {
        // 创建粒子系统实例
        const particleSystem = new ParticleSystem('particle-container');
    }
});
