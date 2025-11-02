class DigitalCampus {
    constructor() {
        this.modules = {
            'smart-schedule': new SmartSchedule(),
            'student-wallet': new StudentWallet(),
            'ar-learning': new ARLearning()
        };
        this.init();
    }
    
    init() {
        this.loadStudentProfile();
        this.setupDigitalServices();
    }
    
    async loadStudentProfile() {
        // Load student data from blockchain
        const studentData = await this.getStudentData();
        this.renderDigitalID(studentData);
    }
    
    renderDigitalID(data) {
        const digitalIDHTML = `
            <div class="digital-id neuro-card rounded-2xl p-6 text-center">
                <div class="nft-avatar w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <i class="fas fa-user-graduate text-white text-2xl"></i>
                </div>
                <h4 class="font-bold text-lg">${data.name || 'Студент NeoCollege'}</h4>
                <p class="text-cyan-400 text-sm">Digital ID: ${this.generateDID()}</p>
                <div class="crypto-balance mt-4">
                    <div class="text-xs text-gray-400">EDU Tokens</div>
                    <div class="text-lg font-bold">${data.tokens || '0'} EDU</div>
                </div>
            </div>
        `;
        
        // Add to dashboard
        const dashboard = document.getElementById('student-dashboard');
        if(dashboard) {
            dashboard.insertAdjacentHTML('beforeend', digitalIDHTML);
        }
    }
    
    generateDID() {
        return 'DID:' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
    
    async getStudentData() {
        // Simulate blockchain call
        return {
            name: "Иван Петров",
            tokens: "1500",
            courses: ["AI Development", "Blockchain Basics"],
            progress: "87%"
        };
    }
}

class SmartSchedule {
    constructor() {
        this.schedule = this.generateSmartSchedule();
    }
    
    generateSmartSchedule() {
        return [
            { time: '09:00', subject: 'AI Programming', type: 'VR Lab', room: 'Metaverse-1' },
            { time: '11:00', subject: 'Blockchain Dev', type: 'Practical', room: 'Crypto-Lab' },
            { time: '14:00', subject: '3D Design', type: 'AR Session', room: 'Creative-Space' }
        ];
    }
}

class StudentWallet {
    constructor() {
        this.balance = 0;
        this.transactions = [];
    }
    
    addEDUTokens(amount) {
        this.balance += amount;
        this.recordTransaction(amount, 'EDU Tokens Received');
    }
    
    recordTransaction(amount, description) {
        this.transactions.push({
            amount,
            description,
            timestamp: new Date().toISOString(),
            hash: this.generateTxHash()
        });
    }
    
    generateTxHash() {
        return '0x' + Math.random().toString(16).substr(2, 64);
    }
}

class ARLearning {
    constructor() {
        this.arModules = [];
    }
    
    async startARModule(moduleName) {
        console.log(`Starting AR module: ${moduleName}`);
        // AR integration would go here
    }
}
