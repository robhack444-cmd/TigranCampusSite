class AIAssistant {
    constructor() {
        this.isActive = false;
        this.init();
    }
    
    init() {
        this.createChatInterface();
        this.setupEventListeners();
    }
    
    createChatInterface() {
        this.chatHTML = `
            <div id="ai-chat-interface" class="fixed bottom-24 right-6 w-80 h-96 glass-morphism rounded-2xl hidden z-50">
                <div class="chat-header neuro-card rounded-t-2xl p-4 flex justify-between items-center">
                    <div class="flex items-center space-x-3">
                        <div class="ai-avatar-small w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
                            <i class="fas fa-robot text-white text-sm"></i>
                        </div>
                        <span class="font-bold">AI Помощник NeoCollege</span>
                    </div>
                    <button id="close-chat" class="text-gray-400 hover:text-white">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="chat-messages h-64 p-4 overflow-y-auto">
                    <div class="ai-message mb-4">
                        <div class="message-bubble glass-morphism rounded-2xl p-3 max-w-xs">
                            Привет! Я AI помощник NeoCollege. Чем могу помочь?
                        </div>
                    </div>
                </div>
                
                <div class="chat-input p-4 border-t border-gray-700">
                    <div class="flex space-x-2">
                        <input type="text" 
                               id="ai-chat-input" 
                               placeholder="Спроси о поступлении..."
                               class="flex-1 glass-morphism rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                        <button id="send-message" class="neuro-button px-4 py-2 rounded-xl">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', this.chatHTML);
        this.chatInterface = document.getElementById('ai-chat-interface');
    }
    
    setupEventListeners() {
        const aiAvatar = document.querySelector('.ai-avatar');
        const closeChat = document.getElementById('close-chat');
        const sendButton = document.getElementById('send-message');
        const chatInput = document.getElementById('ai-chat-input');
        
        aiAvatar.addEventListener('click', () => this.toggleChat());
        closeChat.addEventListener('click', () => this.hideChat());
        sendButton.addEventListener('click', () => this.sendMessage());
        
        chatInput.addEventListener('keypress', (e) => {
            if(e.key === 'Enter') this.sendMessage();
        });
    }
    
    toggleChat() {
        this.isActive = !this.isActive;
        if(this.isActive) {
            this.showChat();
        } else {
            this.hideChat();
        }
    }
    
    showChat() {
        this.chatInterface.classList.remove('hidden');
        this.chatInterface.classList.add('flex', 'flex-col');
        document.getElementById('ai-chat-input').focus();
    }
    
    hideChat() {
        this.chatInterface.classList.add('hidden');
        this.isActive = false;
    }
    
    async sendMessage() {
        const input = document.getElementById('ai-chat-input');
        const message = input.value.trim();
        
        if(!message) return;
        
        this.addUserMessage(message);
        input.value = '';
        
        // Simulate AI response
        const response = await this.getAIResponse(message);
        this.addAIMessage(response);
    }
    
    addUserMessage(message) {
        const messagesContainer = document.querySelector('.chat-messages');
        const messageHTML = `
            <div class="user-message mb-4 flex justify-end">
                <div class="message-bubble bg-cyan-600 rounded-2xl p-3 max-w-xs">
                    ${message}
                </div>
            </div>
        `;
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    addAIMessage(message) {
        const messagesContainer = document.querySelector('.chat-messages');
        const messageHTML = `
            <div class="ai-message mb-4">
                <div class="message-bubble glass-morphism rounded-2xl p-3 max-w-xs">
                    ${message}
                </div>
            </div>
        `;
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    async getAIResponse(message) {
        // Здесь будет интеграция с реальным AI API
        const responses = {
            'поступление': 'Для поступления нужно подать заявку через наш портал. Требования: аттестат, тестирование по IT, собеседование с AI.',
            'программы': 'Мы предлагаем: AI Разработка, Metaverse Дизайн, Blockchain Engineering, VR/AR Development.',
            'стоимость': 'Обучение бесплатное при условии заключения контракта на работу с нашими партнерами на 2 года после выпуска.',
            'диплом': 'Вы получаете NFT диплом в блокчейне, который верифицируется работодателями по всему миру.',
            'default': 'Отличный вопрос! Рекомендую обратиться в приемную комиссию через Telegram: @neocollege_admission'
        };
        
        const lowerMessage = message.toLowerCase();
        for(const [key, response] of Object.entries(responses)) {
            if(lowerMessage.includes(key)) {
                return response;
            }
        }
        
        return responses.default;
    }
}
