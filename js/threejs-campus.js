class ThreeJSCampus {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true 
        });
        
        this.init();
    }
    
    init() {
        this.setupRenderer();
        this.createCampus();
        this.addLighting();
        this.animate();
        this.handleResize();
    }
    
    setupRenderer() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.shadowMap.enabled = true;
        document.getElementById('3d-campus').appendChild(this.renderer.domElement);
        
        this.camera.position.set(0, 5, 15);
    }
    
    createCampus() {
        // Create futuristic campus buildings
        this.createBuilding(0, 0, 0, 0x00a8ff);
        this.createBuilding(8, 0, -5, 0x9c88ff);
        this.createBuilding(-8, 0, -5, 0xfbc531);
        
        // Add floating elements
        this.createFloatingOrbs();
        
        // Add particle system
        this.createParticles();
    }
    
    createBuilding(x, y, z, color) {
        const geometry = new THREE.BoxGeometry(4, 8, 4);
        const material = new THREE.MeshPhysicalMaterial({
            color: color,
            metalness: 0.8,
            roughness: 0.1,
            transparent: true,
            opacity: 0.9
        });
        
        const building = new THREE.Mesh(geometry, material);
        building.position.set(x, y, z);
        building.castShadow = true;
        this.scene.add(building);
        
        // Add glowing edges
        const edges = new THREE.EdgesGeometry(geometry);
        const line = new THREE.LineSegments(edges, 
            new THREE.LineBasicMaterial({ color: 0x00ffff })
        );
        building.add(line);
        
        return building;
    }
    
    createFloatingOrbs() {
        const orbGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const orbMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0.7
        });
        
        for(let i = 0; i < 10; i++) {
            const orb = new THREE.Mesh(orbGeometry, orbMaterial);
            orb.position.set(
                (Math.random() - 0.5) * 20,
                Math.random() * 10 + 2,
                (Math.random() - 0.5) * 20
            );
            this.scene.add(orb);
        }
    }
    
    createParticles() {
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 2000;
        
        const posArray = new Float32Array(particlesCount * 3);
        
        for(let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 50;
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.1,
            color: 0x00a8ff,
            transparent: true,
            opacity: 0.8
        });
        
        this.particlesSystem = new THREE.Points(particlesGeometry, particlesMaterial);
        this.scene.add(this.particlesSystem);
    }
    
    addLighting() {
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0x00ffff, 1);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
        
        const pointLight = new THREE.PointLight(0xff00ff, 0.5, 100);
        pointLight.position.set(0, 5, 0);
        this.scene.add(pointLight);
    }
    
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        if(this.particlesSystem) {
            this.particlesSystem.rotation.x += 0.0001;
            this.particlesSystem.rotation.y += 0.0002;
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    handleResize() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
}
