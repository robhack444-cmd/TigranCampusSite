class VRTour {
    constructor() {
        this.isVRMode = false;
        this.init();
    }
    
    init() {
        this.setupVRScene();
        this.setupControls();
    }
    
    setupVRScene() {
        // VR scene setup with Three.js
        this.vrRenderer = new THREE.WebGLRenderer({ antialias: true });
        this.vrRenderer.setSize(window.innerWidth, window.innerHeight);
        this.vrRenderer.xr.enabled = true;
        
        document.getElementById('vr-viewport').appendChild(this.vrRenderer.domElement);
    }
    
    setupControls() {
        const vrButtons = document.querySelectorAll('.vr-btn');
        vrButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.querySelector('i').className;
                this.handleVRAction(action);
            });
        });
    }
    
    handleVRAction(action) {
        switch(action) {
            case 'fas fa-walking':
                this.startTour();
                break;
            case 'fas fa-expand':
                this.toggleFullscreen();
                break;
            case 'fas fa-vr-cardboard':
                this.enterVRMode();
                break;
        }
    }
    
    startTour() {
        // Start automated campus tour
        console.log('Starting VR campus tour...');
    }
    
    enterVRMode() {
        if(!this.isVRMode) {
            // Enter VR mode
            document.getElementById('vr-viewport').requestFullscreen();
            this.isVRMode = true;
        }
    }
    
    toggleFullscreen() {
        if(!document.fullscreenElement) {
            document.getElementById('vr-viewport').requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
}
