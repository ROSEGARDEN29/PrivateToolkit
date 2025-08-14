// Password Generator PRO - Professional Edition
(function() {
    'use strict';

    // Enhanced character sets with more secure options
    const CHAR_SETS = {
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?~`',
        extendedSymbols: '¡¢£¤¥¦§¨©ª«¬®¯°±²³´µ¶·¸¹º»¼½¾¿',
        similar: '0O1lI',
        ambiguous: '{}[]()/\\\'"`~,;.<>',
        weak: 'aeiouAEIOU', // Common vowels that make passwords predictable
        safe: 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%^&*'
    };

    // Professional entropy calculations
    const ENTROPY_VALUES = {
        lowercase: 4.7,    // log2(26)
        uppercase: 4.7,    // log2(26)
        numbers: 3.32,     // log2(10)
        symbols: 4.9,      // log2(30)
        combined: 6.55     // log2(95)
    };

    // Security patterns and recommendations
    const SECURITY_PATTERNS = {
        corporate: { minLength: 12, requireAll: true, excludeSimilar: true },
        personal: { minLength: 10, requireMixed: true, allowSymbols: true },
        banking: { minLength: 16, requireAll: true, excludeAmbiguous: true, highEntropy: true },
        gaming: { minLength: 8, allowFun: true, memorable: true },
        maximum: { minLength: 20, requireAll: true, excludeSimilar: true, excludeAmbiguous: true }
    };

    // DOM elements
    let elements = {};
    
    // Password history for this session
    let passwordHistory = [];
    const MAX_HISTORY = 10;

    // Initialize when DOM is loaded
    function init() {
        // Get DOM elements
        elements = {
            lengthRange: document.getElementById('password-length'),
            lengthDisplay: document.getElementById('password-length-display'),
            lowercaseCheck: document.getElementById('password-lowercase'),
            uppercaseCheck: document.getElementById('password-uppercase'),
            numbersCheck: document.getElementById('password-numbers'),
            symbolsCheck: document.getElementById('password-symbols'),
            excludeSimilarCheck: document.getElementById('password-exclude-similar'),
            excludeAmbiguousCheck: document.getElementById('password-exclude-ambiguous'),
            generateBtn: document.getElementById('generate-password'),
            copyBtn: document.getElementById('copy-password'),
            resultDiv: document.getElementById('password-result'),
            strengthMeter: document.getElementById('password-strength'),
            strengthText: document.getElementById('strength-text'),
            strengthFill: document.getElementById('strength-fill'),
            strengthLength: document.getElementById('strength-length'),
            strengthTypes: document.getElementById('strength-types')
        };

        // Add event listeners
        setupEventListeners();
        
        // Initialize display
        updateLengthDisplay();
        
        // Add professional enhancements
        addProfessionalFeatures();
        
        console.log('🔐 Password Generator PRO initialized');
    }

    function setupEventListeners() {
        // Length slider with real-time feedback
        elements.lengthRange.addEventListener('input', (e) => {
            updateLengthDisplay();
            showEntropyPreview();
            provideLengthRecommendation(e.target.value);
        });
        
        // Generate button with enhanced UX
        elements.generateBtn.addEventListener('click', generatePasswordPro);
        
        // Copy button with security features
        elements.copyBtn.addEventListener('click', copyPasswordSecure);
        
        // Real-time validation with professional feedback
        const checkboxes = [
            elements.lowercaseCheck,
            elements.uppercaseCheck,
            elements.numbersCheck,
            elements.symbolsCheck
        ];
        
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                validateSelectionPro();
                showEntropyPreview();
            });
        });

        // Advanced options with tooltips
        elements.excludeSimilarCheck.addEventListener('change', showSecurityTip);
        elements.excludeAmbiguousCheck.addEventListener('change', showSecurityTip);

        // Keyboard shortcuts
        document.addEventListener('keydown', handleKeyboardShortcuts);
    }

    function addProfessionalFeatures() {
        // Add entropy display
        createEntropyDisplay();
        
        // Add security presets
        createSecurityPresets();
        
        // Add password analysis
        createPasswordAnalysis();
        
        // Add export options
        createExportOptions();
    }

    function createEntropyDisplay() {
        const strengthMeter = elements.strengthMeter;
        if (!strengthMeter) return;

        // Add entropy indicator
        const entropyDiv = document.createElement('div');
        entropyDiv.className = 'entropy-display';
        entropyDiv.innerHTML = `
            <div class="entropy-info">
                <span class="entropy-label">Entropy:</span>
                <span id="entropy-bits" class="entropy-bits">0 bits</span>
                <span id="crack-time" class="crack-time">Instant</span>
            </div>
        `;
        
        strengthMeter.insertAdjacentElement('afterend', entropyDiv);
    }

    function createSecurityPresets() {
        const controlsDiv = elements.generateBtn.parentElement;
        
        const presetsDiv = document.createElement('div');
        presetsDiv.className = 'security-presets';
        presetsDiv.innerHTML = `
            <label class="control-label">Quick Presets</label>
            <div class="preset-buttons">
                <button type="button" class="preset-btn" data-preset="corporate">Corporate</button>
                <button type="button" class="preset-btn" data-preset="banking">Banking</button>
                <button type="button" class="preset-btn" data-preset="personal">Personal</button>
                <button type="button" class="preset-btn" data-preset="maximum">Maximum</button>
            </div>
        `;
        
        controlsDiv.insertBefore(presetsDiv, elements.generateBtn);
        
        // Add preset event listeners
        presetsDiv.addEventListener('click', (e) => {
            if (e.target.classList.contains('preset-btn')) {
                applySecurityPreset(e.target.dataset.preset);
            }
        });
    }

    function createPasswordAnalysis() {
        const resultDiv = elements.resultDiv.parentElement;
        
        const analysisDiv = document.createElement('div');
        analysisDiv.id = 'password-analysis';
        analysisDiv.className = 'password-analysis';
        analysisDiv.style.display = 'none';
        
        resultDiv.appendChild(analysisDiv);
    }

    function createExportOptions() {
        const copyBtn = elements.copyBtn;
        
        const exportDiv = document.createElement('div');
        exportDiv.className = 'export-options';
        exportDiv.innerHTML = `
            <button id="generate-multiple" class="btn btn-secondary btn-small">Generate 5</button>
            <button id="save-secure" class="btn btn-secondary btn-small">Save Secure</button>
        `;
        exportDiv.style.display = 'none';
        
        copyBtn.insertAdjacentElement('afterend', exportDiv);
        
        // Add export event listeners
        document.getElementById('generate-multiple').addEventListener('click', generateMultiplePasswords);
        document.getElementById('save-secure').addEventListener('click', savePasswordSecure);
    }

    function updateLengthDisplay() {
        const length = elements.lengthRange.value;
        elements.lengthDisplay.textContent = length;
        
        // Add security color coding
        const display = elements.lengthDisplay;
        display.className = 'range-display';
        
        if (length < 8) display.classList.add('weak');
        else if (length < 12) display.classList.add('medium');
        else if (length < 16) display.classList.add('strong');
        else display.classList.add('maximum');
    }

    function provideLengthRecommendation(length) {
        length = parseInt(length);
        let recommendation = '';
        
        if (length < 8) {
            recommendation = '⚠️ Too short - vulnerable to attacks';
        } else if (length < 12) {
            recommendation = '⚡ Acceptable for personal use';
        } else if (length < 16) {
            recommendation = '🛡️ Good for corporate security';
        } else if (length < 20) {
            recommendation = '🔒 Excellent for sensitive accounts';
        } else {
            recommendation = '🛡️ Maximum security level';
        }
        
        showRecommendation(recommendation);
    }

    function showEntropyPreview() {
        const settings = getPasswordSettings();
        const entropy = calculateEntropy(settings);
        const crackTime = calculateCrackTime(entropy);
        
        const entropyBits = document.getElementById('entropy-bits');
        const crackTimeEl = document.getElementById('crack-time');
        
        if (entropyBits) entropyBits.textContent = `${entropy.toFixed(1)} bits`;
        if (crackTimeEl) crackTimeEl.textContent = crackTime;
    }

    function calculateEntropy(settings) {
        let charsetSize = 0;
        
        if (settings.includeLowercase) charsetSize += 26;
        if (settings.includeUppercase) charsetSize += 26;
        if (settings.includeNumbers) charsetSize += 10;
        if (settings.includeSymbols) charsetSize += 30;
        
        // Adjust for exclusions
        if (settings.excludeSimilar) charsetSize -= 5;
        if (settings.excludeAmbiguous) charsetSize -= 15;
        
        return settings.length * Math.log2(Math.max(charsetSize, 1));
    }

    function calculateCrackTime(entropy) {
        // Assuming 10^12 attempts per second (modern hardware)
        const attemptsPerSecond = Math.pow(10, 12);
        const totalCombinations = Math.pow(2, entropy);
        const secondsToCrack = totalCombinations / (2 * attemptsPerSecond);
        
        if (secondsToCrack < 1) return 'Instant';
        if (secondsToCrack < 60) return `${secondsToCrack.toFixed(0)} seconds`;
        if (secondsToCrack < 3600) return `${(secondsToCrack / 60).toFixed(0)} minutes`;
        if (secondsToCrack < 86400) return `${(secondsToCrack / 3600).toFixed(0)} hours`;
        if (secondsToCrack < 31536000) return `${(secondsToCrack / 86400).toFixed(0)} days`;
        if (secondsToCrack < 3153600000) return `${(secondsToCrack / 31536000).toFixed(0)} years`;
        return 'Billions of years';
    }

    function applySecurityPreset(preset) {
        const config = SECURITY_PATTERNS[preset];
        if (!config) return;
        
        // Apply length
        elements.lengthRange.value = config.minLength;
        updateLengthDisplay();
        
        // Apply character requirements
        if (config.requireAll) {
            elements.lowercaseCheck.checked = true;
            elements.uppercaseCheck.checked = true;
            elements.numbersCheck.checked = true;
            elements.symbolsCheck.checked = true;
        } else if (config.requireMixed) {
            elements.lowercaseCheck.checked = true;
            elements.uppercaseCheck.checked = true;
            elements.numbersCheck.checked = true;
        }
        
        // Apply security options
        if (config.excludeSimilar) elements.excludeSimilarCheck.checked = true;
        if (config.excludeAmbiguous) elements.excludeAmbiguousCheck.checked = true;
        
        // Show preset applied notification
        showSuccess(`${preset.charAt(0).toUpperCase() + preset.slice(1)} security preset applied`);
        
        // Update entropy display
        showEntropyPreview();
        validateSelectionPro();
    }

    function validateSelectionPro() {
        const hasSelection = elements.lowercaseCheck.checked ||
                           elements.uppercaseCheck.checked ||
                           elements.numbersCheck.checked ||
                           elements.symbolsCheck.checked;
        
        elements.generateBtn.disabled = !hasSelection;
        
        if (!hasSelection) {
            showError('Please select at least one character type for generation');
            return false;
        }

        // Professional validation
        const settings = getPasswordSettings();
        if (settings.length < 8) {
            showWarning('Password length below 8 characters is not recommended for security');
        }
        
        return true;
    }

    function generatePasswordPro() {
        try {
            // Get settings with validation
            const settings = getPasswordSettings();
            
            if (!validateSettings(settings)) {
                return;
            }

            // Professional generation with enhanced security
            const password = createPasswordPro(settings);
            
            // Security analysis
            const analysis = performSecurityAnalysis(password, settings);
            
            // Display results
            displayPasswordPro(password, analysis);
            
            // Add to history
            addToHistory(password);
            
            // Show export options
            document.querySelector('.export-options').style.display = 'flex';
            
            console.log('🔐 Professional password generated with entropy:', analysis.entropy.toFixed(2), 'bits');
            
        } catch (error) {
            console.error('Password generation error:', error);
            showError('Password generation failed. Please check your settings and try again.');
        }
    }

    function getPasswordSettings() {
        return {
            length: parseInt(elements.lengthRange.value),
            includeLowercase: elements.lowercaseCheck.checked,
            includeUppercase: elements.uppercaseCheck.checked,
            includeNumbers: elements.numbersCheck.checked,
            includeSymbols: elements.symbolsCheck.checked,
            excludeSimilar: elements.excludeSimilarCheck.checked,
            excludeAmbiguous: elements.excludeAmbiguousCheck.checked
        };
    }

    function validateSettings(settings) {
        // Enhanced validation
        if (!settings.includeLowercase && !settings.includeUppercase && 
            !settings.includeNumbers && !settings.includeSymbols) {
            showError('Please select at least one character type');
            return false;
        }

        if (settings.length < 4) {
            showError('Password length must be at least 4 characters');
            return false;
        }

        return true;
    }

    function createPasswordPro(settings) {
        // Build enhanced charset
        let charset = buildCharsetPro(settings);
        
        if (charset.length === 0) {
            throw new Error('No valid characters available for password generation');
        }

        // Professional generation algorithm
        let password = '';
        let requiredChars = [];

        // Ensure minimum character diversity
        const charGroups = getCharacterGroups(settings);
        charGroups.forEach(group => {
            if (group.chars.length > 0) {
                requiredChars.push(getSecureRandomChar(group.chars));
            }
        });

        // Add required characters
        password += requiredChars.join('');

        // Fill remaining length with cryptographically random characters
        const remainingLength = settings.length - password.length;
        for (let i = 0; i < remainingLength; i++) {
            password += getSecureRandomChar(charset);
        }

        // Professional shuffling algorithm (Fisher-Yates)
        password = fisherYatesShuffle(password.split('')).join('');

        // Final security check
        if (!passesSecurityChecks(password, settings)) {
            // Regenerate if it fails security checks (rare)
            return createPasswordPro(settings);
        }

        return password;
    }

    function buildCharsetPro(settings) {
        let charset = '';
        
        if (settings.includeLowercase) {
            charset += filterCharsetPro(CHAR_SETS.lowercase, settings);
        }
        
        if (settings.includeUppercase) {
            charset += filterCharsetPro(CHAR_SETS.uppercase, settings);
        }
        
        if (settings.includeNumbers) {
            charset += filterCharsetPro(CHAR_SETS.numbers, settings);
        }
        
        if (settings.includeSymbols) {
            charset += filterCharsetPro(CHAR_SETS.symbols, settings);
        }

        return charset;
    }

    function filterCharsetPro(charset, settings) {
        let filtered = charset;
        
        if (settings.excludeSimilar) {
            filtered = filtered.split('').filter(char => 
                !CHAR_SETS.similar.includes(char)
            ).join('');
        }
        
        if (settings.excludeAmbiguous) {
            filtered = filtered.split('').filter(char => 
                !CHAR_SETS.ambiguous.includes(char)
            ).join('');
        }
        
        return filtered;
    }

    function getCharacterGroups(settings) {
        const groups = [];
        
        if (settings.includeLowercase) {
            groups.push({ 
                name: 'lowercase', 
                chars: filterCharsetPro(CHAR_SETS.lowercase, settings)
            });
        }
        
        if (settings.includeUppercase) {
            groups.push({ 
                name: 'uppercase', 
                chars: filterCharsetPro(CHAR_SETS.uppercase, settings)
            });
        }
        
        if (settings.includeNumbers) {
            groups.push({ 
                name: 'numbers', 
                chars: filterCharsetPro(CHAR_SETS.numbers, settings)
            });
        }
        
        if (settings.includeSymbols) {
            groups.push({ 
                name: 'symbols', 
                chars: filterCharsetPro(CHAR_SETS.symbols, settings)
            });
        }
        
        return groups;
    }

    function getSecureRandomChar(charset) {
        // Use cryptographically secure random if available
        if (window.crypto && window.crypto.getRandomValues) {
            const array = new Uint32Array(1);
            window.crypto.getRandomValues(array);
            return charset[array[0] % charset.length];
        }
        
        // Fallback to Math.random()
        return charset[Math.floor(Math.random() * charset.length)];
    }

    function fisherYatesShuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function passesSecurityChecks(password, settings) {
        // Check for common weak patterns
        if (password.match(/(.)\1{2,}/)) return false; // No 3+ repeated characters
        if (password.match(/012|123|234|345|456|567|678|789|890/)) return false; // No sequential numbers
        if (password.match(/abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i)) return false; // No sequential letters
        
        return true;
    }

    function performSecurityAnalysis(password, settings) {
        const entropy = calculateEntropy(settings);
        const crackTime = calculateCrackTime(entropy);
        const strength = calculatePasswordStrengthPro(password, settings);
        
        return {
            entropy: entropy,
            crackTime: crackTime,
            strength: strength,
            patterns: analyzePatterns(password),
            recommendations: generateRecommendations(password, settings)
        };
    }

    function calculatePasswordStrengthPro(password, settings) {
        let score = 0;
        let feedback = [];

        // Enhanced scoring algorithm
        
        // Length scoring (exponential)
        if (password.length >= 8) score += 20;
        if (password.length >= 10) score += 10;
        if (password.length >= 12) score += 10;
        if (password.length >= 16) score += 15;
        if (password.length >= 20) score += 15;

        // Character diversity scoring
        let charTypes = 0;
        if (/[a-z]/.test(password)) { charTypes++; score += 10; }
        if (/[A-Z]/.test(password)) { charTypes++; score += 10; }
        if (/[0-9]/.test(password)) { charTypes++; score += 10; }
        if (/[^a-zA-Z0-9]/.test(password)) { charTypes++; score += 15; }

        // Security features
        if (settings.excludeSimilar) score += 5;
        if (settings.excludeAmbiguous) score += 5;

        // Pattern analysis penalties
        if (password.match(/(.)\1{2,}/)) score -= 15; // Repeated characters
        if (password.match(/012|123|234|345|456|567|678|789|890/)) score -= 20; // Sequential numbers
        if (password.match(/abc|bcd|cde/i)) score -= 20; // Sequential letters

        // Determine professional strength level
        let level, color, description;
        
        if (score >= 90) {
            level = 'Military Grade';
            color = '#10b981';
            description = 'Exceptional security - suitable for top-secret applications';
        } else if (score >= 80) {
            level = 'Enterprise';
            color = '#22c55e';
            description = 'Excellent security - perfect for corporate environments';
        } else if (score >= 65) {
            level = 'Strong';
            color = '#84cc16';
            description = 'Good security - suitable for important accounts';
        } else if (score >= 45) {
            level = 'Moderate';
            color = '#f59e0b';
            description = 'Acceptable security - consider improvements';
        } else if (score >= 25) {
            level = 'Weak';
            color = '#f97316';
            description = 'Insufficient security - upgrade recommended';
        } else {
            level = 'Critical';
            color = '#ef4444';
            description = 'Dangerous - immediate upgrade required';
        }

        return {
            score: Math.max(0, Math.min(score, 100)),
            level: level,
            color: color,
            description: description,
            charTypes: charTypes
        };
    }

    function analyzePatterns(password) {
        const patterns = [];
        
        if (password.match(/(.)\1{2,}/)) patterns.push('Repeated characters detected');
        if (password.match(/\d{3,}/)) patterns.push('Sequential numbers found');
        if (password.match(/[a-z]{3,}/i)) patterns.push('Long letter sequences detected');
        if (password.match(/^[a-z]/)) patterns.push('Starts with lowercase');
        if (password.match(/\d$/)) patterns.push('Ends with number');
        
        return patterns;
    }

    function generateRecommendations(password, settings) {
        const recommendations = [];
        
        if (password.length < 12) recommendations.push('Increase length to 12+ characters');
        if (!settings.includeSymbols) recommendations.push('Add special characters for stronger security');
        if (!settings.excludeSimilar) recommendations.push('Exclude similar characters (0,O,l,I) to prevent confusion');
        if (password.match(/(.)\1{2,}/)) recommendations.push('Avoid repeated character patterns');
        
        return recommendations;
    }

    function displayPasswordPro(password, analysis) {
        // Display password
        elements.resultDiv.textContent = password;
        elements.resultDiv.classList.add('generated', 'professional');
        elements.copyBtn.style.display = 'inline-flex';
        
        // Display strength analysis
        displayStrengthAnalysisPro(analysis);
        
        // Display detailed analysis
        displayDetailedAnalysis(analysis);
    }

    function displayStrengthAnalysisPro(analysis) {
        // Show strength meter
        elements.strengthMeter.style.display = 'block';
        
        // Update strength information
        elements.strengthText.textContent = analysis.strength.level;
        elements.strengthText.style.color = analysis.strength.color;
        elements.strengthText.title = analysis.strength.description;
        
        // Update strength bar with animation
        elements.strengthFill.style.width = '0%';
        elements.strengthFill.style.backgroundColor = analysis.strength.color;
        
        // Animate strength bar
        setTimeout(() => {
            elements.strengthFill.style.transition = 'width 1s ease-out';
            elements.strengthFill.style.width = analysis.strength.score + '%';
        }, 100);
        
        // Update details
        elements.strengthLength.textContent = `${elements.lengthRange.value} chars`;
        elements.strengthTypes.textContent = `${analysis.strength.charTypes} types`;
        
        // Update entropy display
        const entropyBits = document.getElementById('entropy-bits');
        const crackTimeEl = document.getElementById('crack-time');
        
        if (entropyBits) entropyBits.textContent = `${analysis.entropy.toFixed(1)} bits`;
        if (crackTimeEl) {
            crackTimeEl.textContent = analysis.crackTime;
            crackTimeEl.style.color = analysis.entropy > 60 ? '#22c55e' : analysis.entropy > 40 ? '#f59e0b' : '#ef4444';
        }
    }

    function displayDetailedAnalysis(analysis) {
        const analysisDiv = document.getElementById('password-analysis');
        if (!analysisDiv) return;
        
        let content = `
            <div class="analysis-header">
                <h4>🔐 Professional Security Analysis</h4>
            </div>
            <div class="analysis-grid">
                <div class="analysis-item">
                    <span class="analysis-label">Security Level:</span>
                    <span class="analysis-value" style="color: ${analysis.strength.color}">${analysis.strength.level}</span>
                </div>
                <div class="analysis-item">
                    <span class="analysis-label">Entropy:</span>
                    <span class="analysis-value">${analysis.entropy.toFixed(1)} bits</span>
                </div>
                <div class="analysis-item">
                    <span class="analysis-label">Crack Time:</span>
                    <span class="analysis-value">${analysis.crackTime}</span>
                </div>
            </div>
        `;
        
        if (analysis.patterns.length > 0) {
            content += `
                <div class="analysis-patterns">
                    <h5>⚠️ Pattern Analysis:</h5>
                    <ul>${analysis.patterns.map(p => `<li>${p}</li>`).join('')}</ul>
                </div>
            `;
        }
        
        if (analysis.recommendations.length > 0) {
            content += `
                <div class="analysis-recommendations">
                    <h5>💡 Security Recommendations:</h5>
                    <ul>${analysis.recommendations.map(r => `<li>${r}</li>`).join('')}</ul>
                </div>
            `;
        }
        
        analysisDiv.innerHTML = content;
        analysisDiv.style.display = 'block';
    }

    function addToHistory(password) {
        passwordHistory.unshift({
            password: password,
            timestamp: new Date(),
            strength: elements.strengthText.textContent
        });
        
        if (passwordHistory.length > MAX_HISTORY) {
            passwordHistory = passwordHistory.slice(0, MAX_HISTORY);
        }
    }

    function generateMultiplePasswords() {
        const passwords = [];
        const settings = getPasswordSettings();
        
        for (let i = 0; i < 5; i++) {
            passwords.push(createPasswordPro(settings));
        }
        
        showMultiplePasswords(passwords);
    }

    function showMultiplePasswords(passwords) {
        const modal = document.createElement('div');
        modal.className = 'password-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>🔐 Generated Passwords</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="password-list">
                    ${passwords.map((pwd, i) => `
                        <div class="password-item">
                            <span class="password-text">${pwd}</span>
                            <button class="copy-individual" data-password="${pwd}">Copy</button>
                        </div>
                    `).join('')}
                </div>
                <div class="modal-footer">
                    <button class="copy-all-passwords">Copy All</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Event listeners
        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
        modal.querySelector('.copy-all-passwords').addEventListener('click', () => {
            navigator.clipboard.writeText(passwords.join('\n'));
            showSuccess('All passwords copied to clipboard');
            modal.remove();
        });
        
        modal.querySelectorAll('.copy-individual').forEach(btn => {
            btn.addEventListener('click', (e) => {
                navigator.clipboard.writeText(e.target.dataset.password);
                showSuccess('Password copied');
            });
        });
        
        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    function savePasswordSecure() {
        const password = elements.resultDiv.textContent;
        const timestamp = new Date().toISOString();
        const strength = elements.strengthText.textContent;
        
        const data = `Password: ${password}\nGenerated: ${timestamp}\nStrength: ${strength}\n\n`;
        
        const blob = new Blob([data], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `secure_password_${timestamp.split('T')[0]}.txt`;
        a.click();
        
        URL.revokeObjectURL(url);
        showSuccess('Password saved securely to file');
    }

    function copyPasswordSecure() {
        const password = elements.resultDiv.textContent;
        
        if (!password || password === 'Click "Generate Password" to create a secure password') {
            showError('No password to copy');
            return;
        }

        // Enhanced clipboard security
        navigator.clipboard.writeText(password).then(() => {
            showSuccess('🔐 Password copied securely to clipboard');
            
            // Professional feedback with security timer
            const originalText = elements.copyBtn.innerHTML;
            elements.copyBtn.innerHTML = 'Copied! <span class="btn-icon">✓</span>';
            elements.copyBtn.classList.add('success');
            
            // Clear clipboard after 60 seconds for security
            setTimeout(() => {
                if (navigator.clipboard.writeText) {
                    navigator.clipboard.writeText('').catch(() => {}); // Clear clipboard
                }
            }, 60000);
            
            setTimeout(() => {
                elements.copyBtn.innerHTML = originalText;
                elements.copyBtn.classList.remove('success');
            }, 3000);
            
            // Add to activity log
            console.log('🔐 Password copied at:', new Date().toISOString());
            
        }).catch(err => {
            console.error('Copy failed:', err);
            showError('Failed to copy password. Please try manual selection.');
            
            // Fallback: Select text for manual copy
            const range = document.createRange();
            range.selectNode(elements.resultDiv);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
        });
    }

    function handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + G = Generate password
        if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
            e.preventDefault();
            generatePasswordPro();
        }
        
        // Ctrl/Cmd + C when password is selected = Copy
        if ((e.ctrlKey || e.metaKey) && e.key === 'c' && elements.resultDiv.classList.contains('generated')) {
            copyPasswordSecure();
        }
        
        // Escape = Clear password
        if (e.key === 'Escape') {
            clearPassword();
        }
    }

    function clearPassword() {
        elements.resultDiv.textContent = 'Click "Generate Password" to create a secure password';
        elements.resultDiv.classList.remove('generated', 'professional');
        elements.copyBtn.style.display = 'none';
        elements.strengthMeter.style.display = 'none';
        
        const analysisDiv = document.getElementById('password-analysis');
        if (analysisDiv) analysisDiv.style.display = 'none';
        
        const exportOptions = document.querySelector('.export-options');
        if (exportOptions) exportOptions.style.display = 'none';
    }

    function showSecurityTip() {
        const tip = elements.excludeSimilarCheck.checked || elements.excludeAmbiguousCheck.checked ?
                   '🛡️ Enhanced security: Character exclusions active' :
                   '💡 Tip: Enable character exclusions for better readability';
        
        showInfo(tip);
    }

    function showRecommendation(message) {
        // Create floating recommendation
        const existing = document.querySelector('.length-recommendation');
        if (existing) existing.remove();
        
        const rec = document.createElement('div');
        rec.className = 'length-recommendation';
        rec.textContent = message;
        rec.style.cssText = `
            position: absolute;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 1000;
            margin-top: 5px;
            animation: fadeInOut 3s ease-in-out forwards;
        `;
        
        elements.lengthRange.parentElement.appendChild(rec);
        
        setTimeout(() => rec.remove(), 3000);
    }

    function showError(message) {
        console.error('🔒 Password Generator Error:', message);
        createNotification(message, 'error', '❌');
    }

    function showSuccess(message) {
        console.log('🔐 Password Generator Success:', message);
        createNotification(message, 'success', '✅');
    }

    function showWarning(message) {
        console.warn('⚠️ Password Generator Warning:', message);
        createNotification(message, 'warning', '⚠️');
    }

    function showInfo(message) {
        console.info('💡 Password Generator Info:', message);
        createNotification(message, 'info', '💡');
    }

    function createNotification(message, type, icon) {
        // Remove existing notifications
        document.querySelectorAll('.pro-notification').forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = `pro-notification ${type}`;
        notification.innerHTML = `
            <span class="notification-icon">${icon}</span>
            <span class="notification-text">${message}</span>
        `;
        
        // Professional styling
        const colors = {
            error: '#fee2e2',
            success: '#dcfce7', 
            warning: '#fef3c7',
            info: '#dbeafe'
        };
        
        const textColors = {
            error: '#991b1b',
            success: '#166534',
            warning: '#92400e', 
            info: '#1e40af'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type]};
            color: ${textColors[type]};
            border: 1px solid ${textColors[type]}33;
            padding: 12px 16px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 8px;
            max-width: 350px;
            font-weight: 500;
            animation: slideIn 0.3s ease-out forwards;
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after delay
        const delay = type === 'error' ? 5000 : 3000;
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => notification.remove(), 300);
        }, delay);
        
        // Click to dismiss
        notification.addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => notification.remove(), 300);
        });
    }

    // Add professional CSS animations
    function addProfessionalStyles() {
        if (document.getElementById('password-pro-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'password-pro-styles';
        styles.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateY(-10px); }
                20% { opacity: 1; transform: translateY(0); }
                80% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(-10px); }
            }
            
            .range-display.weak { color: #ef4444; font-weight: bold; }
            .range-display.medium { color: #f59e0b; font-weight: bold; }
            .range-display.strong { color: #22c55e; font-weight: bold; }
            .range-display.maximum { color: #10b981; font-weight: bold; text-shadow: 0 0 10px #10b98144; }
            
            .entropy-display {
                background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                border: 1px solid #cbd5e1;
                border-radius: 8px;
                padding: 12px;
                margin-top: 10px;
            }
            
            .entropy-info {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 14px;
            }
            
            .entropy-bits {
                font-weight: bold;
                color: #1e40af;
            }
            
            .crack-time {
                font-weight: 600;
            }
            
            .security-presets {
                margin: 15px 0;
            }
            
            .preset-buttons {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
                gap: 8px;
                margin-top: 8px;
            }
            
            .preset-btn {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .preset-btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
            }
            
            .preset-btn:active {
                transform: translateY(0);
            }
            
            .password-analysis {
                background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
                border: 1px solid #cbd5e1;
                border-radius: 12px;
                padding: 16px;
                margin-top: 15px;
            }
            
            .analysis-header h4 {
                margin: 0 0 12px 0;
                color: #1e293b;
                font-size: 16px;
            }
            
            .analysis-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 12px;
                margin-bottom: 15px;
            }
            
            .analysis-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: white;
                padding: 8px 12px;
                border-radius: 6px;
                border: 1px solid #e2e8f0;
            }
            
            .analysis-label {
                font-weight: 500;
                color: #64748b;
                font-size: 13px;
            }
            
            .analysis-value {
                font-weight: bold;
                font-size: 13px;
            }
            
            .analysis-patterns, .analysis-recommendations {
                background: white;
                border-radius: 6px;
                padding: 12px;
                margin-top: 12px;
                border: 1px solid #e2e8f0;
            }
            
            .analysis-patterns h5, .analysis-recommendations h5 {
                margin: 0 0 8px 0;
                font-size: 14px;
            }
            
            .analysis-patterns ul, .analysis-recommendations ul {
                margin: 0;
                padding-left: 20px;
                font-size: 13px;
            }
            
            .export-options {
                display: flex;
                gap: 8px;
                margin-left: 8px;
            }
            
            .password-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
            }
            
            .modal-content {
                background: white;
                border-radius: 12px;
                padding: 24px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }
            
            .modal-close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #64748b;
            }
            
            .password-list {
                max-height: 300px;
                overflow-y: auto;
            }
            
            .password-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px;
                margin: 8px 0;
                background: #f8fafc;
                border-radius: 8px;
                border: 1px solid #e2e8f0;
            }
            
            .password-text {
                font-family: 'Courier New', monospace;
                font-weight: bold;
                color: #1e293b;
                flex: 1;
                margin-right: 12px;
            }
            
            .copy-individual, .copy-all-passwords {
                background: #3b82f6;
                color: white;
                border: none;
                padding: 6px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                font-weight: 600;
            }
            
            .copy-individual:hover, .copy-all-passwords:hover {
                background: #2563eb;
            }
            
            .modal-footer {
                margin-top: 20px;
                text-align: center;
            }
            
            .result-text.professional {
                font-family: 'Courier New', monospace;
                font-size: 18px;
                font-weight: bold;
                letter-spacing: 1px;
                text-align: center;
                padding: 16px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                text-shadow: none;
            }
        `;
        
        document.head.appendChild(styles);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            init();
            addProfessionalStyles();
        });
    } else {
        init();
        addProfessionalStyles();
    }

    // Export professional API
    window.PasswordGeneratorPro = {
        generatePassword: generatePasswordPro,
        calculateEntropy: calculateEntropy,
        calculateCrackTime: calculateCrackTime,
        applySecurityPreset: applySecurityPreset,
        SECURITY_PATTERNS: SECURITY_PATTERNS,
        version: '2.0.0-pro'
    };

    console.log('🔐 Password Generator PRO v2.0.0 loaded successfully');

})();
