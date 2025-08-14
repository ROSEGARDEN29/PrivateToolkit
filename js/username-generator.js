// Username Generator Tool
class UsernameGenerator {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateLengthDisplay();
    }

    bindEvents() {
        // Length slider
        const lengthSlider = document.getElementById('username-length');
        const generateBtn = document.getElementById('generate-username');
        const copyBtn = document.getElementById('copy-username');

        if (lengthSlider) {
            lengthSlider.addEventListener('input', () => this.updateLengthDisplay());
        }

        if (generateBtn) {
            generateBtn.addEventListener('click', () => this.generateUsername());
        }

        if (copyBtn) {
            copyBtn.addEventListener('click', () => this.copyToClipboard());
        }
    }

    updateLengthDisplay() {
        const lengthSlider = document.getElementById('username-length');
        const lengthDisplay = document.getElementById('username-length-display');
        
        if (lengthSlider && lengthDisplay) {
            lengthDisplay.textContent = lengthSlider.value;
        }
    }

    getSelectedOptions() {
        return {
            length: parseInt(document.getElementById('username-length').value),
            includeNumbers: document.getElementById('username-numbers').checked,
            includeSymbols: document.getElementById('username-symbols').checked,
            includeUppercase: document.getElementById('username-uppercase').checked,
            style: document.getElementById('username-style').value
        };
    }

    generateRandomCharacters(options) {
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        const symbols = '_-';

        let chars = lowercase;
        if (options.includeUppercase) chars += uppercase;
        if (options.includeNumbers) chars += numbers;
        if (options.includeSymbols) chars += symbols;

        let username = '';
        for (let i = 0; i < options.length; i++) {
            username += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return username;
    }

    generateReadableUsername(options) {
        const adjectives = ['Cool', 'Smart', 'Quick', 'Bright', 'Swift', 'Bold', 'Calm', 'Dark', 'Fast', 'Wild', 'Blue', 'Red', 'Gold', 'Wise', 'Keen'];
        const nouns = ['Tiger', 'Eagle', 'Wolf', 'Lion', 'Bear', 'Fox', 'Hawk', 'Storm', 'Fire', 'Wind', 'Star', 'Moon', 'Sun', 'Ocean', 'River'];

        let username = adjectives[Math.floor(Math.random() * adjectives.length)] +
                      nouns[Math.floor(Math.random() * nouns.length)];

        if (!options.includeUppercase) {
            username = username.toLowerCase();
        }

        if (options.includeNumbers) {
            const numLength = Math.min(3, Math.max(1, options.length - username.length));
            for (let i = 0; i < numLength; i++) {
                username += Math.floor(Math.random() * 10);
            }
        }

        if (options.includeSymbols && username.length < options.length) {
            username += '_';
        }

        // Adjust length
        if (username.length > options.length) {
            username = username.substring(0, options.length);
        } else if (username.length < options.length) {
            const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
            while (username.length < options.length) {
                username += chars.charAt(Math.floor(Math.random() * chars.length));
            }
        }

        return username;
    }

    generateGamingUsername(options) {
        const gamingPrefixes = ['Shadow', 'Dark', 'Pro', 'Elite', 'Master', 'Ninja', 'Cyber', 'Neon', 'Storm', 'Blaze'];
        const gamingSuffixes = ['Gamer', 'Player', 'Hunter', 'Warrior', 'Legend', 'Hero', 'Slayer', 'Knight', 'Assassin', 'Champion'];

        let username = gamingPrefixes[Math.floor(Math.random() * gamingPrefixes.length)] +
                      gamingSuffixes[Math.floor(Math.random() * gamingSuffixes.length)];

        if (!options.includeUppercase) {
            username = username.toLowerCase();
        }

        if (options.includeNumbers) {
            const year = Math.floor(Math.random() * 100) + 1;
            username += year.toString().padStart(2, '0');
        }

        if (options.includeSymbols) {
            username = username.replace(/([A-Z])/g, '_$1').toLowerCase();
            if (options.includeUppercase) {
                username = username.charAt(0).toUpperCase() + username.slice(1);
            }
        }

        // Adjust length
        if (username.length > options.length) {
            username = username.substring(0, options.length);
        } else if (username.length < options.length) {
            const chars = options.includeNumbers ? '0123456789' : 'abcdefghijklmnopqrstuvwxyz';
            while (username.length < options.length) {
                username += chars.charAt(Math.floor(Math.random() * chars.length));
            }
        }

        return username;
    }

    generateProfessionalUsername(options) {
        const firstNames = ['alex', 'jordan', 'taylor', 'casey', 'morgan', 'riley', 'cameron', 'drew', 'sage', 'quinn'];
        const lastNames = ['smith', 'johnson', 'brown', 'davis', 'miller', 'wilson', 'moore', 'taylor', 'anderson', 'thomas'];

        let username = firstNames[Math.floor(Math.random() * firstNames.length)] +
                      lastNames[Math.floor(Math.random() * lastNames.length)];

        if (options.includeUppercase) {
            username = username.charAt(0).toUpperCase() + username.slice(1);
        }

        if (options.includeNumbers && username.length < options.length) {
            const currentYear = new Date().getFullYear();
            const year = currentYear - Math.floor(Math.random() * 30);
            username += year.toString().slice(-2);
        }

        if (options.includeSymbols) {
            username = username.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
            if (options.includeUppercase && username.charAt(0) !== username.charAt(0).toUpperCase()) {
                username = username.charAt(0).toUpperCase() + username.slice(1);
            }
        }

        // Adjust length
        if (username.length > options.length) {
            username = username.substring(0, options.length);
        } else if (username.length < options.length) {
            const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
            while (username.length < options.length) {
                username += chars.charAt(Math.floor(Math.random() * chars.length));
            }
        }

        return username;
    }

    generateAlternatives(baseUsername, options) {
        const alternatives = [];
        const methods = [
            () => this.generateRandomCharacters(options),
            () => this.generateReadableUsername(options),
            () => this.generateGamingUsername(options),
            () => this.generateProfessionalUsername(options)
        ];

        // Generate 6 alternatives using different methods
        for (let i = 0; i < 6; i++) {
            const method = methods[Math.floor(Math.random() * methods.length)];
            let alternative = method();
            
            // Ensure it's different from the base username
            if (alternative !== baseUsername && !alternatives.includes(alternative)) {
                alternatives.push(alternative);
            } else {
                i--; // Try again
            }
        }

        return alternatives.slice(0, 6);
    }

    generateUsername() {
        const options = this.getSelectedOptions();
        let username = '';

        switch (options.style) {
            case 'random':
                username = this.generateRandomCharacters(options);
                break;
            case 'readable':
                username = this.generateReadableUsername(options);
                break;
            case 'gaming':
                username = this.generateGamingUsername(options);
                break;
            case 'professional':
                username = this.generateProfessionalUsername(options);
                break;
            default:
                username = this.generateRandomCharacters(options);
        }

        this.displayResult(username, options);
    }

    displayResult(username, options) {
        const resultElement = document.getElementById('username-result');
        const copyBtn = document.getElementById('copy-username');
        const suggestionsContainer = document.getElementById('username-suggestions');

        if (resultElement) {
            resultElement.textContent = username;
            resultElement.classList.add('generated');
        }

        if (copyBtn) {
            copyBtn.style.display = 'inline-flex';
        }

        // Generate and display alternatives
        if (suggestionsContainer) {
            const alternatives = this.generateAlternatives(username, options);
            this.displaySuggestions(alternatives);
            suggestionsContainer.style.display = 'block';
        }

        // Store current username for copying
        this.currentUsername = username;
    }

    displaySuggestions(alternatives) {
        const suggestionsGrid = document.querySelector('.suggestions-grid');
        
        if (suggestionsGrid) {
            suggestionsGrid.innerHTML = '';
            
            alternatives.forEach(alt => {
                const suggestionItem = document.createElement('div');
                suggestionItem.className = 'suggestion-item';
                suggestionItem.textContent = alt;
                suggestionItem.addEventListener('click', () => {
                    this.selectSuggestion(alt);
                });
                suggestionsGrid.appendChild(suggestionItem);
            });
        }
    }

    selectSuggestion(username) {
        const resultElement = document.getElementById('username-result');
        if (resultElement) {
            resultElement.textContent = username;
            this.currentUsername = username;
        }

        // Highlight selected suggestion
        document.querySelectorAll('.suggestion-item').forEach(item => {
            item.classList.remove('selected');
            if (item.textContent === username) {
                item.classList.add('selected');
            }
        });
    }

    async copyToClipboard() {
        if (!this.currentUsername) return;

        try {
            await navigator.clipboard.writeText(this.currentUsername);
            
            const copyBtn = document.getElementById('copy-username');
            const originalText = copyBtn.innerHTML;
            
            copyBtn.innerHTML = 'Copied! <span class="btn-icon">✓</span>';
            copyBtn.classList.add('success');
            
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.classList.remove('success');
            }, 2000);
        } catch (err) {
            // Fallback for older browsers
            this.fallbackCopyToClipboard(this.currentUsername);
        }
    }

    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            const copyBtn = document.getElementById('copy-username');
            const originalText = copyBtn.innerHTML;
            
            copyBtn.innerHTML = 'Copied! <span class="btn-icon">✓</span>';
            copyBtn.classList.add('success');
            
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.classList.remove('success');
            }, 2000);
        } catch (err) {
            console.error('Failed to copy username');
        }
        
        document.body.removeChild(textArea);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('username-generator')) {
        new UsernameGenerator();
    }
});