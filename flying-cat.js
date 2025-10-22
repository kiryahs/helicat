// HeliCat Flying Cat 3D Animation
// Makes the 3D cat fly along the candlestick chart!

class FlyingCat {
    constructor() {
        this.canvas = document.getElementById('flying-cat-canvas');
        if (!this.canvas) {
            console.error('❌ Flying cat canvas not found!');
            return;
        }

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.catModel = null;
        this.time = 0;
        this.flyDirection = 1; // 1 = right, -1 = left
        this.xPosition = -300; // Start position
        this.speed = 2; // Pixels per frame

        this.init();
    }

    init() {
        console.log('🐱 Initializing flying cat...');

        // Scene setup
        this.scene = new THREE.Scene();

        // Camera setup - perspective camera for better 3D view
        const container = document.getElementById('flying-cat-container');
        const width = container.clientWidth;
        const height = container.clientHeight;

        this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 2000);
        this.camera.position.set(0, 0, 300); // Further back to see the whole cat
        this.camera.lookAt(0, 0, 0);

        console.log(`📐 Flying cat canvas: ${width}x${height}`);

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0); // Transparent

        console.log('✅ Flying cat scene created');

        // BETTER LIGHTING - multiple lights for visibility
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
        this.scene.add(ambientLight);

        const keyLight = new THREE.DirectionalLight(0xffffff, 1.0);
        keyLight.position.set(10, 10, 10);
        this.scene.add(keyLight);

        const fillLight = new THREE.DirectionalLight(0xff9955, 0.5);
        fillLight.position.set(-10, 0, 5);
        this.scene.add(fillLight);

        const backLight = new THREE.DirectionalLight(0x88ccff, 0.3);
        backLight.position.set(0, -10, -10);
        this.scene.add(backLight);

        console.log('✅ Lighting configured');

        // Load the cat model
        this.loadCatModel();

        // Handle resize
        window.addEventListener('resize', () => this.onResize());

        // Start animation
        this.animate();

        console.log('✅ Flying cat initialized');
    }

    loadCatModel() {
        const loader = new THREE.GLTFLoader();

        loader.load(
            'cat model/silleboi.glb',

            // Success
            (gltf) => {
                console.log('✅ Flying cat model loaded!');

                this.catModel = gltf.scene;

                // Enhance materials to ensure visibility while preserving original colors
                this.catModel.traverse((child) => {
                    if (child.isMesh) {
                        console.log('🎨 Found mesh:', child.name);

                        // Preserve original material but enhance it
                        if (child.material) {
                            // Make sure both sides are rendered
                            child.material.side = THREE.DoubleSide;

                            // Ensure material is properly lit
                            if (child.material.metalness !== undefined) {
                                // Keep original metalness but ensure it's not too high
                                child.material.metalness = Math.min(child.material.metalness, 0.5);
                            }

                            console.log(`  Material type: ${child.material.type}, Color:`, child.material.color);
                        }

                        // Enable shadows
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                // MUCH LARGER SCALE - make cat very visible
                this.catModel.scale.set(80, 80, 80);

                // Rotate for side view - facing right
                this.catModel.rotation.y = Math.PI / 2; // Face right

                // Position initially off-screen left
                this.catModel.position.set(-400, 0, 0);

                this.scene.add(this.catModel);

                console.log('✅ Flying cat model added to scene');
                console.log('🔧 Cat scale:', this.catModel.scale);
                console.log('🔧 Cat rotation:', this.catModel.rotation);
                console.log('🔧 Cat position:', this.catModel.position);
            },

            // Progress
            (xhr) => {
                const percent = (xhr.loaded / xhr.total * 100).toFixed(0);
                console.log(`📦 Loading flying cat: ${percent}%`);
            },

            // Error
            (error) => {
                console.error('❌ Error loading flying cat model:', error);
                // Create fallback simple cat shape
                this.createFallbackCat();
            }
        );
    }

    createFallbackCat() {
        console.log('⚠️ Creating fallback cat shape');

        const group = new THREE.Group();

        // Simple cat body
        const bodyGeometry = new THREE.BoxGeometry(2, 1.5, 1);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0xff9933,
            metalness: 0.3,
            roughness: 0.7
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        group.add(body);

        // Cat head
        const headGeometry = new THREE.SphereGeometry(0.7, 16, 16);
        const head = new THREE.Mesh(headGeometry, bodyMaterial);
        head.position.set(1.2, 0.5, 0);
        group.add(head);

        // Ears
        const earGeometry = new THREE.ConeGeometry(0.3, 0.5, 8);
        const leftEar = new THREE.Mesh(earGeometry, bodyMaterial);
        leftEar.position.set(1.2, 1, -0.3);
        group.add(leftEar);

        const rightEar = new THREE.Mesh(earGeometry, bodyMaterial);
        rightEar.position.set(1.2, 1, 0.3);
        group.add(rightEar);

        group.scale.set(60, 60, 60); // Larger fallback cat
        group.rotation.y = Math.PI / 2; // Face right
        group.position.set(-400, 0, 0);

        this.catModel = group;
        this.scene.add(group);

        console.log('✅ Fallback cat created with scale 60');
    }

    updateCatPosition() {
        if (!this.catModel) return;

        this.time += 0.016; // ~60fps

        const container = document.getElementById('flying-cat-container');
        if (!container) return;

        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        // Move cat horizontally (back and forth)
        this.xPosition += this.speed * this.flyDirection;

        // Get chart path to follow height
        let yPosition = 0; // Default middle
        if (window.candleChart) {
            const path = window.candleChart.getCurrentPath();

            if (path.length > 0) {
                // Find the closest path point to current X position
                const normalizedX = (this.xPosition + containerWidth / 2) / containerWidth;
                const pathIndex = Math.floor(normalizedX * path.length);
                const clampedIndex = Math.max(0, Math.min(pathIndex, path.length - 1));

                if (path[clampedIndex]) {
                    // Convert chart Y to scene Y (flip and center)
                    yPosition = path[clampedIndex].y - containerHeight / 2;
                }
            }
        }

        // Set position
        this.catModel.position.x = this.xPosition;
        this.catModel.position.y = -yPosition; // Flip Y

        // Reverse direction at edges
        const margin = 50;
        if (this.xPosition > containerWidth / 2 - margin) {
            this.flyDirection = -1; // Fly left
            this.catModel.rotation.y = -Math.PI / 2; // Face left
        } else if (this.xPosition < -containerWidth / 2 + margin) {
            this.flyDirection = 1; // Fly right
            this.catModel.rotation.y = Math.PI / 2; // Face right
        }

        // Add gentle bobbing motion
        const bobOffset = Math.sin(this.time * 3) * 8;
        this.catModel.position.y += bobOffset;

        // Add slight tilt based on direction
        const tiltAmount = this.flyDirection * 0.1;
        this.catModel.rotation.z = tiltAmount;

        // Gentle wing flapping (rotation on X axis)
        this.catModel.rotation.x = Math.sin(this.time * 5) * 0.05;

        // Debug log every 2 seconds
        if (Math.floor(this.time) % 2 === 0 && this.time % 1 < 0.02) {
            console.log(`🐱 Cat position: (${this.xPosition.toFixed(0)}, ${this.catModel.position.y.toFixed(0)}), Direction: ${this.flyDirection > 0 ? 'RIGHT' : 'LEFT'}`);
        }
    }

    onResize() {
        const container = document.getElementById('flying-cat-container');
        if (!container) return;

        const width = container.clientWidth;
        const height = container.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);

        console.log(`📐 Flying cat resized: ${width}x${height}`);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        this.updateCatPosition();
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize when page loads
let flyingCat;
window.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure candle chart is initialized first
    setTimeout(() => {
        flyingCat = new FlyingCat();
    }, 100);
});
