// Password Generator functionality
(function() {
    'use strict';

    // Character sets for password generation
    const CHAR_SETS = {
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
        similar: '0O1lI',
        ambiguous: '{}[]()/\\\'"`~,;.<>'
    };

    // DOM elements
    let elements = {};

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
    }

    function setupEventListeners() {
        // Length slider
        elements.lengthRange.addEventListener('input', updateLengthDisplay);
        
        // Generate button
        elements.generateBtn.addEventListener('click', generatePassword);
        
        // Copy button
        elements.copyBtn.addEventListener('click', copyPassword);
        
        // Real-time validation on checkboxes
        const checkboxes = [
            elements.lowercaseCheck,
            elements.uppercaseCheck,
            elements.numbersCheck,
            elements.symbolsCheck
        ];
        
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', validateSelection);
        });
    }

    function updateLengthDisplay() {
        const length = elements.lengthRange.value;
        elements.lengthDisplay.textContent = length;
    }

    function validateSelection() {
        const hasSelection = elements.lowercaseCheck.checked ||
                           elements.uppercaseCheck.checked ||
                           elements.numbersCheck.checked ||
                           elements.symbolsCheck.checked;
        
        elements.generateBtn.disabled = !hasSelection;
        
        if (!hasSelection) {
            showError('Please select at least one character type');
        }
    }

    function generatePassword() {
        try {
            // Get settings
            const settings = getPasswordSettings();
            
            // Validate settings
            if (!validateSettings(settings)) {
                return;
            }

            // Generate password
            const password = createPassword(settings);
            
            // Display result
            displayPassword(password);
            
            // Calculate and display strength
            const strength = calculatePasswordStrength(password, settings);
            displayPasswordStrength(password, strength);
            
        } catch (error) {
            console.error('Password generation error:', error);
            showError('An error occurred while generating the password');
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
        // Check if at least one character type is selected
        if (!settings.includeLowercase && !settings.includeUppercase && 
            !settings.includeNumbers && !settings.includeSymbols) {
            showError('Please select at least one character type');
            return false;
        }

        return true;
    }

    function createPassword(settings) {
        // Build character set
        let charset = buildCharset(settings);
        
        if (charset.length === 0) {
            throw new Error('No valid characters available for password generation');
        }

        // Ensure password contains at least one character from each selected type
        let password = '';
        let requiredChars = [];

        // Add required characters
        if (settings.includeLowercase) {
            const lowerChars = filterCharset(CHAR_SETS.lowercase, settings);
            if (lowerChars.length > 0) {
                requiredChars.push(getRandomChar(lowerChars));
            }
        }
        
        if (settings.includeUppercase) {
            const upperChars = filterCharset(CHAR_SETS.uppercase, settings);
            if (upperChars.length > 0) {
                requiredChars.push(getRandomChar(upperChars));
            }
        }
        
        if (settings.includeNumbers) {
            const numberChars = filterCharset(CHAR_SETS.numbers, settings);
            if (numberChars.length > 0) {
                requiredChars.push(getRandomChar(numberChars));
            }
        }
        
        if (settings.includeSymbols) {
            const symbolChars = filterCharset(CHAR_SETS.symbols, settings);
            if (symbolChars.length > 0) {
                requiredChars.push(getRandomChar(symbolChars));
            }
        }

        // Add required characters to password
        requiredChars.forEach(char => {
            password += char;
        });

        // Fill remaining length with random characters
        const remainingLength = settings.length - password.length;
        for (let i = 0; i < remainingLength; i++) {
            password += getRandomChar(charset);
        }

        // Shuffle the password to avoid predictable patterns
        return shuffleString(password);
    }

    function buildCharset(settings) {
        let charset = '';
        
        if (settings.includeLowercase) {
            charset += filterCharset(CHAR_SETS.lowercase, settings);
        }
        
        if (settings.includeUppercase) {
            charset += filterCharset(CHAR_SETS.uppercase, settings);
        }
        
        if (settings.includeNumbers) {
            charset += filterCharset(CHAR_SETS.numbers, settings);
        }
        
        if (settings.includeSymbols) {
            charset += filterCharset(CHAR_SETS.symbols, settings);
        }

        return charset;
    }

    function filterCharset(charset, settings) {
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

    function getRandomChar(charset) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        return charset[randomIndex];
    }

    function shuffleString(str) {
        return str.split('').sort(() => Math.random() - 0.5).join('');
    }

    function calculatePasswordStrength(password, settings) {
        let score = 0;
        let feedback = [];

        // Length scoring
        if (password.length >= 8) score += 25;
        if (password.length >= 12) score += 15;
        if (password.length >= 16) score += 10;

        // Character type scoring
        let charTypes = 0;
        if (settings.includeLowercase) charTypes++;
        if (settings.includeUppercase) charTypes++;
        if (settings.includeNumbers) charTypes++;
        if (settings.includeSymbols) charTypes++;

        score += charTypes * 10;

        // Additional security features
        if (settings.excludeSimilar) score += 5;
        if (settings.excludeAmbiguous) score += 5;

        // Determine strength level
        let level = 'Very Weak';
        let color = '#ff4444';
        
        if (score >= 80) {
            level = 'Very Strong';
            color = '#22c55e';
        } else if (score >= 65) {
            level = 'Strong';
            color = '#84cc16';
        } else if (score >= 45) {
            level = 'Medium';
            color = '#f59e0b';
        } else if (score >= 25) {
            level = 'Weak';
            color = '#f97316';
        }

        return {
            score: Math.min(score, 100),
            level: level,
            color: color,
            charTypes: charTypes
        };
    }

    function displayPassword(password) {
        elements.resultDiv.textContent = password;
        elements.resultDiv.classList.add('generated');
        elements.copyBtn.style.display = 'inline-flex';
    }

    function displayPasswordStrength(password, strength) {
        // Show strength meter
        elements.strengthMeter.style.display = 'block';
        
        // Update strength text and color
        elements.strengthText.textContent = strength.level;
        elements.strengthText.style.color = strength.color;
        
        // Update strength bar
        elements.strengthFill.style.width = strength.score + '%';
        elements.strengthFill.style.backgroundColor = strength.color;
        
        // Update strength details
        elements.strengthLength.textContent = password.length + ' characters';
        elements.strengthTypes.textContent = strength.charTypes + ' types';
    }

    function copyPassword() {
        const password = elements.resultDiv.textContent;
        
        if (!password || password === 'Click "Generate Password" to create a secure password') {
            showError('No password to copy');
            return;
        }

        navigator.clipboard.writeText(password).then(() => {
            showSuccess('Password copied to clipboard');
            
            // Temporarily change button text
            const originalText = elements.copyBtn.innerHTML;
            elements.copyBtn.innerHTML = 'Copied! <span class="btn-icon">✓</span>';
            elements.copyBtn.classList.add('success');
            
            setTimeout(() => {
                elements.copyBtn.innerHTML = originalText;
                elements.copyBtn.classList.remove('success');
            }, 2000);
        }).catch(err => {
            console.error('Copy failed:', err);
            showError('Failed to copy password');
        });
    }

    function showError(message) {
        // You can customize this to match your site's notification system
        console.error(message);
        // For now, we'll use a simple alert - you can replace with a better notification
        if (typeof showNotification === 'function') {
            showNotification(message, 'error');
        } else {
            alert(message);
        }
    }

    function showSuccess(message) {
        // You can customize this to match your site's notification system
        console.log(message);
        if (typeof showNotification === 'function') {
            showNotification(message, 'success');
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export for testing or external use
    window.PasswordGenerator = {
        generatePassword,
        calculatePasswordStrength
    };

})();