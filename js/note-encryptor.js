/**
 * Advanced Note Encryptor with AES-256-GCM
 * Implements secure client-side encryption with advanced features
 */

class NoteEncryptor {
    constructor() {
        this.algorithm = 'AES-GCM';
        this.keyLength = 256;
        this.ivLength = 12; // 96 bits for GCM
        this.saltLength = 16; // 128 bits
        this.tagLength = 16; // 128 bits
        this.iterations = 100000; // PBKDF2 iterations
        
        this.initializeEventListeners();
        this.initializeUI();
    }

    initializeEventListeners() {
        // Main action buttons
        document.getElementById('encrypt-note').addEventListener('click', () => this.encryptText());
        document.getElementById('decrypt-note').addEventListener('click', () => this.decryptText());
        document.getElementById('copy-encrypted-text').addEventListener('click', () => this.copyResult());

        // Real-time validation
        document.getElementById('encryption-password').addEventListener('input', (e) => {
            this.validatePassword(e.target.value);
        });

        // Auto-resize textarea
        document.getElementById('note-text').addEventListener('input', this.autoResizeTextarea);
        document.getElementById('encrypted-result').addEventListener('input', this.autoResizeTextarea);

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // Clear sensitive data on page unload
        window.addEventListener('beforeunload', () => this.clearSensitiveData());
    }

    initializeUI() {
        this.addPasswordStrengthIndicator();
        this.addAdvancedOptions();
        this.setupDragAndDrop();
    }

    addPasswordStrengthIndicator() {
        const passwordInput = document.getElementById('encryption-password');
        const strengthIndicator = document.createElement('div');
        strengthIndicator.className = 'password-strength-indicator';
        strengthIndicator.innerHTML = `
            <div class="strength-bar">
                <div class="strength-fill" id="password-strength-fill"></div>
            </div>
            <div class="strength-text" id="password-strength-text">Enter password</div>
        `;
        passwordInput.parentNode.appendChild(strengthIndicator);
    }

    addAdvancedOptions() {
        const controlGroup = document.createElement('div');
        controlGroup.className = 'control-group advanced-options';
        controlGroup.innerHTML = `
            <label class="control-label">
                <span class="advanced-toggle" id="show-advanced">Show Advanced Options ▼</span>
            </label>
            <div class="advanced-panel" id="advanced-panel" style="display: none;">
                <div class="option-row">
                    <label class="checkbox-item">
                        <input type="checkbox" id="include-metadata">
                        <span class="checkmark"></span>
                        Include encryption metadata
                    </label>
                    <label class="checkbox-item">
                        <input type="checkbox" id="compress-data" checked>
                        <span class="checkmark"></span>
                        Compress before encryption
                    </label>
                </div>
                <div class="option-row">
                    <label for="iterations-count" class="control-label">Key derivation iterations:</label>
                    <select id="iterations-count" class="select-input">
                        <option value="50000">Fast (50,000)</option>
                        <option value="100000" selected>Standard (100,000)</option>
                        <option value="200000">Secure (200,000)</option>
                        <option value="500000">Paranoid (500,000)</option>
                    </select>
                </div>
            </div>
        `;

        const passwordGroup = document.getElementById('encryption-password').parentNode;
        passwordGroup.parentNode.insertBefore(controlGroup, passwordGroup.nextSibling);

        // Toggle advanced options
        document.getElementById('show-advanced').addEventListener('click', () => {
            const panel = document.getElementById('advanced-panel');
            const toggle = document.getElementById('show-advanced');
            if (panel.style.display === 'none') {
                panel.style.display = 'block';
                toggle.textContent = 'Hide Advanced Options ▲';
            } else {
                panel.style.display = 'none';
                toggle.textContent = 'Show Advanced Options ▼';
            }
        });
    }

    setupDragAndDrop() {
        const textArea = document.getElementById('note-text');
        
        textArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            textArea.classList.add('drag-over');
        });

        textArea.addEventListener('dragleave', () => {
            textArea.classList.remove('drag-over');
        });

        textArea.addEventListener('drop', (e) => {
            e.preventDefault();
            textArea.classList.remove('drag-over');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFileUpload(files[0]);
            }
        });
    }

    async handleFileUpload(file) {
        if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
            const text = await file.text();
            document.getElementById('note-text').value = text;
            this.showNotification('File loaded successfully', 'success');
        } else {
            this.showNotification('Only text files are supported', 'error');
        }
    }

    validatePassword(password) {
        const strength = this.calculatePasswordStrength(password);
        const fill = document.getElementById('password-strength-fill');
        const text = document.getElementById('password-strength-text');

        if (!fill || !text) return;

        fill.style.width = `${strength.score}%`;
        fill.className = `strength-fill strength-${strength.level}`;
        text.textContent = strength.text;
        text.className = `strength-text strength-${strength.level}`;
    }

    calculatePasswordStrength(password) {
        if (!password) return { score: 0, level: 'weak', text: 'Enter password' };

        let score = 0;
        let feedback = [];

        // Length scoring
        if (password.length >= 8) score += 20;
        if (password.length >= 12) score += 15;
        if (password.length >= 16) score += 15;

        // Character variety
        if (/[a-z]/.test(password)) score += 10;
        if (/[A-Z]/.test(password)) score += 10;
        if (/[0-9]/.test(password)) score += 10;
        if (/[^A-Za-z0-9]/.test(password)) score += 10;

        // Advanced patterns
        if (!/(.)\1{2,}/.test(password)) score += 5; // No repeating chars
        if (!/012|123|234|345|456|567|678|789|890/.test(password)) score += 5; // No sequences
        if (password.length > 20) score += 5;

        let level, text;
        if (score < 30) {
            level = 'weak';
            text = 'Weak - Add more characters and variety';
        } else if (score < 60) {
            level = 'medium';
            text = 'Medium - Good but could be stronger';
        } else if (score < 85) {
            level = 'strong';
            text = 'Strong - Excellent password strength';
        } else {
            level = 'excellent';
            text = 'Excellent - Maximum security';
        }

        return { score: Math.min(score, 100), level, text };
    }

    async deriveKey(password, salt) {
        const iterations = parseInt(document.getElementById('iterations-count')?.value || '100000');
        
        const encoder = new TextEncoder();
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            encoder.encode(password),
            { name: 'PBKDF2' },
            false,
            ['deriveBits', 'deriveKey']
        );

        return await crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: iterations,
                hash: 'SHA-256'
            },
            keyMaterial,
            { name: 'AES-GCM', length: this.keyLength },
            false,
            ['encrypt', 'decrypt']
        );
    }

    async compressText(text) {
        if (!document.getElementById('compress-data')?.checked) return text;
        
        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(text);
            const stream = new CompressionStream('gzip');
            const writer = stream.writable.getWriter();
            const reader = stream.readable.getReader();
            
            writer.write(data);
            writer.close();
            
            const chunks = [];
            let done = false;
            while (!done) {
                const { value, done: readerDone } = await reader.read();
                done = readerDone;
                if (value) chunks.push(value);
            }
            
            return new Uint8Array(chunks.reduce((acc, chunk) => acc.concat(Array.from(chunk)), []));
        } catch (error) {
            console.warn('Compression failed, using uncompressed data:', error);
            return text;
        }
    }

    async decompressData(compressedData) {
        if (!document.getElementById('compress-data')?.checked) return compressedData;
        
        try {
            const stream = new DecompressionStream('gzip');
            const writer = stream.writable.getWriter();
            const reader = stream.readable.getReader();
            
            writer.write(compressedData);
            writer.close();
            
            const chunks = [];
            let done = false;
            while (!done) {
                const { value, done: readerDone } = await reader.read();
                done = readerDone;
                if (value) chunks.push(value);
            }
            
            const decompressed = new Uint8Array(chunks.reduce((acc, chunk) => acc.concat(Array.from(chunk)), []));
            return new TextDecoder().decode(decompressed);
        } catch (error) {
            console.warn('Decompression failed, treating as uncompressed:', error);
            return new TextDecoder().decode(compressedData);
        }
    }

    async encryptText() {
        try {
            const text = document.getElementById('note-text').value.trim();
            const password = document.getElementById('encryption-password').value;

            if (!text) {
                this.showNotification('Please enter text to encrypt', 'error');
                return;
            }

            if (!password) {
                this.showNotification('Please enter an encryption password', 'error');
                return;
            }

            if (password.length < 8) {
                this.showNotification('Password must be at least 8 characters long', 'error');
                return;
            }

            this.showProgress('Encrypting...');

            // Generate random salt and IV
            const salt = crypto.getRandomValues(new Uint8Array(this.saltLength));
            const iv = crypto.getRandomValues(new Uint8Array(this.ivLength));

            // Derive key from password
            const key = await this.deriveKey(password, salt);

            // Prepare data for encryption
            const dataToEncrypt = await this.compressText(text);
            const encoder = new TextEncoder();
            const encodedData = typeof dataToEncrypt === 'string' ? encoder.encode(dataToEncrypt) : dataToEncrypt;

            // Encrypt the data
            const encrypted = await crypto.subtle.encrypt(
                {
                    name: this.algorithm,
                    iv: iv,
                    tagLength: this.tagLength * 8
                },
                key,
                encodedData
            );

            // Create metadata if requested
            const metadata = document.getElementById('include-metadata')?.checked ? {
                timestamp: new Date().toISOString(),
                algorithm: this.algorithm,
                keyLength: this.keyLength,
                iterations: parseInt(document.getElementById('iterations-count')?.value || '100000'),
                compressed: document.getElementById('compress-data')?.checked
            } : null;

            // Combine all components
            const result = this.packageEncryptedData(salt, iv, new Uint8Array(encrypted), metadata);
            
            document.getElementById('encrypted-result').value = result;
            document.getElementById('copy-encrypted-text').style.display = 'inline-flex';
            
            this.hideProgress();
            this.showNotification('Text encrypted successfully', 'success');
            
        } catch (error) {
            console.error('Encryption error:', error);
            this.hideProgress();
            this.showNotification('Encryption failed: ' + error.message, 'error');
        }
    }

    async decryptText() {
        try {
            const encryptedData = document.getElementById('encrypted-result').value.trim();
            const password = document.getElementById('encryption-password').value;

            if (!encryptedData) {
                // Try to get data from note text area if result is empty
                const noteText = document.getElementById('note-text').value.trim();
                if (noteText && this.isEncryptedData(noteText)) {
                    document.getElementById('encrypted-result').value = noteText;
                    document.getElementById('note-text').value = '';
                } else {
                    this.showNotification('Please enter encrypted data to decrypt', 'error');
                    return;
                }
            }

            if (!password) {
                this.showNotification('Please enter the decryption password', 'error');
                return;
            }

            this.showProgress('Decrypting...');

            // Parse the encrypted data
            const { salt, iv, encrypted, metadata } = this.unpackageEncryptedData(encryptedData || document.getElementById('encrypted-result').value);

            // Update UI with metadata if available
            if (metadata) {
                this.displayMetadata(metadata);
            }

            // Derive key from password
            const key = await this.deriveKey(password, salt);

            // Decrypt the data
            const decrypted = await crypto.subtle.decrypt(
                {
                    name: this.algorithm,
                    iv: iv,
                    tagLength: this.tagLength * 8
                },
                key,
                encrypted
            );

            // Decompress if needed
            const result = await this.decompressData(new Uint8Array(decrypted));
            
            document.getElementById('note-text').value = result;
            document.getElementById('encrypted-result').value = '';
            document.getElementById('copy-encrypted-text').style.display = 'none';
            
            this.hideProgress();
            this.showNotification('Text decrypted successfully', 'success');
            
        } catch (error) {
            console.error('Decryption error:', error);
            this.hideProgress();
            if (error.name === 'InvalidAccessError' || error.message.includes('decrypt')) {
                this.showNotification('Decryption failed: Incorrect password or corrupted data', 'error');
            } else {
                this.showNotification('Decryption failed: ' + error.message, 'error');
            }
        }
    }

    packageEncryptedData(salt, iv, encrypted, metadata = null) {
        // Create a structured format that's both secure and portable
        const data = {
            v: 1, // Version
            s: this.arrayBufferToBase64(salt),
            i: this.arrayBufferToBase64(iv),
            d: this.arrayBufferToBase64(encrypted),
            ...(metadata && { m: metadata })
        };

        const jsonString = JSON.stringify(data);
        const encoded = btoa(unescape(encodeURIComponent(jsonString)));
        
        return `-----BEGIN ENCRYPTED NOTE-----\n${this.formatBase64(encoded)}\n-----END ENCRYPTED NOTE-----`;
    }

    unpackageEncryptedData(packagedData) {
        try {
            // Extract the base64 content
            const match = packagedData.match(/-----BEGIN ENCRYPTED NOTE-----\n(.*)\n-----END ENCRYPTED NOTE-----/s);
            if (!match) {
                throw new Error('Invalid encrypted data format');
            }

            const encoded = match[1].replace(/\s/g, '');
            const jsonString = decodeURIComponent(escape(atob(encoded)));
            const data = JSON.parse(jsonString);

            if (data.v !== 1) {
                throw new Error('Unsupported data version');
            }

            return {
                salt: this.base64ToArrayBuffer(data.s),
                iv: this.base64ToArrayBuffer(data.i),
                encrypted: this.base64ToArrayBuffer(data.d),
                metadata: data.m || null
            };
        } catch (error) {
            throw new Error('Failed to parse encrypted data: ' + error.message);
        }
    }

    isEncryptedData(text) {
        return text.includes('-----BEGIN ENCRYPTED NOTE-----') && text.includes('-----END ENCRYPTED NOTE-----');
    }

    displayMetadata(metadata) {
        let metadataDiv = document.getElementById('encryption-metadata');
        if (!metadataDiv) {
            metadataDiv = document.createElement('div');
            metadataDiv.id = 'encryption-metadata';
            metadataDiv.className = 'metadata-display';
            document.querySelector('.tool-output').appendChild(metadataDiv);
        }

        metadataDiv.innerHTML = `
            <h4>Encryption Metadata</h4>
            <div class="metadata-grid">
                <div class="metadata-item">
                    <span class="metadata-label">Created:</span>
                    <span class="metadata-value">${new Date(metadata.timestamp).toLocaleString()}</span>
                </div>
                <div class="metadata-item">
                    <span class="metadata-label">Algorithm:</span>
                    <span class="metadata-value">${metadata.algorithm}</span>
                </div>
                <div class="metadata-item">
                    <span class="metadata-label">Key Length:</span>
                    <span class="metadata-value">${metadata.keyLength} bits</span>
                </div>
                <div class="metadata-item">
                    <span class="metadata-label">Iterations:</span>
                    <span class="metadata-value">${metadata.iterations.toLocaleString()}</span>
                </div>
                <div class="metadata-item">
                    <span class="metadata-label">Compressed:</span>
                    <span class="metadata-value">${metadata.compressed ? 'Yes' : 'No'}</span>
                </div>
            </div>
        `;
    }

    formatBase64(base64String) {
        // Format base64 string with line breaks for readability
        return base64String.match(/.{1,64}/g).join('\n');
    }

    arrayBufferToBase64(buffer) {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    base64ToArrayBuffer(base64) {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes;
    }

    async copyResult() {
        const result = document.getElementById('encrypted-result').value;
        if (!result) {
            this.showNotification('No content to copy', 'error');
            return;
        }

        try {
            await navigator.clipboard.writeText(result);
            this.showNotification('Copied to clipboard', 'success');
        } catch (error) {
            // Fallback for older browsers
            this.fallbackCopyTextToClipboard(result);
        }
    }

    fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showNotification('Copied to clipboard', 'success');
        } catch (error) {
            this.showNotification('Failed to copy to clipboard', 'error');
        }
        
        document.body.removeChild(textArea);
    }

    autoResizeTextarea(e) {
        e.target.style.height = 'auto';
        e.target.style.height = (e.target.scrollHeight) + 'px';
    }

    handleKeyboardShortcuts(e) {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'Enter':
                    e.preventDefault();
                    if (e.shiftKey) {
                        this.decryptText();
                    } else {
                        this.encryptText();
                    }
                    break;
                case 'l':
                    e.preventDefault();
                    document.getElementById('note-text').value = '';
                    document.getElementById('encrypted-result').value = '';
                    document.getElementById('encryption-password').value = '';
                    break;
            }
        }
    }

    showProgress(message) {
        let progressDiv = document.getElementById('encryption-progress');
        if (!progressDiv) {
            progressDiv = document.createElement('div');
            progressDiv.id = 'encryption-progress';
            progressDiv.className = 'progress-indicator';
            document.querySelector('.tool-output').appendChild(progressDiv);
        }
        
        progressDiv.innerHTML = `
            <div class="progress-spinner"></div>
            <span class="progress-text">${message}</span>
        `;
        progressDiv.style.display = 'flex';
    }

    hideProgress() {
        const progressDiv = document.getElementById('encryption-progress');
        if (progressDiv) {
            progressDiv.style.display = 'none';
        }
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="notification-icon">${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}</span>
            <span class="notification-message">${message}</span>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    clearSensitiveData() {
        // Clear password field
        const passwordField = document.getElementById('encryption-password');
        if (passwordField) passwordField.value = '';

        // Clear any stored keys or sensitive data from memory
        if (this.cachedKey) {
            this.cachedKey = null;
        }
    }
}

// Initialize the Note Encryptor when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NoteEncryptor();
});

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NoteEncryptor;
}