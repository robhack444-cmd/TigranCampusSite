class TigranAIService {
    constructor() {
        this.apiKey = 'sk-9b5b5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e'; // Real DeepSeek API Key
        this.baseURL = 'https://api.deepseek.com/v1/chat/completions';
        this.conversationHistory = [];
        this.isLoading = false;
        this.isInitialized = false;
    }

    init() {
        if (this.isInitialized) return;
        
        this.setupEventListeners();
        this.loadConversationHistory();
        this.isInitialized = true;
        
        console.log('Tigran AI Service initialized');
    }

    setupEventListeners() {
        // Enter key support
        document.getElementById('ai-chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Input auto-resize
        document.getElementById('ai-chat-input').addEventListener('input', (e) => {
            this.autoResizeTextarea(e.target);
        });
    }

    async sendMessage() {
        const input = document.getElementById('ai-chat-input');
        const message = input.value.trim();
        
        if (!message || this.isLoading) return;

        // Add user message to chat
        this.addMessageToChat(message, 'user');
        input.value = '';
        this.autoResizeTextarea(input);

        // Show loading indicator
        this.showLoadingIndicator();

        try {
            const response = await this.getAIResponse(message);
            this.addMessageToChat(response, 'ai');
        } catch (error) {
            console.error('AI Error:', error);
            this.addMessageToChat(
                'I apologize, but I\'m experiencing technical difficulties. Please try again in a moment or contact our support team.',
                'ai',
                true
            );
        } finally {
            this.hideLoadingIndicator();
        }
    }

    async getAIResponse(userMessage) {
        this.isLoading = true;

        // Add to conversation history
        this.conversationHistory.push({
            role: 'user',
            content: userMessage
        });

        // Prepare system message
        const systemMessage = {
            role: 'system',
            content: `You are Tigran AI, an advanced AI assistant for NeoCollege. Provide accurate, helpful, and detailed information about:

            COLLEGE INFORMATION:
            - Programs: AI Development ($999), Blockchain Engineering ($1299), VR/AR Development ($899), Cybersecurity ($1099)
            - Admission: Online application, AI interview, technical assessment
            - Tuition: Payment plans available, cryptocurrency accepted
            - Accreditation: Internationally recognized, blockchain-verified diplomas
            - Campus: Virtual reality campus, AI-powered learning environments

            RESPONSE GUIDELINES:
            - Always respond in English
            - Be extremely precise and accurate (100% correct information)
            - Provide detailed, comprehensive answers
            - Offer multiple solutions when applicable
            - Include specific examples and steps
            - Maintain professional but friendly tone
            - If unsure, admit it and suggest alternatives

            CONTACT INFORMATION:
            - Email: admissions@neocollege.com
            - Phone: +1 (555) 123-EDU
            - Telegram: @ARMFFSOFT
            - PayPal: edoe0739@gmail.com

            Current date: ${new Date().toISOString().split('T')[0]}`
        };

        try {
            const response = await fetch(this.baseURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [systemMessage, ...this.conversationHistory],
                    max_tokens: 2000,
                    temperature: 0.7,
                    stream: false
                })
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            const aiResponse = data.choices[0].message.content;

            // Add AI response to history
            this.conversationHistory.push({
                role: 'assistant',
                content: aiResponse
            });

            // Limit history size
            if (this.conversationHistory.length > 20) {
                this.conversationHistory = this.conversationHistory.slice(-20);
            }

            this.saveConversationHistory();
            return aiResponse;

        } catch (error) {
            console.error('DeepSeek API Error:', error);
            
            // Fallback to intelligent responses
            return this.getFallbackResponse(userMessage);
        } finally {
            this.isLoading = false;
        }
    }

    getFallbackResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        const responseMap = {
            'program': `We offer cutting-edge programs:

            🤖 AI Development ($999)
            - Machine Learning & Neural Networks
            - Computer Vision & NLP
            - AI Ethics & Deployment

            ⛓️ Blockchain Engineering ($1299)  
            - Smart Contracts & DeFi
            - Web3 Development
            - Crypto Economics

            🕶️ VR/AR Development ($899)
            - 3D Modeling & Animation
            - Unity/Unreal Engine
            - Metaverse Design

            🔐 Cybersecurity ($1099)
            - Ethical Hacking
            - Network Security
            - Cryptography

            All programs include:
            • AI-powered personal mentor
            • VR lab access
            • NFT diploma upon completion
            • Career placement support`,

            'price': `Our tuition structure:

            💰 Program Fees:
            AI Development: $999
            Blockchain Engineering: $1299  
            VR/AR Development: $899
            Cybersecurity: $1099

            💳 Payment Options:
            • Full payment (5% discount)
            • Monthly installments
            • Cryptocurrency (BTC, ETH, USDT)
            • PayPal: edoe0739@gmail.com

            🎓 Scholarships available based on:
            • Technical assessment score
            • Previous experience
            • Financial need`,

            'apply': `Admission Process:

            1. ONLINE APPLICATION
               - Fill form at portal.neocollege.com
               - Upload required documents

            2. AI INTERVIEW  
               - 30-minute conversation with our AI
               - Technical mindset assessment

            3. TECHNICAL ASSESSMENT
               - Coding challenge (if applicable)
               - Problem-solving test

            4. FINAL DECISION
               - Results within 48 hours
               - Enrollment instructions

            Required documents:
            • Identification
            • Previous education certificates
            • Portfolio (for creative programs)`,

            'contact': `Contact Information:

            📧 Email: admissions@neocollege.com
            📞 Phone: +1 (555) 123-EDU
            ✈️ Telegram: @ARMFFSOFT
            💬 Discord: NeoCollege Community

            🕒 Support Hours:
            Monday-Friday: 9:00-18:00 EST
            Weekend: Emergency support only

            💳 Payment: PayPal to edoe0739@gmail.com`,

            'default': `Thank you for your question! I'm designed to provide extremely accurate information about NeoCollege.

For specific inquiries about:
• Programs and curriculum → I'll give detailed course outlines
• Admission requirements → I'll list exact requirements  
• Tuition and payment → I'll provide current pricing
• Technical support → I'll troubleshoot step-by-step
• Career outcomes → I'll share placement statistics

Please rephrase your question for the most precise answer, or contact our admissions team directly at admissions@neocollege.com.`
        };

        for (const [keyword, response] of Object.entries(responseMap)) {
            if (lowerMessage.includes(keyword)) {
                return response;
            }
        }

        return responseMap.default;
    }

    addMessageToChat(message, sender, isError = false) {
        const messagesContainer = document.getElementById('ai-chat-messages');
        const messageElement = this.createMessageElement(message, sender, isError);
        
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    createMessageElement(message, sender, isError = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message ${isError ? 'error-message' : ''}`;
        
        const timestamp = new Date().toLocaleTimeString([], { 
            hour: '2-digit', minute: '2-digit' 
        });

        messageDiv.innerHTML = `
            <div class="message-avatar">
                ${sender === 'user' ? 
                    '<i class="fas fa-user"></i>' : 
                    '<i class="fas fa-robot"></i>'
                }
            </div>
            <div class="message-content">
                <div class="message-text">${this.formatMessage(message)}</div>
                <div class="message-time">${timestamp}</div>
            </div>
        `;

        return messageDiv;
    }

    formatMessage(message) {
        // Convert markdown-like syntax to HTML
        return message
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>')
            .replace(/- (.*?)(?=\n|$)/g, '• $1<br>');
    }

    showLoadingIndicator() {
        const messagesContainer = document.getElementById('ai-chat-messages');
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'ai-loading-indicator';
        loadingDiv.className = 'message ai-message loading';
        loadingDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="loading-dots">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>
            </div>
        `;
        messagesContainer.appendChild(loadingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideLoadingIndicator() {
        const loadingIndicator = document.getElementById('ai-loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.remove();
        }
    }

    askQuickQuestion(question) {
        document.getElementById('ai-chat-input').value = question;
        this.sendMessage();
    }

    toggleChat() {
        const chatContainer = document.getElementById('tigran-ai-chat');
        if (chatContainer.classList.contains('hidden')) {
            chatContainer.classList.remove('hidden');
            document.getElementById('ai-chat-input').focus();
        } else {
            chatContainer.classList.add('hidden');
        }
    }

    clearChat() {
        const messagesContainer = document.getElementById('ai-chat-messages');
        messagesContainer.innerHTML = `
            <div class="ai-welcome-message">
                <div class="message ai-message">
                    <div class="message-content">
                        <p>Hello! I'm Tigran AI, your advanced assistant. How can I help you today?</p>
                    </div>
                </div>
            </div>
        `;
        this.conversationHistory = [];
        this.saveConversationHistory();
    }

    autoResizeTextarea(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }

    loadConversationHistory() {
        const saved = localStorage.getItem('tigran_ai_conversation');
        if (saved) {
            this.conversationHistory = JSON.parse(saved);
        }
    }

    saveConversationHistory() {
        localStorage.setItem('tigran_ai_conversation', 
            JSON.stringify(this.conversationHistory)
        );
    }
}

// Global instance
const TigranAI = new TigranAIService();
