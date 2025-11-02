class ValidationService {
    static validateEmail(email, errorElementId = null) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(email);
        
        if (errorElementId) {
            const errorElement = document.getElementById(errorElementId);
            if (!isValid && email) {
                errorElement.textContent = 'Please enter a valid email address';
                errorElement.classList.remove('hidden');
            } else {
                errorElement.classList.add('hidden');
            }
        }
        
        return isValid;
    }

    static validatePhone(phone, errorElementId = null) {
        // International phone format validation
        const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
        const isValid = phoneRegex.test(phone.replace(/\s/g, ''));
        
        if (errorElementId) {
            const errorElement = document.getElementById(errorElementId);
            if (!isValid && phone) {
                errorElement.textContent = 'Please enter a valid phone number';
                errorElement.classList.remove('hidden');
            } else {
                errorElement.classList.add('hidden');
            }
        }
        
        return isValid;
    }

    static validatePassword(password, errorElementId = null) {
        const requirements = {
            minLength: password.length >= 8,
            hasUpperCase: /[A-Z]/.test(password),
            hasLowerCase: /[a-z]/.test(password),
            hasNumber: /\d/.test(password),
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        const isValid = Object.values(requirements).every(Boolean);
        
        if (errorElementId) {
            const errorElement = document.getElementById(errorElementId);
            if (!isValid && password) {
                const missing = [];
                if (!requirements.minLength) missing.push('8 characters');
                if (!requirements.hasUpperCase) missing.push('uppercase letter');
                if (!requirements.hasLowerCase) missing.push('lowercase letter');
                if (!requirements.hasNumber) missing.push('number');
                if (!requirements.hasSpecialChar) missing.push('special character');
                
                errorElement.textContent = `Missing: ${missing.join(', ')}`;
                errorElement.classList.remove('hidden');
            } else {
                errorElement.classList.add('hidden');
            }
        }
        
        return isValid;
    }

    static validateConfirmPassword(password, confirmPassword, errorElementId = null) {
        const isValid = password === confirmPassword;
        
        if (errorElementId) {
            const errorElement = document.getElementById(errorElementId);
            if (!isValid && confirmPassword) {
                errorElement.textContent = 'Passwords do not match';
                errorElement.classList.remove('hidden');
            } else {
                errorElement.classList.add('hidden');
            }
        }
        
        return isValid;
    }

    static getPasswordStrength(password) {
        let score = 0;
        
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
        
        const strengthLevels = [
            { class: 'weak', text: 'Weak', percentage: 33 },
            { class: 'medium', text: 'Medium', percentage: 66 },
            { class: 'strong', text: 'Strong', percentage: 100 }
        ];
        
        return strengthLevels[Math.min(score, strengthLevels.length - 1)];
    }
}
