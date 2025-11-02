// DeepSeek API Configuration
const DEEPSEEK_CONFIG = {
    API_KEY: 'sk-9b5b5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e', // Твой реальный DeepSeek API ключ
    BASE_URL: 'https://api.deepseek.com/v1',
    MODEL: 'deepseek-chat',
    MAX_TOKENS: 2000,
    TEMPERATURE: 0.7
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DEEPSEEK_CONFIG;
} else {
    window.DEEPSEEK_CONFIG = DEEPSEEK_CONFIG;
}
