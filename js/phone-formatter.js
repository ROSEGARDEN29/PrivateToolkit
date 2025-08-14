// Phone Number Formatter functionality
(function() {
    'use strict';

    // Country codes and patterns for phone number detection
    const COUNTRY_PATTERNS = {
        'US': {
            name: 'United States',
            code: '+1',
            pattern: /^(\+?1)?[\s\-\.]?(\(?[2-9]\d{2}\)?[\s\-\.]?[2-9]\d{2}[\s\-\.]?\d{4})$/,
            format: '($1) $2-$3',
            example: '(555) 123-4567',
            length: 10
        },
        'CA': {
            name: 'Canada',
            code: '+1',
            pattern: /^(\+?1)?[\s\-\.]?(\(?[2-9]\d{2}\)?[\s\-\.]?[2-9]\d{2}[\s\-\.]?\d{4})$/,
            format: '($1) $2-$3',
            example: '(416) 555-1234',
            length: 10
        },
        'GB': {
            name: 'United Kingdom',
            code: '+44',
            pattern: /^(\+?44|0)?[\s\-\.]?([1-9]\d{8,9})$/,
            format: '$1 $2 $3',
            example: '020 7946 0958',
            length: 11
        },
        'DE': {
            name: 'Germany',
            code: '+49',
            pattern: /^(\+?49|0)?[\s\-\.]?([1-9]\d{9,11})$/,
            format: '$1 $2 $3',
            example: '030 12345678',
            length: [10, 11, 12]
        },
        'FR': {
            name: 'France',
            code: '+33',
            pattern: /^(\+?33|0)?[\s\-\.]?([1-9](?:[\s\-\.]?\d{2}){4})$/,
            format: '$1 $2 $3 $4 $5',
            example: '01 23 45 67 89',
            length: 10
        },
        'ES': {
            name: 'Spain',
            code: '+34',
            pattern: /^(\+?34)?[\s\-\.]?([6789]\d{8})$/,
            format: '$1 $2 $3',
            example: '612 345 678',
            length: 9
        },
        'MX': {
            name: 'Mexico',
            code: '+52',
            pattern: /^(\+?52)?[\s\-\.]?([1-9]\d{9})$/,
            format: '$1 $2 $3',
            example: '55 1234 5678',
            length: 10
        }
    };

    // Word mappings for text formatting
    const NUMBER_WORDS = {
        '0': 'zero', '1': 'one', '2': 'two', '3': 'three', '4': 'four',
        '5': 'five', '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine'
    };

    // DOM elements
    let elements = {};

    // Current phone data
    let currentPhoneData = null;

    // Initialize when DOM is loaded
    function init() {
        // Get DOM elements
        elements = {
            phoneInput: document.getElementById('phone-input'),
            formatStyle: document.getElementById('format-style'),
            maskLevel: document.getElementById('mask-level'),
            formatBtn: document.getElementById('format-phone'),
            copyBtn: document.getElementById('copy-phone'),
            resultDiv: document.getElementById('phone-result'),
            explanationDiv: document.getElementById('phone-explanation')
        };

        // Add event listeners
        setupEventListeners();

        // Initialize display
        updateMaskLevelDisplay();
    }

    function setupEventListeners() {
        // Phone input with real-time formatting and validation
        elements.phoneInput.addEventListener('input', handlePhoneInput);
        elements.phoneInput.addEventListener('paste', handlePhonePaste);
        elements.phoneInput.addEventListener('blur', validatePhoneInput);
        
        // Format style change
        elements.formatStyle.addEventListener('change', updateFormatPreview);
        
        // Mask level change
        elements.maskLevel.addEventListener('input', updateMaskLevelDisplay);
        elements.maskLevel.addEventListener('change', updateFormatPreview);
        
        // Format button
        elements.formatBtn.addEventListener('click', formatPhoneNumber);
        
        // Copy button
        elements.copyBtn.addEventListener('click', copyFormattedPhone);
        
        // Enter key support
        elements.phoneInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                formatPhoneNumber();
            }
        });
    }

    function handlePhoneInput(e) {
        const input = e.target.value;
        
        // Real-time validation and formatting hints
        if (input.length > 3) {
            const phoneData = parsePhoneNumber(input);
            if (phoneData.isValid) {
                e.target.classList.remove('invalid');
                e.target.classList.add('valid');
                showInputHint(phoneData);
            } else {
                e.target.classList.remove('valid');
                if (input.length > 6) {
                    e.target.classList.add('invalid');
                }
            }
        } else {
            e.target.classList.remove('valid', 'invalid');
            hideInputHint();
        }
    }

    function handlePhonePaste(e) {
        // Allow paste and then process
        setTimeout(() => {
            const input = e.target.value;
            const phoneData = parsePhoneNumber(input);
            if (phoneData.isValid) {
                // Auto-format the pasted number
                e.target.value = phoneData.formatted;
                showInputHint(phoneData);
            }
        }, 10);
    }

    function validatePhoneInput() {
        const input = elements.phoneInput.value.trim();
        if (input && !parsePhoneNumber(input).isValid) {
            showError('Please enter a valid phone number');
        }
    }

    function parsePhoneNumber(input) {
        // Clean input
        const cleaned = input.replace(/[\s\-\(\)\.\+]/g, '');
        
        // Try to detect country and format
        for (const [countryCode, countryData] of Object.entries(COUNTRY_PATTERNS)) {
            const match = input.match(countryData.pattern);
            if (match) {
                return {
                    isValid: true,
                    country: countryCode,
                    countryName: countryData.name,
                    countryCode: countryData.code,
                    originalNumber: cleaned,
                    nationalNumber: extractNationalNumber(cleaned, countryData),
                    formatted: formatBasicNumber(cleaned, countryData),
                    raw: input.trim()
                };
            }
        }

        // Fallback: try to guess format for unknown numbers
        if (cleaned.length >= 7 && cleaned.length <= 15) {
            return {
                isValid: true,
                country: 'UNKNOWN',
                countryName: 'Unknown',
                countryCode: '',
                originalNumber: cleaned,
                nationalNumber: cleaned,
                formatted: formatUnknownNumber(cleaned),
                raw: input.trim()
            };
        }

        return {
            isValid: false,
            error: 'Invalid phone number format'
        };
    }

    function extractNationalNumber(cleaned, countryData) {
        // Remove country code if present
        const codeDigits = countryData.code.replace('+', '');
        if (cleaned.startsWith(codeDigits)) {
            return cleaned.substring(codeDigits.length);
        }
        return cleaned;
    }

    function formatBasicNumber(cleaned, countryData) {
        const nationalNumber = extractNationalNumber(cleaned, countryData);
        
        // Apply basic formatting based on country
        switch (countryData.code) {
            case '+1': // US/CA
                if (nationalNumber.length === 10) {
                    return `(${nationalNumber.substring(0, 3)}) ${nationalNumber.substring(3, 6)}-${nationalNumber.substring(6)}`;
                }
                break;
            case '+44': // UK
                if (nationalNumber.length >= 10) {
                    return `${nationalNumber.substring(0, 3)} ${nationalNumber.substring(3, 7)} ${nationalNumber.substring(7)}`;
                }
                break;
            case '+49': // Germany
                if (nationalNumber.length >= 10) {
                    return `${nationalNumber.substring(0, 3)} ${nationalNumber.substring(3, 7)} ${nationalNumber.substring(7)}`;
                }
                break;
            case '+33': // France
                if (nationalNumber.length === 9) {
                    return `${nationalNumber.substring(0, 1)} ${nationalNumber.substring(1, 3)} ${nationalNumber.substring(3, 5)} ${nationalNumber.substring(5, 7)} ${nationalNumber.substring(7)}`;
                }
                break;
        }
        
        return formatUnknownNumber(nationalNumber);
    }

    function formatUnknownNumber(number) {
        // Generic formatting for unknown numbers
        if (number.length <= 7) {
            return number.replace(/(\d{3})(\d{4})/, '$1-$2');
        } else if (number.length <= 10) {
            return number.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        } else {
            return number.replace(/(\d{2,4})(\d{3,4})(\d{4})/, '$1 $2 $3');
        }
    }

    function showInputHint(phoneData) {
        // Could show country flag or formatting hint
        const hint = `Detected: ${phoneData.countryName} ${phoneData.countryCode}`;
        elements.phoneInput.title = hint;
    }

    function hideInputHint() {
        elements.phoneInput.title = '';
    }

    function updateMaskLevelDisplay() {
        const level = elements.maskLevel.value;
        const labels = elements.maskLevel.parentElement.querySelector('.range-labels');
        if (labels) {
            const spans = labels.querySelectorAll('span');
            spans.forEach((span, index) => {
                span.classList.toggle('active', index + 1 == level);
            });
        }
    }

    function updateFormatPreview() {
        if (currentPhoneData && currentPhoneData.isValid) {
            const formatted = applyPrivacyFormatting(currentPhoneData);
            showPreview(formatted);
        }
    }

    function formatPhoneNumber() {
        const input = elements.phoneInput.value.trim();
        
        if (!input) {
            showError('Please enter a phone number');
            return;
        }

        const phoneData = parsePhoneNumber(input);
        
        if (!phoneData.isValid) {
            showError('Please enter a valid phone number');
            return;
        }

        currentPhoneData = phoneData;
        
        // Apply privacy formatting
        const formattedResult = applyPrivacyFormatting(phoneData);
        
        // Display result
        displayFormattedPhone(formattedResult);
        
        // Show explanation
        showExplanation(phoneData, formattedResult);
    }

    function applyPrivacyFormatting(phoneData) {
        const style = elements.formatStyle.value;
        const maskLevel = parseInt(elements.maskLevel.value);
        const nationalNumber = phoneData.nationalNumber;
        
        let result = {
            formatted: '',
            style: style,
            maskLevel: maskLevel,
            description: ''
        };

        switch (style) {
            case 'partial':
                result.formatted = applyPartialMasking(nationalNumber, maskLevel);
                result.description = 'Partial masking with block characters (█)';
                break;
                
            case 'dots':
                result.formatted = applyDotFormatting(nationalNumber, maskLevel);
                result.description = 'Dot-separated formatting to break up number patterns';
                break;
                
            case 'spaces':
                result.formatted = applySpaceFormatting(nationalNumber, maskLevel);
                result.description = 'Space-separated formatting for readability';
                break;
                
            case 'text':
                result.formatted = applyTextFormatting(nationalNumber, maskLevel);
                result.description = 'Text representation to avoid automated detection';
                break;
        }

        return result;
    }

    function applyPartialMasking(number, level) {
        const len = number.length;
        let masked = number;
        
        switch (level) {
            case 1: // Low - mask middle digits
                if (len >= 7) {
                    const start = Math.floor(len * 0.3);
                    const end = Math.ceil(len * 0.7);
                    masked = number.substring(0, start) + '█'.repeat(end - start) + number.substring(end);
                }
                break;
                
            case 2: // Medium - mask more digits
                if (len >= 7) {
                    const keepStart = Math.min(2, Math.floor(len * 0.2));
                    const keepEnd = Math.min(2, Math.floor(len * 0.2));
                    const maskLength = len - keepStart - keepEnd;
                    masked = number.substring(0, keepStart) + '█'.repeat(maskLength) + number.substring(len - keepEnd);
                }
                break;
                
            case 3: // High - minimal visible digits
                if (len >= 7) {
                    const keepStart = 1;
                    const keepEnd = 2;
                    const maskLength = len - keepStart - keepEnd;
                    masked = number.substring(0, keepStart) + '█'.repeat(maskLength) + number.substring(len - keepEnd);
                }
                break;
        }
        
        // Format with separators
        return formatMaskedNumber(masked);
    }

    function formatMaskedNumber(masked) {
        if (masked.length === 10) {
            return `${masked.substring(0, 3)}-██-${masked.substring(6)}`;
        } else if (masked.length <= 7) {
            return masked.replace(/(\d{3})(.*?)(\d{4})/, '$1-$2-$3');
        } else {
            return masked.replace(/(\d{2,3})(.*?)(\d{2,4})/, '$1-$2-$3');
        }
    }

    function applyDotFormatting(number, level) {
        let formatted = number;
        
        // Add dots at different intervals based on level
        switch (level) {
            case 1: // Standard dot separation
                if (number.length === 10) {
                    formatted = `${number.substring(0, 3)}.${number.substring(3, 6)}.${number.substring(6)}`;
                } else {
                    formatted = number.replace(/(\d{2,3})(\d{3,4})(\d{4})/, '$1.$2.$3');
                }
                break;
                
            case 2: // More frequent dots
                formatted = number.split('').join('.');
                break;
                
            case 3: // Dots with spacing
                if (number.length === 10) {
                    formatted = `${number.substring(0, 3)} . ${number.substring(3, 6)} . ${number.substring(6)}`;
                } else {
                    formatted = number.replace(/(\d{2,3})(\d{3,4})(\d{4})/, '$1 . $2 . $3');
                }
                break;
        }
        
        return formatted;
    }

    function applySpaceFormatting(number, level) {
        let formatted = number;
        
        switch (level) {
            case 1: // Standard spacing
                if (number.length === 10) {
                    formatted = `${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6)}`;
                } else {
                    formatted = number.replace(/(\d{2,3})(\d{3,4})(\d{4})/, '$1 $2 $3');
                }
                break;
                
            case 2: // Individual digit spacing
                formatted = number.split('').join(' ');
                break;
                
            case 3: // Double spacing
                if (number.length === 10) {
                    formatted = `${number.substring(0, 3)}  ${number.substring(3, 6)}  ${number.substring(6)}`;
                } else {
                    formatted = number.replace(/(\d{2,3})(\d{3,4})(\d{4})/, '$1  $2  $3');
                }
                break;
        }
        
        return formatted;
    }

    function applyTextFormatting(number, level) {
        let formatted = '';
        
        switch (level) {
            case 1: // Convert some digits to words
                const digits = number.split('');
                formatted = digits.map((digit, index) => {
                    // Convert every other digit to word
                    return index % 2 === 0 ? NUMBER_WORDS[digit] : digit;
                }).join('-');
                break;
                
            case 2: // Convert more digits to words
                formatted = number.split('').map((digit, index) => {
                    // Convert 2/3 of digits to words
                    return index % 3 !== 0 ? NUMBER_WORDS[digit] : digit;
                }).join('-');
                break;
                
            case 3: // Convert all digits to words
                formatted = number.split('').map(digit => NUMBER_WORDS[digit]).join('-');
                break;
        }
        
        return formatted;
    }

    function displayFormattedPhone(result) {
        elements.resultDiv.textContent = result.formatted;
        elements.resultDiv.classList.add('generated');
        elements.copyBtn.style.display = 'inline-flex';
        
        // Add styling based on format type
        elements.resultDiv.className = `result-text generated format-${result.style}`;
    }

    function showExplanation(phoneData, result) {
        const explanation = elements.explanationDiv;
        
        let content = `
            <p><strong>Original format detected:</strong> ${phoneData.countryName} (${phoneData.countryCode})</p>
            <p><strong>Privacy method:</strong> ${result.description}</p>
            <p><strong>Protection level:</strong> ${getLevelName(result.maskLevel)}</p>
            <div class="privacy-tips">
                <h4>Privacy Benefits:</h4>
                <ul>
                    <li>Prevents automated phone number harvesting</li>
                    <li>Reduces spam call likelihood</li>
                    <li>Maintains human readability</li>
                    <li>Suitable for public sharing</li>
                </ul>
            </div>
        `;
        
        explanation.innerHTML = content;
        explanation.style.display = 'block';
    }

    function getLevelName(level) {
        const names = ['', 'Low (readable)', 'Medium (balanced)', 'High (maximum privacy)'];
        return names[level] || 'Unknown';
    }

    function showPreview(result) {
        // Could show a preview of formatting in real-time
        // For now, we'll just update the button text
        elements.formatBtn.textContent = `Apply ${result.style} Formatting`;
    }

    function copyFormattedPhone() {
        const formatted = elements.resultDiv.textContent;
        
        if (!formatted || formatted === 'Enter a phone number to format it for safe sharing') {
            showError('No formatted phone number to copy');
            return;
        }

        navigator.clipboard.writeText(formatted).then(() => {
            showSuccess('Formatted phone number copied to clipboard');
            
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
            showError('Failed to copy formatted phone number');
        });
    }

    function showError(message) {
        console.error(message);
        if (typeof showNotification === 'function') {
            showNotification(message, 'error');
        } else {
            // Fallback notification
            const notification = document.createElement('div');
            notification.className = 'error-notification';
            notification.textContent = message;
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);
        }
    }

    function showSuccess(message) {
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
    window.PhoneFormatter = {
        parsePhoneNumber,
        formatPhoneNumber: applyPrivacyFormatting,
        COUNTRY_PATTERNS
    };

})();