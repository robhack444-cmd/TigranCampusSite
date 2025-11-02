class AuthService {
    constructor() {
        this.isInitialized = false;
        this.currentUser = null;
    }

    init() {
        if (this.isInitialized) return;
        
        this.setupEventListeners();
        this.checkAuthState();
        this.isInitialized = true;
        
        console.log('AuthService initialized');
    }

    setupEventListeners() {
        // Login form
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Register form
        document.getElementById('register-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        // Real-time validation
        this.setupRealTimeValidation();
    }

    setupRealTimeValidation() {
        // Email validation
        document.getElementById('register-email').addEventListener('input', (e) => {
            ValidationService.validateEmail(e.target.value, 'register-email-error');
        });

        // Phone validation
        document.getElementById('register-phone').addEventListener('input', (e) => {
            ValidationService.validatePhone(e.target.value, 'register-phone-error');
        });

        // Password strength
        document.getElementById('register-password').addEventListener('input', (e) => {
            this.updatePasswordStrength(e.target.value);
            ValidationService.validatePassword(e.target.value, 'register-password-error');
        });

        // Confirm password
        document.getElementById('register-confirm-password').addEventListener('input', (e) => {
            const password = document.getElementById('register-password').value;
            ValidationService.validateConfirmPassword(password, e.target.value, 'register-confirm-password-error');
        });
    }

    updatePasswordStrength(password) {
        const strength = ValidationService.getPasswordStrength(password);
        const fill = document.getElementById('password-strength-fill');
        const text = document.getElementById('password-strength-text');
        
        fill.className = 'strength-fill ' + strength.class;
        fill.style.width = strength.percentage + '%';
        text.textContent = strength.text;
        text.className = 'strength-text ' + strength.class;
    }

    async handleLogin() {
        const formData = this.getLoginFormData();
        
        if (!this.validateLoginForm(formData)) {
            return;
        }

        this.setLoadingState('login-form', true);

        try {
            const user = await this.authenticateUser(formData);
            this.currentUser = user;
            this.onAuthSuccess(user);
        } catch (error) {
            this.showError('login-form', error.message);
        } finally {
            this.setLoadingState('login-form', false);
        }
    }

    async handleRegister() {
        const formData = this.getRegisterFormData();
        
        if (!this.validateRegisterForm(formData)) {
            return;
        }

        this.setLoadingState('register-form', true);

        try {
            const user = await this.registerUser(formData);
            this.currentUser = user;
            this.onAuthSuccess(user);
        } catch (error) {
            this.showError('register-form', error.message);
        } finally {
            this.setLoadingState('register-form', false);
        }
    }

    getLoginFormData() {
        return {
            email: document.getElementById('login-email').value.trim(),
            password: document.getElementById('login-password').value
        };
    }

    getRegisterFormData() {
        return {
            email: document.getElementById('register-email').value.trim(),
            phone: document.getElementById('register-phone').value.trim(),
            password: document.getElementById('register-password').value,
            confirmPassword: document.getElementById('register-confirm-password').value,
            acceptTerms: document.getElementById('accept-terms').checked
        };
    }

    validateLoginForm(data) {
        let isValid = true;

        // Validate email
        if (!ValidationService.validateEmail(data.email, 'login-email-error')) {
            isValid = false;
        }

        // Validate password
        if (!data.password) {
            this.showFieldError('login-password-error', 'Password is required');
            isValid = false;
        }

        return isValid;
    }

    validateRegisterForm(data) {
        let isValid = true;

        // Validate email
        if (!ValidationService.validateEmail(data.email, 'register-email-error')) {
            isValid = false;
        }

        // Validate phone
        if (!ValidationService.validatePhone(data.phone, 'register-phone-error')) {
            isValid = false;
        }

        // Validate password
        if (!ValidationService.validatePassword(data.password, 'register-password-error')) {
            isValid = false;
        }

        // Validate confirm password
        if (!ValidationService.validateConfirmPassword(data.password, data.confirmPassword, 'register-confirm-password-error')) {
            isValid = false;
        }

        // Validate terms
        if (!data.acceptTerms) {
            this.showFieldError('register-terms-error', 'You must accept the terms and conditions');
            isValid = false;
        }

        return isValid;
    }

    async authenticateUser(credentials) {
        // Simulate API call - replace with real backend
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const users = JSON.parse(localStorage.getItem('neo_college_users') || '[]');
                const user = users.find(u => 
                    u.email === credentials.email && 
                    u.password === credentials.password
                );

                if (user) {
                    resolve(user);
                } else {
                    reject(new Error('Invalid email or password'));
                }
            }, 1500);
        });
    }

    async registerUser(userData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    const users = JSON.parse(localStorage.getItem('neo_college_users') || '[]');
                    
                    // Check if user already exists
                    if (users.find(u => u.email === userData.email)) {
                        reject(new Error('User with this email already exists'));
                        return;
                    }

                    const newUser = {
                        id: this.generateId(),
                        email: userData.email,
                        phone: userData.phone,
                        password: userData.password, // In real app, hash this!
                        createdAt: new Date().toISOString(),
                        isVerified: false
                    };

                    users.push(newUser);
                    localStorage.setItem('neo_college_users', JSON.stringify(users));
                    
                    resolve(newUser);
                } catch (error) {
                    reject(new Error('Registration failed. Please try again.'));
                }
            }, 2000);
        });
    }

    onAuthSuccess(user) {
        this.hideModals();
        this.updateUIForAuthState(true);
        this.showNotification(`Welcome, ${user.email}!`, 'success');
        
        // Store session
        localStorage.setItem('neo_college_current_user', JSON.stringify(user));
    }

    updateUIForAuthState(isAuthenticated) {
        const authButtons = document.querySelector('.auth-buttons');
        if (isAuthenticated && this.currentUser) {
            authButtons.innerHTML = `
                <div class="user-menu">
                    <button class="user-avatar">
                        <i class="fas fa-user-circle"></i>
                        ${this.currentUser.email}
                    </button>
                    <div class="user-dropdown">
                        <a href="#" class="dropdown-item"><i class="fas fa-user"></i> Profile</a>
                        <a href="#" class="dropdown-item"><i class="fas fa-cog"></i> Settings</a>
                        <div class="dropdown-divider"></div>
                        <button onclick="AuthService.logout()" class="dropdown-item logout">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </button>
                    </div>
                </div>
            `;
        }
    }

    checkAuthState() {
        const userData = localStorage.getItem('neo_college_current_user');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.updateUIForAuthState(true);
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('neo_college_current_user');
        this.updateUIForAuthState(false);
        this.showNotification('Logged out successfully', 'info');
    }

    // Modal controls
    showLoginModal() {
        this.hideModals();
        document.getElementById('login-modal').classList.remove('hidden');
    }

    showRegisterModal() {
        this.hideModals();
        document.getElementById('register-modal').classList.remove('hidden');
    }

    hideModals() {
        document.querySelectorAll('.auth-modal').forEach(modal => {
            modal.classList.add('hidden');
        });
    }

    // Utility methods
    setLoadingState(formId, isLoading) {
        const form = document.getElementById(formId);
        const submitBtn = form.querySelector('.auth-submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');

        if (isLoading) {
            btnText.classList.add('hidden');
            btnLoader.classList.remove('hidden');
            submitBtn.disabled = true;
        } else {
            btnText.classList.remove('hidden');
            btnLoader.classList.add('hidden');
            submitBtn.disabled = false;
        }
    }

    showError(formId, message) {
        const form = document.getElementById(formId);
        const errorDiv = form.querySelector('.form-error') || this.createErrorDiv(form);
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
    }

    showFieldError(fieldErrorId, message) {
        const errorElement = document.getElementById(fieldErrorId);
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
    }

    createErrorDiv(form) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        form.insertBefore(errorDiv, form.firstChild);
        return errorDiv;
    }

    showNotification(message, type = 'info') {
        // Implement toast notification
        console.log(`[${type.toUpperCase()}] ${message}`);
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}

// Initialize global instance
const AuthService = new AuthService();
