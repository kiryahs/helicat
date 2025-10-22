// HeliCat 3D Helicopter Blade System
// Smooth, fun, and definitely not cringy

class HelicopterBlades {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.blades = [];
        this.bladeMesh = null;
        this.rotationSpeed = 0; // Start static
        this.targetSpeed = 0;
        this.time = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.isHovering = false;
        this.frameCount = 0;

        // DEBUG FLAG - Set to true to disable ALL motion blur effects
        this.DISABLE_MOTION_EFFECTS = true; // TESTING: Disable blur effects to isolate issues

        // Particle system for flying particles from blade tips
        this.flyingParticles = [];
        this.maxFlyingParticles = 100;
        this.particleEmissionRate = 0;

        this.init();
    }

    init() {
        // Get canvas element
        const canvas = document.getElementById('helicopter-canvas');
        console.log('🚁 HeliCat Init - Canvas element:', canvas);
        if (!canvas) {
            console.error('❌ Canvas element not found!');
            return;
        }

        // Check if Three.js is loaded
        if (typeof THREE === 'undefined') {
            console.error('❌ THREE.js is not loaded!');
            return;
        }
        console.log('✅ THREE.js loaded:', THREE.REVISION);

        // Scene setup
        this.scene = new THREE.Scene();
        // Add very subtle fog for depth perception
        this.scene.fog = new THREE.Fog(0x000000, 8, 15);
        console.log('✅ Scene created with fog for depth');

        // Camera setup - SUBTLE perspective like reference image
        const aspect = 1; // Square aspect ratio
        this.camera = new THREE.PerspectiveCamera(55, aspect, 0.1, 1000);
        // Slight overhead angle - blades should be VISIBLE
        this.camera.position.set(0.3, 1.8, 6);
        this.camera.lookAt(0, 0, 0);

        // Renderer setup - PREMIUM QUALITY
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
            preserveDrawingBuffer: false // Prevent ghosting/trails
        });

        // Ensure proper clearing each frame
        this.renderer.autoClear = true;

        // Get size from container
        const container = document.getElementById('helicopter-canvas-container');
        const size = container ? Math.min(container.offsetWidth, container.offsetHeight) : 300;
        console.log('📐 Container size:', container ? `${container.offsetWidth}x${container.offsetHeight}` : 'Container not found');
        console.log('📐 Renderer size:', size);
        this.renderer.setSize(size, size);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap at 2x for performance
        this.renderer.setClearColor(0x000000, 0);

        // Enable shadows
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Better tone mapping for realistic lighting
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;

        console.log('✅ Premium renderer configured');

        // EPIC LIGHTING SETUP
        // Ambient base light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // Main key light (from top-right) - with strong shadows
        const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
        keyLight.position.set(6, 10, 5);
        keyLight.castShadow = true;
        // Shadow settings for depth
        keyLight.shadow.mapSize.width = 2048;
        keyLight.shadow.mapSize.height = 2048;
        keyLight.shadow.camera.near = 0.5;
        keyLight.shadow.camera.far = 50;
        keyLight.shadow.camera.left = -10;
        keyLight.shadow.camera.right = 10;
        keyLight.shadow.camera.top = 10;
        keyLight.shadow.camera.bottom = -10;
        this.scene.add(keyLight);

        // Fill light (from left)
        const fillLight = new THREE.DirectionalLight(0xff9955, 0.6);
        fillLight.position.set(-5, 3, 3);
        this.scene.add(fillLight);

        // Rim light (from behind)
        const rimLight = new THREE.DirectionalLight(0x88ccff, 0.8);
        rimLight.position.set(0, -3, -6);
        this.scene.add(rimLight);

        // Hemisphere light for natural gradient
        const hemiLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.4);
        this.scene.add(hemiLight);

        // Point light at center for glow effect
        const centerGlow = new THREE.PointLight(0xffaa00, 1.5, 5);
        centerGlow.position.set(0, 0, 0.5);
        this.scene.add(centerGlow);
        this.centerGlow = centerGlow;

        // Create helicopter blade system
        console.log('🔧 Creating helicopter blades...');
        this.createHelicopterBlades();
        console.log('✅ Blades created. Scene children count:', this.scene.children.length);

        // Debug: Test box removed - blades are working!
        // const testGeometry = new THREE.BoxGeometry(1, 1, 1);
        // const testMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        // const testBox = new THREE.Mesh(testGeometry, testMaterial);
        // this.scene.add(testBox);
        console.log('✅ Helicopter system ready!');

        // Event listeners
        window.addEventListener('resize', () => this.onWindowResize());

        // Hover detection on the CAT image instead of canvas container
        const heroCat = document.getElementById('hero-cat');
        if (heroCat) {
            console.log('✅ Setting up hover detection on hero cat');

            heroCat.addEventListener('mouseenter', () => this.onHoverStart());
            heroCat.addEventListener('mouseleave', () => this.onHoverEnd());
            heroCat.addEventListener('mousemove', (e) => this.onMouseMove(e));

            // Set cursor to pointer on cat
            heroCat.style.cursor = 'pointer';

            console.log('✅ Cat hover triggers helicopter blade spinning');
        } else {
            console.error('❌ Hero cat not found for hover detection!');
        }

        // Ensure canvas doesn't block pointer events
        if (canvas) {
            canvas.style.pointerEvents = 'none';
            console.log('✅ Canvas pointer events set to none');
        }

        // Start animation
        console.log('🎬 Starting animation loop...');
        this.animate();
        console.log('✅ HeliCat initialization complete!');
    }

    createHelicopterBlades() {
        console.log('🔧 Loading 3D helicopter blade model...');

        // Clean up any existing blade mesh from scene
        if (this.bladeMesh) {
            console.log('🧹 Cleaning up old blade mesh...');
            this.scene.remove(this.bladeMesh);
            // Dispose of geometries and materials
            this.bladeMesh.traverse((child) => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(mat => mat.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            });
        }

        // Create fresh blade group that will contain everything
        this.bladeMesh = new THREE.Group();

        // Check if GLTFLoader is available
        if (typeof THREE.GLTFLoader === 'undefined') {
            console.error('❌ GLTFLoader is not loaded! Falling back to procedural blades');
            this.createProceduralBlades();
            return;
        }

        // Load the 3D model
        const loader = new THREE.GLTFLoader();
        loader.load(
            // Path to the model
            'blades/blades.glb',

            // Success callback
            (gltf) => {
                console.log('✅ 3D model loaded successfully!');

                // Get the loaded model
                const bladeModel = gltf.scene;

                console.log('📦 GLB Scene Structure:', {
                    children: bladeModel.children.length,
                    type: bladeModel.type
                });

                // Count and log all meshes
                let meshCount = 0;
                let totalVertices = 0;

                // Apply materials with orange-yellow gradient since model is colorless
                bladeModel.traverse((child) => {
                    if (child.isMesh) {
                        meshCount++;
                        const vertCount = child.geometry.attributes.position.count;
                        totalVertices += vertCount;
                        console.log(`🎨 Mesh #${meshCount}: "${child.name}" - ${vertCount} vertices`, {
                            geometry: child.geometry.type,
                            hasMaterial: !!child.material
                        });

                        // Determine if this is a blade or hub part based on position/size
                        const bounds = new THREE.Box3().setFromObject(child);
                        const size = bounds.getSize(new THREE.Vector3());
                        const center = bounds.getCenter(new THREE.Vector3());

                        // If it's a central/small part (likely hub), make it metallic gray
                        if (Math.abs(center.x) < 0.5 && Math.abs(center.y) < 0.5) {
                            // Hub material - metallic dark gray
                            child.material = new THREE.MeshStandardMaterial({
                                color: 0x2a2a2a,
                                metalness: 0.9,
                                roughness: 0.2,
                                emissive: 0xff6600,
                                emissiveIntensity: 0.15
                            });
                        } else {
                            // Blade material - orange to yellow gradient
                            const distanceFromCenter = Math.sqrt(center.x * center.x + center.y * center.y);
                            const gradientFactor = Math.min(distanceFromCenter / 3, 1);

                            child.material = new THREE.MeshStandardMaterial({
                                color: new THREE.Color().setHSL(0.08 - gradientFactor * 0.03, 0.95, 0.5 + gradientFactor * 0.2),
                                metalness: 0.7,
                                roughness: 0.25,
                                emissive: new THREE.Color().setHSL(0.08, 1.0, 0.3),
                                emissiveIntensity: 0.4 + gradientFactor * 0.3,
                                transparent: false, // No transparency
                                opacity: 1.0 // Fully opaque
                            });
                        }

                        // Enable shadows
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                console.log(`📊 Total: ${meshCount} meshes, ${totalVertices} vertices`);

                // Adjust scale and position as needed
                bladeModel.scale.set(0.8, 0.8, 0.8); // Adjust scale to fit

                // SIDE VIEW ORIENTATION
                // The GLB model is in top-down view by default
                // For side view, we need to keep it flat (no X rotation like before)
                // The model will rotate around Y axis (vertical) in the animation loop

                // Set initial orientation - blades visible from the side
                bladeModel.rotation.x = 0;  // No pitch (was Math.PI/2 for top-down)
                bladeModel.rotation.y = 0;  // No yaw (initial angle)
                bladeModel.rotation.z = 0;  // No roll

                console.log('🔄 Model orientation: SIDE VIEW (blades spin on Y axis like real helicopter)');

                // Add the loaded model to our blade group
                this.bladeMesh.add(bladeModel);

                // Store reference for rotation - CRITICAL for spin animation
                this.bladeModel = bladeModel;

                console.log('✅ Model added to blade group');
                console.log('🔧 Blade mesh now has', this.bladeMesh.children.length, 'children');
                console.log('🎯 bladeModel reference stored for Y-axis rotation');

                // After model is loaded, add all the motion effects
                this.addMotionEffects();
                this.finalizeBladeSetup();
            },

            // Progress callback (optional)
            (xhr) => {
                console.log('📊 Loading progress:', (xhr.loaded / xhr.total * 100) + '%');
            },

            // Error callback
            (error) => {
                console.error('❌ Error loading 3D model:', error);
                console.log('⚠️ Falling back to procedural blades');
                this.createProceduralBlades();
            }
        );
    }

    addMotionEffects() {
        // Skip all motion effects if disabled for debugging
        if (this.DISABLE_MOTION_EFFECTS) {
            console.log('⚠️ Motion effects DISABLED for debugging');
            return;
        }

        // Create CIRCULAR motion blur disc like reference image!
        const discGeometry = new THREE.RingGeometry(0.3, 3.5, 64);
        const discMaterial = new THREE.MeshBasicMaterial({
            color: 0xffbb55,
            transparent: true,
            opacity: 0,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false // Prevent depth buffer issues with transparency
        });
        this.blurDisc = new THREE.Mesh(discGeometry, discMaterial);
        this.blurDisc.rotation.x = Math.PI / 2;
        this.bladeMesh.add(this.blurDisc);

        // Add inner glow disc
        const innerDiscGeometry = new THREE.CircleGeometry(0.5, 32);
        const innerDiscMaterial = new THREE.MeshBasicMaterial({
            color: 0xffee88,
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        this.innerDisc = new THREE.Mesh(innerDiscGeometry, innerDiscMaterial);
        this.innerDisc.rotation.x = Math.PI / 2;
        this.innerDisc.position.z = 0.01;
        this.bladeMesh.add(this.innerDisc);

        // Add subtle trail lines
        const blurTrails = [];
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const blurGeometry = new THREE.PlaneGeometry(3.2, 0.3);
            const blurMaterial = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(0.08, 0.9, 0.6),
                transparent: true,
                opacity: 0,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            const blur = new THREE.Mesh(blurGeometry, blurMaterial);
            blur.position.x = 1.6;
            blur.rotation.z = angle;
            this.bladeMesh.add(blur);
            blurTrails.push(blur);
        }
        this.blurTrails = blurTrails;

        // Add sparkle particles around the blades
        const particleCount = 20;
        const particlesGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const radius = 2.5 + Math.random() * 0.8;
            particlePositions[i * 3] = Math.cos(angle) * radius;
            particlePositions[i * 3 + 1] = Math.sin(angle) * radius;
            particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            color: 0xffdd00,
            size: 0.15,
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true,
            depthWrite: false
        });

        this.particles = new THREE.Points(particlesGeometry, particlesMaterial);
        this.bladeMesh.add(this.particles);

        console.log('✅ Motion effects added');
    }

    finalizeBladeSetup() {
        console.log('🏁 Finalizing blade setup...');

        // Scale UP for visibility (reference image shows large blades!)
        this.bladeMesh.scale.set(1.1, 1.1, 1.1);

        // SUBTLE tilt like reference - just enough for 3D, not too much!
        this.bladeMesh.rotation.x = -0.12; // Very slight tilt (~7 degrees)
        this.bladeMesh.rotation.y = 0.08;  // Minimal rotation (~5 degrees)

        // Add ground plane for shadow depth reference
        const groundGeometry = new THREE.CircleGeometry(4, 32);
        const groundMaterial = new THREE.ShadowMaterial({
            opacity: 0.3
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        this.scene.add(this.bladeMesh);

        console.log('✅ Blade mesh added to scene with shadow ground');
        console.log('🔧 Scene total children:', this.scene.children.length);
        console.log('🔧 bladeMesh scale:', this.bladeMesh.scale);
        console.log('🔧 bladeMesh rotation:', this.bladeMesh.rotation);
        console.log('🔧 bladeMesh position:', this.bladeMesh.position);
        console.log('🔧 bladeMesh children:', this.bladeMesh.children.length);

        // Log all children of bladeMesh
        console.log('📋 Blade mesh children breakdown:');
        this.bladeMesh.children.forEach((child, i) => {
            console.log(`  [${i}] ${child.type}: ${child.name || 'unnamed'}`, {
                children: child.children ? child.children.length : 0
            });
        });

        console.log('🔧 Camera position:', this.camera.position);
        console.log('🔧 Camera looking at:', this.camera.rotation);
    }

    // Fallback method that creates procedural blades if GLB fails to load
    createProceduralBlades() {
        console.log('🔧 Creating procedural blades as fallback');

        // Clear any existing blade mesh
        if (this.bladeMesh) {
            this.scene.remove(this.bladeMesh);
        }

        // Create blade group
        this.bladeMesh = new THREE.Group();

        // Create a group for the procedural blades (same as bladeModel for GLB)
        const proceduralModel = new THREE.Group();

        // Create simple procedural blades (simplified version)
        const hubGeometry = new THREE.CylinderGeometry(0.25, 0.3, 0.5, 32);
        const hubMaterial = new THREE.MeshStandardMaterial({
            color: 0x2a2a2a,
            metalness: 0.9,
            roughness: 0.2,
            emissive: 0xff6600,
            emissiveIntensity: 0.1
        });
        const hub = new THREE.Mesh(hubGeometry, hubMaterial);
        hub.rotation.x = Math.PI / 2;
        hub.castShadow = true;
        proceduralModel.add(hub);

        // Create two simple blades
        for (let i = 0; i < 2; i++) {
            const angle = (i / 2) * Math.PI * 2;
            const bladeGeometry = new THREE.BoxGeometry(3, 0.4, 0.1);
            const bladeMaterial = new THREE.MeshStandardMaterial({
                color: new THREE.Color().setHSL(0.08, 0.95, 0.6),
                metalness: 0.7,
                roughness: 0.25,
                emissive: new THREE.Color().setHSL(0.08, 1.0, 0.3),
                emissiveIntensity: 0.5
            });
            const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
            blade.rotation.z = angle;
            blade.castShadow = true;
            proceduralModel.add(blade);
        }

        // Add procedural model to blade mesh
        this.bladeMesh.add(proceduralModel);

        // Store reference for rotation - CRITICAL for spin animation
        this.bladeModel = proceduralModel;
        console.log('🎯 Procedural bladeModel reference stored for Y-axis rotation');

        // Add motion effects
        this.addMotionEffects();

        // Finalize setup
        this.finalizeBladeSetup();
    }

    onHoverStart() {
        console.log('🎯 HOVER START - Setting targetSpeed to 0.5');
        this.isHovering = true;
        this.targetSpeed = 0.5; // Faster helicopter spin speed
    }

    onHoverEnd() {
        console.log('🎯 HOVER END - Setting targetSpeed to 0');
        this.isHovering = false;
        this.targetSpeed = 0;
        // Reset wobble when not hovering
        this.mouseX = 0;
        this.mouseY = 0;
    }

    onMouseMove(event) {
        if (this.isHovering) {
            const heroCat = document.getElementById('hero-cat');
            if (heroCat) {
                const rect = heroCat.getBoundingClientRect();
                // Normalize mouse position relative to cat
                this.mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                this.mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            }
        }
    }

    onWindowResize() {
        const helicContainer = document.getElementById('helicopter-canvas-container');
        if (helicContainer) {
            const size = Math.min(helicContainer.offsetWidth, helicContainer.offsetHeight);
            this.renderer.setSize(size, size);
        }

        this.camera.aspect = 1; // Always square
        this.camera.updateProjectionMatrix();
    }

    createFlyingParticle(angle) {
        // Create particle mesh
        const particleGeometry = new THREE.SphereGeometry(0.08, 8, 8);
        const particleMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color().setHSL(0.08 + Math.random() * 0.05, 0.95, 0.6),
            transparent: true,
            opacity: 1.0,
            blending: THREE.AdditiveBlending
        });

        const particle = new THREE.Mesh(particleGeometry, particleMaterial);

        // Start at blade tip radius
        const startRadius = 2.5;
        particle.position.x = Math.cos(angle) * startRadius;
        particle.position.y = Math.sin(angle) * startRadius;
        particle.position.z = (Math.random() - 0.5) * 0.3;

        // Store particle data
        particle.userData = {
            angle: angle,
            speed: 0.08 + Math.random() * 0.04,
            radius: startRadius,
            life: 1.0,
            decay: 0.015 + Math.random() * 0.01
        };

        this.scene.add(particle);
        this.flyingParticles.push(particle);

        return particle;
    }

    updateFlyingParticles() {
        // Update existing particles
        for (let i = this.flyingParticles.length - 1; i >= 0; i--) {
            const particle = this.flyingParticles[i];
            const data = particle.userData;

            // Move particle outward
            data.radius += data.speed;
            particle.position.x = Math.cos(data.angle) * data.radius;
            particle.position.y = Math.sin(data.angle) * data.radius;

            // Fade out
            data.life -= data.decay;
            particle.material.opacity = Math.max(0, data.life);

            // Scale down as it fades
            const scale = 0.5 + data.life * 0.5;
            particle.scale.set(scale, scale, scale);

            // Remove dead particles
            if (data.life <= 0 || data.radius > 8) {
                this.scene.remove(particle);
                particle.geometry.dispose();
                particle.material.dispose();
                this.flyingParticles.splice(i, 1);
            }
        }

        // Emit new particles based on rotation speed
        const speedIntensity = Math.abs(this.rotationSpeed);
        if (speedIntensity > 0.05) {
            // Emission rate based on speed
            this.particleEmissionRate = speedIntensity * 3;

            // Emit particles
            const particlesToEmit = Math.floor(this.particleEmissionRate);
            for (let i = 0; i < particlesToEmit; i++) {
                if (this.flyingParticles.length < this.maxFlyingParticles) {
                    // Emit from random positions around the blade circle
                    const angle = Math.random() * Math.PI * 2;
                    this.createFlyingParticle(angle);
                }
            }
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        this.time += 0.016; // ~60fps
        this.frameCount++;

        // Log every 60 frames (about once per second) for debugging
        if (this.frameCount % 60 === 0) {
            console.log(`🎬 Frame ${this.frameCount} - Speed: ${this.rotationSpeed.toFixed(4)} | Target: ${this.targetSpeed} | Hovering: ${this.isHovering}`);
        }

        if (this.bladeMesh) {
            // Smoothly transition rotation speed with faster easing for more responsiveness
            const speedDiff = this.targetSpeed - this.rotationSpeed;
            this.rotationSpeed += speedDiff * 0.2; // Faster easing (was 0.1)

            // Log speed changes during hover for debugging
            if (this.isHovering && this.frameCount % 5 === 0) {
                console.log(`⚡ Hover active - Speed: ${this.rotationSpeed.toFixed(4)} -> Target: ${this.targetSpeed}`);
            }

            // Base rotation angles for SUBTLE perspective (like reference!)
            const baseRotX = -0.12;
            const baseRotY = 0.08;

            // Only rotate if speed is significant
            // Rotate around Y-axis (vertical) like a real helicopter
            // Apply spin to the MODEL itself, not the bladeMesh (which handles wobble)
            if (Math.abs(this.rotationSpeed) > 0.001 && this.bladeModel) {
                this.bladeModel.rotation.y += this.rotationSpeed;

                // Debug: Log actual rotation every 30 frames
                if (this.frameCount % 30 === 0) {
                    console.log(`🔄 Model Y rotation: ${this.bladeModel.rotation.y.toFixed(4)} (speed: ${this.rotationSpeed.toFixed(4)})`);
                }
            }

            // Show CIRCULAR DISC when spinning (like reference image!)
            const speedIntensity = Math.abs(this.rotationSpeed) * 2.5;

            if (this.blurDisc) {
                // Main spinning disc - becomes visible when fast
                this.blurDisc.material.opacity = Math.min(speedIntensity * 0.35, 0.5);
            }

            if (this.innerDisc) {
                // Inner glow disc
                this.innerDisc.material.opacity = Math.min(speedIntensity * 0.25, 0.35);
            }

            // Subtle trail lines
            if (this.blurTrails) {
                this.blurTrails.forEach((trail, i) => {
                    const baseOpacity = 0.08;
                    trail.material.opacity = baseOpacity * speedIntensity;
                });
            }

            // Pulse center glow based on rotation
            if (this.centerGlow) {
                const glowIntensity = 1.5 + Math.abs(this.rotationSpeed) * 3;
                this.centerGlow.intensity = glowIntensity;
            }

            // Animate particles when spinning
            if (this.particles) {
                const speedIntensity = Math.abs(this.rotationSpeed) * 1.5;
                this.particles.material.opacity = speedIntensity * 0.8;
                // Particles counter-rotate around Y-axis (vertical) to follow blade motion
                this.particles.rotation.y -= this.rotationSpeed * 0.5;
            }

            // Subtle wobble based on mouse position (only when hovering)
            if (this.isHovering) {
                const targetX = baseRotX + this.mouseY * 0.12;
                const targetY = baseRotY + this.mouseX * 0.12;
                this.bladeMesh.rotation.x += (targetX - this.bladeMesh.rotation.x) * 0.1;
                this.bladeMesh.rotation.y += (targetY - this.bladeMesh.rotation.y) * 0.1;
            } else {
                // Smoothly return to base perspective position
                this.bladeMesh.rotation.x += (baseRotX - this.bladeMesh.rotation.x) * 0.1;
                this.bladeMesh.rotation.y += (baseRotY - this.bladeMesh.rotation.y) * 0.1;
            }

            // Add gentle floating motion (reduced amplitude)
            const floatY = Math.sin(this.time * 1.2) * 0.04;
            this.bladeMesh.position.y = floatY;
        }

        // Update flying particles
        this.updateFlyingParticles();

        // Explicitly clear before rendering to prevent ghosting
        this.renderer.clear();
        this.renderer.render(this.scene, this.camera);
    }

    // Method to change speed (can be called from outside)
    setSpeed(speed) {
        this.rotationSpeed = speed;
    }

    // Add some chaos on demand
    goWild() {
        this.rotationSpeed = 0.8;
        setTimeout(() => {
            this.rotationSpeed = 0.3;
        }, 3000);
    }
}

// Initialize when DOM is ready
let helicopterBlades;
window.addEventListener('DOMContentLoaded', () => {
    helicopterBlades = new HelicopterBlades();
});
