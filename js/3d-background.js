/**
 * 3D动态背景效果 - 智谱AI风格
 * 创建类似智谱AI官网的3D螺旋背景效果
 */

class ZhipuBackground {
    constructor(container) {
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = [];
        this.spiralGroup = null;
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        if (!window.THREE) {
            console.warn('Three.js not loaded');
            return;
        }
        
        this.setupScene();
        this.createSpiral();
        this.createParticles();
        this.setupLighting();
        this.animate();
        this.handleResize();
    }
    
    setupScene() {
        // 创建场景
        this.scene = new THREE.Scene();
        
        // 创建相机
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;
        
        // 创建渲染器
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setClearColor(0x000000, 0);
        this.container.appendChild(this.renderer.domElement);
    }
    
    createSpiral() {
        this.spiralGroup = new THREE.Group();
        
        // 创建螺旋几何体
        const spiralGeometry = new THREE.BufferGeometry();
        const spiralPositions = [];
        const spiralColors = [];
        
        const spiralCount = 3;
        const pointsPerSpiral = 200;
        
        for (let s = 0; s < spiralCount; s++) {
            for (let i = 0; i < pointsPerSpiral; i++) {
                const t = (i / pointsPerSpiral) * Math.PI * 4;
                const radius = 0.5 + (i / pointsPerSpiral) * 2;
                const height = (i / pointsPerSpiral) * 4 - 2;
                
                const x = Math.cos(t + (s * Math.PI * 2 / spiralCount)) * radius;
                const y = height;
                const z = Math.sin(t + (s * Math.PI * 2 / spiralCount)) * radius;
                
                spiralPositions.push(x, y, z);
                
                // 渐变颜色
                const hue = (i / pointsPerSpiral) * 0.3 + s * 0.1;
                const color = new THREE.Color().setHSL(0.6 + hue, 0.8, 0.6);
                spiralColors.push(color.r, color.g, color.b);
            }
        }
        
        spiralGeometry.setAttribute('position', new THREE.Float32BufferAttribute(spiralPositions, 3));
        spiralGeometry.setAttribute('color', new THREE.Float32BufferAttribute(spiralColors, 3));
        
        // 创建螺旋材质
        const spiralMaterial = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        const spiralPoints = new THREE.Points(spiralGeometry, spiralMaterial);
        this.spiralGroup.add(spiralPoints);
        
        // 添加连接线
        const lineGeometry = new THREE.BufferGeometry();
        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(spiralPositions, 3));
        lineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(spiralColors, 3));
        
        const lineMaterial = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.2,
            blending: THREE.AdditiveBlending
        });
        
        const spiralLines = new THREE.Line(lineGeometry, lineMaterial);
        this.spiralGroup.add(spiralLines);
        
        this.scene.add(this.spiralGroup);
    }
    
    createParticles() {
        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = 1000;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        for (let i = 0; i < particleCount; i++) {
            // 随机位置
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
            
            // 随机颜色
            const color = new THREE.Color();
            color.setHSL(0.6 + Math.random() * 0.2, 0.8, 0.5 + Math.random() * 0.3);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
            
            // 随机大小
            sizes[i] = Math.random() * 0.03 + 0.01;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const particleMaterial = new THREE.PointsMaterial({
            size: 0.02,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        this.particles = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(this.particles);
    }
    
    setupLighting() {
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);
        
        const pointLight = new THREE.PointLight(0x3b82f6, 1, 100);
        pointLight.position.set(10, 10, 10);
        this.scene.add(pointLight);
    }
    
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.001;
        
        // 旋转螺旋
        if (this.spiralGroup) {
            this.spiralGroup.rotation.y = time * 0.1;
            this.spiralGroup.rotation.x = Math.sin(time * 0.05) * 0.2;
        }
        
        // 旋转粒子
        if (this.particles) {
            this.particles.rotation.y = time * 0.05;
            this.particles.rotation.x = time * 0.02;
        }
        
        // 相机轻微移动
        this.camera.position.x = Math.sin(time * 0.1) * 0.5;
        this.camera.position.y = Math.cos(time * 0.1) * 0.3;
        this.camera.lookAt(this.scene.position);
        
        this.renderer.render(this.scene, this.camera);
    }
    
    handleResize() {
        window.addEventListener('resize', () => {
            const width = this.container.clientWidth;
            const height = this.container.clientHeight;
            
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
        });
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.renderer) {
            this.container.removeChild(this.renderer.domElement);
            this.renderer.dispose();
        }
        
        // 清理几何体和材质
        this.scene.traverse((object) => {
            if (object.geometry) {
                object.geometry.dispose();
            }
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
    }
}

// 初始化3D背景
document.addEventListener('DOMContentLoaded', function() {
    const particleContainer = document.getElementById('particle-container');
    if (particleContainer && window.THREE) {
        const background = new ZhipuBackground(particleContainer);
        
        // 在页面卸载时清理资源
        window.addEventListener('beforeunload', () => {
            background.destroy();
        });
    }
});
