/**
 * 灵维智驱科技 - 产品3D模型查看器
 * 使用Three.js创建交互式3D产品展示
 */

class ProductModelViewer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        // 初始化变量
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.model = null;
        this.controls = null;
        this.lights = [];
        this.clock = new THREE.Clock();
        this.animationMixers = [];
        this.loadingManager = null;
        this.isLoaded = false;

        // 初始化场景
        this.init();
        this.animate();
    }

    init() {
        // 创建加载管理器
        this.loadingManager = new THREE.LoadingManager();
        this.loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
            const progressPercent = Math.round((itemsLoaded / itemsTotal) * 100);
            this.updateLoadingProgress(progressPercent);
        };
        
        this.loadingManager.onLoad = () => {
            this.hideLoadingScreen();
            this.isLoaded = true;
        };

        // 创建场景
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf0f0f0);
        
        // 设置雾效果，增加深度感
        this.scene.fog = new THREE.Fog(0xf0f0f0, 10, 50);
        
        // 创建摄像机
        const aspectRatio = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 100);
        this.camera.position.set(0, 1.5, 6);
        
        // 创建渲染器
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1;
        this.container.appendChild(this.renderer.domElement);
        
        // 创建地面
        const groundGeometry = new THREE.PlaneGeometry(20, 20);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.8,
            metalness: 0.2
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        // 添加网格辅助线
        const gridHelper = new THREE.GridHelper(20, 40, 0x888888, 0xcccccc);
        gridHelper.position.y = 0.001; // 略高于地面以避免z-fighting
        this.scene.add(gridHelper);

        // 添加环境光
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        this.lights.push(ambientLight);

        // 添加方向光（模拟太阳光）
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7.5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 30;
        
        // 设置阴影相机参数
        directionalLight.shadow.camera.left = -10;
        directionalLight.shadow.camera.right = 10;
        directionalLight.shadow.camera.top = 10;
        directionalLight.shadow.camera.bottom = -10;
        
        this.scene.add(directionalLight);
        this.lights.push(directionalLight);

        // 添加聚光灯（强调产品）
        const spotLight = new THREE.SpotLight(0xffffff, 0.7);
        spotLight.position.set(-5, 8, -2);
        spotLight.angle = Math.PI / 6;
        spotLight.penumbra = 0.2;
        spotLight.decay = 2;
        spotLight.distance = 50;
        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 1024;
        spotLight.shadow.mapSize.height = 1024;
        this.scene.add(spotLight);
        this.lights.push(spotLight);

        // 添加轨道控制器以便用户可以旋转、缩放和平移场景
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true; // 添加阻尼效果使控制更平滑
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 3;
        this.controls.maxDistance = 15;
        this.controls.maxPolarAngle = Math.PI / 2; // 限制用户不能查看模型底部

        // 加载3D模型
        this.loadModel();

        // 添加窗口调整大小的事件监听器
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
        
        // 添加加载屏幕
        this.createLoadingScreen();
    }

    loadModel() {
        // 在实际项目中，这里会加载真实的3D模型
        // 例如：gltf、fbx、obj等格式
        // 以下是一个占位符，创建一个简单的几何体代表产品
        // 后期可以替换为实际的产品3D模型
        
        // 创建一个简单的产品模型（临时）
        const geometry = new THREE.BoxGeometry(1, 0.2, 2); // 类似跑步鞋垫的形状
        
        // 创建材质
        const material = new THREE.MeshStandardMaterial({
            color: 0x1E88E5,
            roughness: 0.3,
            metalness: 0.1
        });
        
        this.model = new THREE.Mesh(geometry, material);
        this.model.position.y = 0.1; // 放在地面上方一点
        this.model.castShadow = true;
        this.model.receiveShadow = true;
        this.scene.add(this.model);
        
        // 添加鞋垫上的传感器点（细节）
        this.addSensorPoints();
        
        /*
        // 以下是加载实际GLTF模型的代码，后期可以替换
        const gltfLoader = new THREE.GLTFLoader(this.loadingManager);
        gltfLoader.load('path/to/product-model.gltf', (gltf) => {
            this.model = gltf.scene;
            this.model.scale.set(1, 1, 1); // 根据需要调整模型尺寸
            
            // 为模型中的每个网格启用阴影
            this.model.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    
                    // 改善材质渲染
                    if (child.material) {
                        child.material.roughness = 0.7;
                    }
                }
            });
            
            // 将模型添加到场景
            this.scene.add(this.model);
            
            // 处理动画
            const animations = gltf.animations;
            if (animations && animations.length) {
                const mixer = new THREE.AnimationMixer(this.model);
                this.animationMixers.push(mixer);
                
                animations.forEach((clip) => {
                    mixer.clipAction(clip).play();
                });
            }
            
            // 自动聚焦模型
            this.focusModel();
        }, undefined, (error) => {
            console.error('模型加载错误:', error);
        });
        */
    }

    addSensorPoints() {
        // 传感器位置定义（相对于鞋垫的位置）
        const sensorPositions = [
            // 前脚掌
            new THREE.Vector3(0.3, 0.11, -0.7),
            new THREE.Vector3(-0.3, 0.11, -0.7),
            new THREE.Vector3(0, 0.11, -0.8),
            
            // 中足
            new THREE.Vector3(0.3, 0.11, 0),
            new THREE.Vector3(-0.3, 0.11, 0),
            
            // 后跟
            new THREE.Vector3(0.2, 0.11, 0.7),
            new THREE.Vector3(-0.2, 0.11, 0.7),
            new THREE.Vector3(0, 0.11, 0.8)
        ];
        
        // 创建传感器几何体和材质
        const sensorGeometry = new THREE.SphereGeometry(0.05, 16, 16);
        const sensorMaterial = new THREE.MeshStandardMaterial({
            color: 0x4CAF50,
            roughness: 0.2,
            metalness: 0.5,
            emissive: 0x4CAF50,
            emissiveIntensity: 0.2
        });
        
        // 创建传感器网格并添加到场景
        sensorPositions.forEach((position, index) => {
            const sensor = new THREE.Mesh(sensorGeometry, sensorMaterial);
            sensor.position.copy(position);
            sensor.castShadow = true;
            sensor.receiveShadow = true;
            sensor.name = `sensor_${index}`;
            this.scene.add(sensor);
            
            // 周期性动画以突出显示传感器
            this.animateSensor(sensor, index);
        });
    }

    animateSensor(sensor, index) {
        // 使用GSAP创建脉冲动画
        const timeline = gsap.timeline({
            repeat: -1,
            delay: index * 0.2 // 错开每个传感器的动画
        });
        
        timeline.to(sensor.material, {
            emissiveIntensity: 0.8,
            duration: 0.5,
            ease: "power2.inOut"
        });
        
        timeline.to(sensor.material, {
            emissiveIntensity: 0.2,
            duration: 0.5,
            ease: "power2.inOut"
        });
        
        timeline.to(sensor.scale, {
            x: 1.2,
            y: 1.2,
            z: 1.2,
            duration: 0.5,
            ease: "power2.inOut"
        }, 0);
        
        timeline.to(sensor.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 0.5,
            ease: "power2.inOut"
        }, 0.5);
    }

    focusModel() {
        if (!this.model) return;

        // 创建一个边界盒来包含整个模型
        const boundingBox = new THREE.Box3().setFromObject(this.model);
        const center = boundingBox.getCenter(new THREE.Vector3());
        const size = boundingBox.getSize(new THREE.Vector3());

        // 获取模型的最大尺寸
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = this.camera.fov * (Math.PI / 180);
        let cameraDistance = (maxDim / 2) / Math.tan(fov / 2);

        // 增加一点距离以确保模型完全可见
        cameraDistance *= 1.2;

        // 设置相机位置
        this.camera.position.copy(center);
        this.camera.position.z += cameraDistance;
        this.camera.lookAt(center);

        // 更新控制器目标
        this.controls.target.copy(center);
        this.controls.update();
    }

    createLoadingScreen() {
        // 创建加载指示器
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'model-loading';
        loadingDiv.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-text">加载中...</div>
            <div class="loading-bar-container">
                <div class="loading-bar"></div>
            </div>
        `;
        this.container.appendChild(loadingDiv);

        // 保存对加载条元素的引用
        this.loadingBar = loadingDiv.querySelector('.loading-bar');
        this.loadingScreen = loadingDiv;
    }

    updateLoadingProgress(percent) {
        if (this.loadingBar) {
            this.loadingBar.style.width = `${percent}%`;
        }
    }

    hideLoadingScreen() {
        if (this.loadingScreen) {
            this.loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                if (this.loadingScreen && this.loadingScreen.parentNode) {
                    this.loadingScreen.parentNode.removeChild(this.loadingScreen);
                }
            }, 500);
        }
    }

    onWindowResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        // 更新控制器
        if (this.controls) {
            this.controls.update();
        }
        
        // 更新动画混合器
        if (this.animationMixers.length > 0) {
            const delta = this.clock.getDelta();
            this.animationMixers.forEach(mixer => {
                mixer.update(delta);
            });
        }
        
        // 旋转模型
        if (this.model && !this.isLoaded) {
            this.model.rotation.y += 0.01;
        }
        
        this.render();
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}

// 当文档加载完成后初始化模型查看器
document.addEventListener('DOMContentLoaded', function() {
    // 检查是否存在产品模型容器元素
    if (document.getElementById('product-3d-model')) {
        // 动态加载OrbitControls
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/controls/OrbitControls.js';
        document.head.appendChild(script);
        
        script.onload = function() {
            // 移除占位符图片
            const placeholder = document.querySelector('#product-3d-model .placeholder-img');
            if (placeholder && placeholder.parentNode) {
                placeholder.parentNode.removeChild(placeholder);
            }
            
            // 创建产品模型查看器实例
            const productModelViewer = new ProductModelViewer('product-3d-model');
        };
    }
});
