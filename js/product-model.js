/**
 * 灵维智驱科技 - 产品3D模型查看�?(修复�?
 * 使用Three.js创建交互�?D产品展示
 */

class ProductModelViewer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('找不�?D模型容器:', containerId);
            return;
        }

        // 查找实际�?D渲染容器
        this.renderContainer = this.container.querySelector('#3d-container') || this.container;
        console.log('3D模型容器:', this.container);
        console.log('3D渲染容器:', this.renderContainer);

        // 确保容器有正确的尺寸
        this.ensureContainerSize();

        // 初始化变�?
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

        // 初始化场�?
        this.init();
        this.animate();
    }

    ensureContainerSize() {
        // 确保容器有正确的尺寸
        if (this.renderContainer.clientWidth === 0 || this.renderContainer.clientHeight === 0) {
            console.warn('⚠️ 容器尺寸�?，强制设置默认尺�?);
            this.renderContainer.style.width = '100%';
            this.renderContainer.style.height = '400px';
            this.renderContainer.style.minHeight = '400px';
            this.renderContainer.style.display = 'block';
        }
        
        console.log('容器最终尺�?', {
            width: this.renderContainer.clientWidth,
            height: this.renderContainer.clientHeight,
            offsetWidth: this.renderContainer.offsetWidth,
            offsetHeight: this.renderContainer.offsetHeight
        });
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #ffebee;
            color: #c62828;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #ffcdd2;
            font-family: Arial, sans-serif;
            text-align: center;
            z-index: 1000;
        `;
        errorDiv.innerHTML = `
            <div style="font-size: 16px; margin-bottom: 8px;">⚠️ 3D模型加载失败</div>
            <div style="font-size: 14px;">${message}</div>
        `;
        this.renderContainer.appendChild(errorDiv);
    }

    init() {
        // 首先检查Three.js是否加载
        if (typeof THREE === 'undefined') {
            console.error('�?Three.js未加载！');
            this.showError('Three.js库未正确加载，请检查网络连�?);
            return;
        }

        // 创建加载管理�?
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
        this.scene.background = new THREE.Color(0xf5f5f5);

        // 设置雾效果，增加深度�?
        this.scene.fog = new THREE.Fog(0xf5f5f5, 10, 50);

        // 创建摄像�?
        const containerWidth = this.renderContainer.clientWidth || 400;
        const containerHeight = this.renderContainer.clientHeight || 400;
        const aspectRatio = containerWidth / containerHeight;

        console.log('渲染器尺�?', { width: containerWidth, height: containerHeight, aspectRatio });

        this.camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 1000);
        this.camera.position.set(0, 5, 10);

        // 创建渲染�?
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 限制像素比以提高性能
        this.renderer.setSize(containerWidth, containerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1;
        this.renderContainer.appendChild(this.renderer.domElement);

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

        // 添加网格辅助�?
        const gridHelper = new THREE.GridHelper(20, 40, 0x888888, 0xcccccc);
        gridHelper.position.y = 0.001;
        this.scene.add(gridHelper);

        // 设置光照
        this.setupLighting();

        // 加载3D模型
        this.loadModel();

        // 添加窗口调整大小的事件监听器
        window.addEventListener('resize', this.onWindowResize.bind(this), false);

        // 添加加载屏幕
        this.createLoadingScreen();

        // 设置控制按钮
        this.setupControlButtons();
    }

    setupLighting() {
        // 添加环境�?
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        this.lights.push(ambientLight);

        // 添加主要方向�?
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7.5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 30;
        directionalLight.shadow.camera.left = -10;
        directionalLight.shadow.camera.right = 10;
        directionalLight.shadow.camera.top = 10;
        directionalLight.shadow.camera.bottom = -10;
        this.scene.add(directionalLight);
        this.lights.push(directionalLight);

        // 添加填充�?
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(-5, 3, -5);
        this.scene.add(fillLight);
        this.lights.push(fillLight);
    }

    // 初始化控制器（在扩展加载后调用）
    initControls() {
        if (typeof THREE.OrbitControls !== 'undefined' && !this.controls) {
            console.log('🎮 初始化OrbitControls...');
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.screenSpacePanning = false;
            this.controls.minDistance = 3;
            this.controls.maxDistance = 15;
            this.controls.maxPolarAngle = Math.PI / 2;
            console.log('�?OrbitControls 初始化完�?);
        }
    }

    setupControlButtons() {
        // 设置手动控制按钮
        const rotateLeftBtn = document.getElementById('rotateLeft');
        const rotateRightBtn = document.getElementById('rotateRight');
        const zoomInBtn = document.getElementById('zoomIn');
        const zoomOutBtn = document.getElementById('zoomOut');

        if (rotateLeftBtn) {
            rotateLeftBtn.addEventListener('click', () => {
                if (this.model) {
                    this.model.rotation.y -= 0.2;
                }
            });
        }

        if (rotateRightBtn) {
            rotateRightBtn.addEventListener('click', () => {
                if (this.model) {
                    this.model.rotation.y += 0.2;
                }
            });
        }

        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', () => {
                if (this.camera) {
                    this.camera.position.z = Math.max(this.camera.position.z - 1, 2);
                }
            });
        }

        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', () => {
                if (this.camera) {
                    this.camera.position.z = Math.min(this.camera.position.z + 1, 15);
                }
            });
        }

        console.log('�?控制按钮设置完成');
    }

    loadModel() {
        console.log('开始加�?D模型...');
        console.log('THREE.FBXLoader 可用�?', typeof THREE.FBXLoader !== 'undefined');

        // 先创建占位符模型，确保场景有内容显示
        this.createPlaceholderModel();

        // 如果FBXLoader可用，尝试加载真实模�?
        if (typeof THREE.FBXLoader !== 'undefined') {
            console.log('FBXLoader可用，尝试加载真实模�?);
            setTimeout(() => {
                this.loadFBXModel();
            }, 1000); // 延迟1秒加载，让占位符先显�?
        } else {
            console.log('FBXLoader不可用，继续使用占位符模�?);
        }
    }

    loadFBXModel() {
        // 创建FBX加载�?
        const fbxLoader = new THREE.FBXLoader(this.loadingManager);

        // 尝试加载完整模型（带材质�?
        const modelPath = './鞋垫/鞋垫.fbx';
        console.log('尝试加载FBX文件:', modelPath);

        fbxLoader.load(modelPath, (fbx) => {
            console.log('�?FBX模型加载成功!');
            console.log('FBX模型原始信息:', fbx);
            console.log('模型子对象数�?', fbx.children.length);

            // 移除占位符模�?
            if (this.model) {
                this.scene.remove(this.model);
                console.log('移除占位符模�?);
            }

            this.model = fbx;

            // 计算模型边界盒以确定合适的缩放
            const box = new THREE.Box3().setFromObject(fbx);
            const size = box.getSize(new THREE.Vector3());
            console.log('模型原始尺寸:', size);

            // 根据模型大小自动调整缩放
            const maxDimension = Math.max(size.x, size.y, size.z);
            console.log('最大尺�?', maxDimension);

            let scale;
            if (maxDimension > 10000) {
                // 超大模型，使用更大的固定缩放
                scale = 2.0;
                console.log('检测到超大模型，使用固定缩�?', scale);
            } else {
                // 正常大小模型
                const targetSize = 5;
                scale = maxDimension > 0 ? targetSize / maxDimension : 1;
                console.log('正常模型，计算缩�?', scale);
            }

            // 调整模型尺寸和位�?
            this.model.scale.set(scale, scale, scale);
            this.model.position.set(0, 0, 0);
            this.model.rotation.set(0, 0, 0);

            // 为模型中的每个网格启用阴影和改善材质
            this.model.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;

                    // 保留原始材质，只做必要的优化
                    if (child.material) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach((mat) => {
                                if (mat.map) {
                                    console.log('发现贴图:', mat.map);
                                }
                                mat.needsUpdate = true;
                            });
                        } else {
                            if (child.material.map) {
                                console.log('发现贴图:', child.material.map);
                            }
                            child.material.needsUpdate = true;
                        }
                    }
                }
            });

            console.log('FBX模型加载成功，模型信�?', {
                position: this.model.position,
                scale: this.model.scale,
                rotation: this.model.rotation,
                children: this.model.children.length
            });

            // 将模型添加到场景
            this.scene.add(this.model);
            console.log('�?模型已添加到场景');

            // 处理动画（如果有�?
            const animations = fbx.animations;
            if (animations && animations.length) {
                console.log(`发现 ${animations.length} 个动画`);
                const mixer = new THREE.AnimationMixer(this.model);
                this.animationMixers.push(mixer);

                animations.forEach((clip) => {
                    const action = mixer.clipAction(clip);
                    action.play();
                });
            }

            // 自动聚焦模型
            this.focusModel();

            console.log('🎉 3D模型完全加载完成�?);

        }, (progress) => {
            // 加载进度回调
            if (progress.total > 0) {
                const percent = Math.round((progress.loaded / progress.total) * 100);
                console.log('FBX模型加载进度:', percent + '%');
            }
        }, (error) => {
            console.error('�?FBX模型加载失败:', error);
            console.log('🔄 尝试加载白模版本');
            this.loadWhiteModel();
        });
    }

    loadWhiteModel() {
        console.log('🔄 尝试加载白模版本...');
        const fbxLoader = new THREE.FBXLoader(this.loadingManager);
        const whiteModelPath = './鞋垫/鞋垫(白模).fbx';

        fbxLoader.load(whiteModelPath, (fbx) => {
            console.log('�?白模FBX加载成功!');
            
            // 移除占位�?
            if (this.model) {
                this.scene.remove(this.model);
            }
            
            this.model = fbx;

            // 使用相同的缩放逻辑
            const box = new THREE.Box3().setFromObject(fbx);
            const size = box.getSize(new THREE.Vector3());
            const maxDimension = Math.max(size.x, size.y, size.z);

            let scale = maxDimension > 10000 ? 2.0 : 5.0 / maxDimension;
            this.model.scale.set(scale, scale, scale);
            this.model.position.set(0, 0, 0);

            // 添加简单材�?
            this.model.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.material = new THREE.MeshStandardMaterial({
                        color: 0x2E7D32, // 绿色
                        roughness: 0.4,
                        metalness: 0.2
                    });
                }
            });

            this.scene.add(this.model);
            this.focusModel();
            console.log('�?白模加载完成');

        }, undefined, (error) => {
            console.error('�?白模也加载失败，继续使用占位�?', error);
            // 保持占位符模�?
        });
    }

    createPlaceholderModel() {
        console.log('🎯 创建占位符模�?..');

        try {
            // 创建一个简单但有效的鞋垫形�?
            const geometry = new THREE.BoxGeometry(4, 0.2, 6);

            // 创建材质
            const material = new THREE.MeshStandardMaterial({
                color: 0x1E88E5,
                roughness: 0.4,
                metalness: 0.2,
                transparent: true,
                opacity: 0.9
            });

            this.model = new THREE.Mesh(geometry, material);
            this.model.position.set(0, 0.1, 0);
            this.model.castShadow = true;
            this.model.receiveShadow = true;

            this.scene.add(this.model);
            console.log('�?基础占位符模型创建成�?);

            // 添加一些装饰性元素来表示传感�?
            this.addSimpleSensors();

        } catch (error) {
            console.error('�?占位符模型创建失�?', error);
            // 创建最简单的立方体作为备�?
            const geometry = new THREE.BoxGeometry(2, 0.5, 3);
            const material = new THREE.MeshBasicMaterial({ color: 0x1E88E5 });
            this.model = new THREE.Mesh(geometry, material);
            this.model.position.set(0, 0.25, 0);
            this.scene.add(this.model);
            console.log('�?备用立方体模型创建成�?);
        }

        console.log('�?占位符模型创建完�?);

        // 如果没有FBXLoader，则手动触发加载完成
        if (typeof THREE.FBXLoader === 'undefined') {
            setTimeout(() => {
                this.hideLoadingScreen();
                this.isLoaded = true;
            }, 1000);
        }
    }

    addSimpleSensors() {
        try {
            // 创建简单的传感器点
            const sensorGeometry = new THREE.SphereGeometry(0.1, 8, 8);
            const sensorMaterial = new THREE.MeshStandardMaterial({
                color: 0x4CAF50,
                emissive: 0x004400,
                emissiveIntensity: 0.3
            });

            // 在鞋垫上添加几个传感器点
            const sensorPositions = [
                { x: -1, y: 0.2, z: -2 }, // 前脚掌左
                { x: 1, y: 0.2, z: -2 },  // 前脚掌右
                { x: 0, y: 0.2, z: 0 },   // 中足
                { x: -0.5, y: 0.2, z: 2 }, // 后跟�?
                { x: 0.5, y: 0.2, z: 2 }   // 后跟�?
            ];

            sensorPositions.forEach((pos, index) => {
                const sensor = new THREE.Mesh(sensorGeometry, sensorMaterial.clone());
                sensor.position.set(pos.x, pos.y, pos.z);
                sensor.castShadow = true;
                this.scene.add(sensor);
            });

            console.log('�?简单传感器添加完成');
        } catch (error) {
            console.error('�?传感器添加失�?', error);
        }
    }

    focusModel() {
        if (!this.model) return;

        // 创建一个边界盒来包含整个模�?
        const boundingBox = new THREE.Box3().setFromObject(this.model);
        const center = boundingBox.getCenter(new THREE.Vector3());
        const size = boundingBox.getSize(new THREE.Vector3());

        // 获取模型的最大尺�?
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = this.camera.fov * (Math.PI / 180);
        let cameraDistance = (maxDim / 2) / Math.tan(fov / 2);

        // 增加一点距离以确保模型完全可见
        cameraDistance *= 1.2;

        // 设置相机位置
        this.camera.position.copy(center);
        this.camera.position.z += cameraDistance;
        this.camera.lookAt(center);

        // 更新控制器目�?
        if (this.controls) {
            this.controls.target.copy(center);
            this.controls.update();
        }
    }

    createLoadingScreen() {
        // 创建加载指示�?
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'model-loading';
        loadingDiv.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(245, 245, 245, 0.9);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            transition: opacity 0.5s ease;
        `;
        loadingDiv.innerHTML = `
            <div style="width: 40px; height: 40px; border: 4px solid #e3e3e3; border-top: 4px solid #1E88E5; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 15px;"></div>
            <div style="color: #666; font-size: 14px; margin-bottom: 15px;">正在加载3D模型...</div>
            <div style="width: 200px; height: 4px; background: #e3e3e3; border-radius: 2px; overflow: hidden;">
                <div class="loading-bar" style="height: 100%; background: #1E88E5; width: 0%; transition: width 0.3s ease;"></div>
            </div>
        `;

        // 添加旋转动画CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            .fade-out {
                opacity: 0 !important;
            }
        `;
        document.head.appendChild(style);

        this.container.appendChild(loadingDiv);

        // 保存对加载条元素的引�?
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
        const width = this.renderContainer.clientWidth || 400;
        const height = this.renderContainer.clientHeight || 400;

        console.log('窗口调整大小:', { width, height });

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        // 更新控制�?
        if (this.controls) {
            this.controls.update();
        }

        // 更新动画混合�?
        if (this.animationMixers.length > 0) {
            const delta = this.clock.getDelta();
            this.animationMixers.forEach(mixer => {
                mixer.update(delta);
            });
        }

        // 旋转模型（如果没有控制器或者模型正在加载）
        if (this.model && (!this.controls || !this.isLoaded)) {
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
    // 检查是否存在产品模型容器元�?
    if (document.getElementById('product-3d-model')) {
        // 动态加载必要的Three.js扩展
        loadThreeJSExtensions().then(() => {
            console.log('🚀 开始初始化3D模型查看�?..');

            // 移除占位符图片和相关元素
            const placeholderImg = document.querySelector('#product-3d-model .product-3d-img');

            if (placeholderImg && placeholderImg.parentNode) {
                placeholderImg.parentNode.removeChild(placeholderImg);
            }

            // 创建产品模型查看器实�?
            window.productModelViewer = new ProductModelViewer('product-3d-model');

            // 在扩展加载完成后初始化控制器
            if (window.productModelViewer) {
                window.productModelViewer.initControls();
            }
        }).catch((error) => {
            console.error('Three.js扩展加载失败:', error);
            console.log('🔄 尝试使用基本查看�?..');

            // 即使扩展加载失败，也尝试创建基本的查看器
            const placeholderImg = document.querySelector('#product-3d-model .product-3d-img');

            if (placeholderImg && placeholderImg.parentNode) {
                placeholderImg.parentNode.removeChild(placeholderImg);
            }

            window.productModelViewer = new ProductModelViewer('product-3d-model');
        });
    }
});

// 动态加载Three.js扩展的函�?
function loadThreeJSExtensions() {
    return new Promise((resolve, reject) => {
        let loadedCount = 0;
        const totalScripts = 2;

        function checkComplete() {
            loadedCount++;
            console.log(`已加�?${loadedCount}/${totalScripts} 个扩展`);
            if (loadedCount === totalScripts) {
                console.log('�?所有Three.js扩展加载完成');
                resolve();
            }
        }

        function handleError(error, scriptName) {
            console.warn(`Three.js扩展 ${scriptName} 加载警告:`, error);
            checkComplete(); // 即使失败也继续，使用回退方案
        }

        // 加载OrbitControls - 使用jsdelivr CDN
        const orbitScript = document.createElement('script');
        orbitScript.src = 'https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/controls/OrbitControls.js';
        orbitScript.onload = () => {
            console.log('�?OrbitControls 加载成功');
            checkComplete();
        };
        orbitScript.onerror = (error) => handleError(error, 'OrbitControls');
        document.head.appendChild(orbitScript);

        // 加载FBXLoader - 使用jsdelivr CDN
        const fbxScript = document.createElement('script');
        fbxScript.src = 'https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/loaders/FBXLoader.js';
        fbxScript.onload = () => {
            console.log('�?FBXLoader 加载成功');
            checkComplete();
        };
        fbxScript.onerror = (error) => handleError(error, 'FBXLoader');
        document.head.appendChild(fbxScript);
    });
}
