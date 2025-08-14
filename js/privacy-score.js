// Privacy Score Calculator functionality
(function() {
    'use strict';

    // Privacy categories and scoring weights
    const PRIVACY_CATEGORIES = {
        social: {
            name: 'Social Media Privacy',
            weight: 30,
            maxScore: 30,
            questions: {
                'social-private-profile': {
                    text: 'My social media profiles are set to private',
                    points: 12,
                    priority: 'high',
                    category: 'Profile Visibility'
                },
                'social-limited-personal-info': {
                    text: 'I limit personal information in my bio/about sections',
                    points: 10,
                    priority: 'high',
                    category: 'Information Disclosure'
                },
                'social-friend-requests': {
                    text: 'I only accept friend/connection requests from people I know',
                    points: 8,
                    priority: 'medium',
                    category: 'Network Security'
                }
            }
        },
        security: {
            name: 'Account Security',
            weight: 40,
            maxScore: 40,
            questions: {
                'security-2fa': {
                    text: 'I use two-factor authentication on important accounts',
                    points: 18,
                    priority: 'critical',
                    category: 'Authentication'
                },
                'security-unique-passwords': {
                    text: 'I use unique passwords for different accounts',
                    points: 15,
                    priority: 'critical',
                    category: 'Password Security'
                },
                'security-password-manager': {
                    text: 'I use a password manager',
                    points: 7,
                    priority: 'high',
                    category: 'Password Management'
                }
            }
        },
        browsing: {
            name: 'Browsing & Communication',
            weight: 30,
            maxScore: 30,
            questions: {
                'browsing-vpn': {
                    text: 'I use a VPN for browsing',
                    points: 12,
                    priority: 'high',
                    category: 'Network Privacy'
                },
                'browsing-incognito': {
                    text: 'I regularly use incognito/private browsing mode',
                    points: 8,
                    priority: 'medium',
                    category: 'Browsing Privacy'
                },
                'browsing-ad-blocker': {
                    text: 'I use ad blockers and privacy extensions',
                    points: 10,
                    priority: 'medium',
                    category: 'Tracking Protection'
                }
            }
        }
    };

    // Risk levels and recommendations
    const RISK_LEVELS = {
        critical: {
            name: 'Critical Risk',
            color: '#dc2626',
            description: 'Immediate action required',
            urgency: 1
        },
        high: {
            name: 'High Risk',
            color: '#ea580c',
            description: 'Should be addressed soon',
            urgency: 2
        },
        medium: {
            name: 'Medium Risk',
            color: '#d97706',
            description: 'Consider implementing',
            urgency: 3
        },
        low: {
            name: 'Low Risk',
            color: '#65a30d',
            description: 'Nice to have',
            urgency: 4
        }
    };

    // Detailed recommendations database
    const RECOMMENDATIONS_DB = {
        'social-private-profile': {
            title: 'Set Social Media Profiles to Private',
            description: 'Public profiles expose your personal information to anyone, including potential scammers, stalkers, and data brokers.',
            impact: 'High',
            effort: 'Low',
            steps: [
                'Go to your privacy settings on each social platform',
                'Change profile visibility to "Private" or "Friends Only"',
                'Review who can see your posts, photos, and personal information',
                'Limit who can find you via search engines'
            ],
            platforms: ['Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'TikTok'],
            timeToComplete: '15 minutes per platform'
        },
        'social-limited-personal-info': {
            title: 'Limit Personal Information in Bio/About Sections',
            description: 'Oversharing personal details makes you vulnerable to social engineering attacks and identity theft.',
            impact: 'High',
            effort: 'Low',
            steps: [
                'Remove or limit birth date information',
                'Avoid posting your location, workplace details, or relationship status',
                'Remove phone numbers and email addresses from public view',
                'Use privacy-conscious profile photos'
            ],
            risks: ['Identity theft', 'Social engineering', 'Stalking', 'Targeted advertising'],
            timeToComplete: '10 minutes per platform'
        },
        'social-friend-requests': {
            title: 'Carefully Manage Friend/Connection Requests',
            description: 'Accepting unknown contacts can expose your network and personal information to malicious actors.',
            impact: 'Medium',
            effort: 'Low',
            steps: [
                'Only accept requests from people you know personally',
                'Verify identity through mutual connections if unsure',
                'Regularly review and remove unknown contacts',
                'Be wary of fake profiles with limited information'
            ],
            warnings: ['Fake profiles', 'Social engineering', 'Network infiltration'],
            timeToComplete: 'Ongoing'
        },
        'security-2fa': {
            title: 'Enable Two-Factor Authentication (2FA)',
            description: '2FA provides an additional security layer that makes your accounts significantly harder to compromise.',
            impact: 'Critical',
            effort: 'Medium',
            steps: [
                'Enable 2FA on all important accounts (email, banking, social media)',
                'Use authenticator apps (Google Authenticator, Authy) instead of SMS when possible',
                'Save backup codes in a secure location',
                'Consider hardware security keys for maximum protection'
            ],
            priority: 'Immediate',
            accounts: ['Email', 'Banking', 'Social Media', 'Cloud Storage', 'Work Accounts'],
            timeToComplete: '30 minutes for all accounts'
        },
        'security-unique-passwords': {
            title: 'Use Unique Passwords for Each Account',
            description: 'Password reuse is one of the biggest security risks. If one account is compromised, all your accounts become vulnerable.',
            impact: 'Critical',
            effort: 'High',
            steps: [
                'Audit all your accounts and identify password reuse',
                'Create unique, strong passwords for each account',
                'Use a password manager to generate and store passwords',
                'Update passwords starting with most important accounts'
            ],
            statistics: '81% of data breaches involve weak or reused passwords',
            timeToComplete: '2-3 hours for complete audit'
        },
        'security-password-manager': {
            title: 'Use a Password Manager',
            description: 'Password managers generate, store, and fill strong unique passwords, making your digital life both more secure and convenient.',
            impact: 'High',
            effort: 'Medium',
            steps: [
                'Choose a reputable password manager (Bitwarden, 1Password, LastPass)',
                'Install browser extensions and mobile apps',
                'Import existing passwords and update weak ones',
                'Enable auto-fill and auto-generate for new accounts'
            ],
            benefits: ['Unique passwords', 'Convenient auto-fill', 'Secure storage', 'Cross-device sync'],
            timeToComplete: '1 hour setup + ongoing use'
        },
        'browsing-vpn': {
            title: 'Use a VPN for Browsing',
            description: 'VPNs encrypt your internet traffic and hide your IP address, protecting your privacy from ISPs, hackers, and trackers.',
            impact: 'High',
            effort: 'Low',
            steps: [
                'Choose a reputable VPN service with no-logs policy',
                'Install VPN apps on all your devices',
                'Always connect to VPN on public Wi-Fi',
                'Consider always-on VPN for maximum privacy'
            ],
            useCases: ['Public Wi-Fi', 'Geographic restrictions', 'ISP tracking prevention', 'Enhanced privacy'],
            timeToComplete: '20 minutes setup'
        },
        'browsing-incognito': {
            title: 'Use Private/Incognito Browsing Mode',
            description: 'Private browsing prevents your browser from storing history, cookies, and other tracking data.',
            impact: 'Medium',
            effort: 'Very Low',
            steps: [
                'Learn keyboard shortcuts (Ctrl+Shift+N in Chrome, Ctrl+Shift+P in Firefox)',
                'Use private mode for sensitive searches and browsing',
                'Remember that private mode only protects local storage, not network tracking',
                'Consider it a first step, not complete privacy protection'
            ],
            limitations: ['Does not hide activity from ISP', 'Websites can still track you', 'Not effective against advanced tracking'],
            timeToComplete: 'Immediate'
        },
        'browsing-ad-blocker': {
            title: 'Use Ad Blockers and Privacy Extensions',
            description: 'Ad blockers prevent tracking scripts and malicious ads from monitoring your browsing behavior.',
            impact: 'Medium',
            effort: 'Low',
            steps: [
                'Install uBlock Origin or similar ad blocker',
                'Add privacy-focused extensions like Privacy Badger or Ghostery',
                'Configure settings to block trackers and analytics',
                'Regularly update filter lists'
            ],
            extensions: ['uBlock Origin', 'Privacy Badger', 'Ghostery', 'ClearURLs', 'Decentraleyes'],
            timeToComplete: '15 minutes setup'
        }
    };

    // Grade thresholds and descriptions
    const GRADE_THRESHOLDS = {
        90: { grade: 'A+', description: 'Excellent Privacy Protection', color: '#059669' },
        80: { grade: 'A', description: 'Very Good Privacy Protection', color: '#0891b2' },
        70: { grade: 'B+', description: 'Good Privacy Protection', color: '#0284c7' },
        60: { grade: 'B', description: 'Adequate Privacy Protection', color: '#7c3aed' },
        50: { grade: 'C+', description: 'Fair Privacy Protection', color: '#d97706' },
        40: { grade: 'C', description: 'Poor Privacy Protection', color: '#ea580c' },
        30: { grade: 'D', description: 'Very Poor Privacy Protection', color: '#dc2626' },
        0: { grade: 'F', description: 'Critical Privacy Risk', color: '#991b1b' }
    };

    // DOM elements
    let elements = {};

    // Current assessment data
    let currentAssessment = null;

    // Initialize when DOM is loaded
    function init() {
        // Get DOM elements
        elements = {
            calculateBtn: document.getElementById('calculate-privacy-score'),
            scoreResult: document.getElementById('privacy-score-result'),
            scoreValue: document.getElementById('score-value'),
            scoreGrade: document.getElementById('score-grade'),
            socialScore: document.getElementById('social-score'),
            securityScore: document.getElementById('security-score'),
            browsingScore: document.getElementById('browsing-score'),
            recommendationsDiv: document.getElementById('privacy-recommendations'),
            checkboxes: document.querySelectorAll('.privacy-checkbox')
        };

        // Add event listeners
        setupEventListeners();

        // Initialize interactive features
        setupInteractiveFeatures();
    }

    function setupEventListeners() {
        // Calculate button
        elements.calculateBtn.addEventListener('click', calculatePrivacyScore);
        
        // Real-time updates on checkbox changes
        elements.checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', handleCheckboxChange);
        });

        // Enter key support
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.target.classList.contains('privacy-checkbox')) {
                calculatePrivacyScore();
            }
        });
    }

    function setupInteractiveFeatures() {
        // Add progress indicators to categories
        addCategoryProgressIndicators();
        
        // Add tooltips to questions
        addQuestionTooltips();
        
        // Add visual feedback for interactions
        addVisualFeedback();
    }

    function addCategoryProgressIndicators() {
        document.querySelectorAll('.category-section').forEach((section, index) => {
            const categoryKey = Object.keys(PRIVACY_CATEGORIES)[index];
            const category = PRIVACY_CATEGORIES[categoryKey];
            
            const progressBar = document.createElement('div');
            progressBar.className = 'category-progress';
            progressBar.innerHTML = `
                <div class="progress-bar">
                    <div class="progress-fill" data-category="${categoryKey}"></div>
                </div>
                <span class="progress-text">0/${category.maxScore}</span>
            `;
            
            const title = section.querySelector('.category-title');
            title.appendChild(progressBar);
        });
    }

    function addQuestionTooltips() {
        elements.checkboxes.forEach(checkbox => {
            const questionId = checkbox.id;
            const questionData = findQuestionData(questionId);
            
            if (questionData) {
                const label = checkbox.closest('.question-item');
                label.title = `Priority: ${questionData.priority.toUpperCase()} | Points: ${questionData.points} | Category: ${questionData.category}`;
                label.classList.add(`priority-${questionData.priority}`);
            }
        });
    }

    function addVisualFeedback() {
        elements.checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const item = e.target.closest('.question-item');
                if (e.target.checked) {
                    item.classList.add('checked');
                    animateScoreIncrease(item);
                } else {
                    item.classList.remove('checked');
                    animateScoreDecrease(item);
                }
                updateCategoryProgress();
            });
        });
    }

    function handleCheckboxChange(e) {
        updateCategoryProgress();
        
        // Update button text with real-time score preview
        const currentScore = calculateCurrentScore();
        elements.calculateBtn.innerHTML = `
            Calculate Privacy Score (Current: ${currentScore})
            <span class="btn-icon">📊</span>
        `;
    }

    function calculateCurrentScore() {
        let totalScore = 0;
        
        Object.keys(PRIVACY_CATEGORIES).forEach(categoryKey => {
            const category = PRIVACY_CATEGORIES[categoryKey];
            Object.keys(category.questions).forEach(questionId => {
                const checkbox = document.getElementById(questionId);
                if (checkbox && checkbox.checked) {
                    totalScore += category.questions[questionId].points;
                }
            });
        });
        
        return totalScore;
    }

    function updateCategoryProgress() {
        Object.keys(PRIVACY_CATEGORIES).forEach(categoryKey => {
            const category = PRIVACY_CATEGORIES[categoryKey];
            let categoryScore = 0;
            
            Object.keys(category.questions).forEach(questionId => {
                const checkbox = document.getElementById(questionId);
                if (checkbox && checkbox.checked) {
                    categoryScore += category.questions[questionId].points;
                }
            });
            
            const progressFill = document.querySelector(`[data-category="${categoryKey}"]`);
            const progressText = progressFill.parentElement.nextElementSibling;
            
            if (progressFill && progressText) {
                const percentage = (categoryScore / category.maxScore) * 100;
                progressFill.style.width = percentage + '%';
                progressFill.style.backgroundColor = getScoreColor(percentage);
                progressText.textContent = `${categoryScore}/${category.maxScore}`;
            }
        });
    }

    function calculatePrivacyScore() {
        const assessment = performPrivacyAssessment();
        currentAssessment = assessment;
        
        displayScoreResults(assessment);
        generatePersonalizedRecommendations(assessment);
        
        // Animate score reveal
        animateScoreReveal(assessment.totalScore);
        
        // Track completion
        trackAssessmentCompletion(assessment);
    }

    function performPrivacyAssessment() {
        const assessment = {
            totalScore: 0,
            categories: {},
            completedQuestions: 0,
            totalQuestions: 0,
            riskAreas: [],
            strengths: [],
            timestamp: new Date()
        };

        // Calculate scores by category
        Object.keys(PRIVACY_CATEGORIES).forEach(categoryKey => {
            const category = PRIVACY_CATEGORIES[categoryKey];
            const categoryAssessment = {
                score: 0,
                maxScore: category.maxScore,
                completedQuestions: 0,
                questions: {}
            };

            Object.keys(category.questions).forEach(questionId => {
                const checkbox = document.getElementById(questionId);
                const questionData = category.questions[questionId];
                
                assessment.totalQuestions++;
                
                if (checkbox && checkbox.checked) {
                    categoryAssessment.score += questionData.points;
                    categoryAssessment.completedQuestions++;
                    assessment.completedQuestions++;
                    assessment.strengths.push(questionData);
                } else {
                    assessment.riskAreas.push({
                        id: questionId,
                        ...questionData
                    });
                }
                
                categoryAssessment.questions[questionId] = {
                    completed: checkbox ? checkbox.checked : false,
                    points: questionData.points,
                    priority: questionData.priority
                };
            });

            assessment.categories[categoryKey] = categoryAssessment;
            assessment.totalScore += categoryAssessment.score;
        });

        // Calculate additional metrics
        assessment.completionRate = (assessment.completedQuestions / assessment.totalQuestions) * 100;
        assessment.grade = calculateGrade(assessment.totalScore);
        assessment.riskLevel = calculateRiskLevel(assessment);
        
        return assessment;
    }

    function calculateGrade(score) {
        for (const threshold of Object.keys(GRADE_THRESHOLDS).sort((a, b) => b - a)) {
            if (score >= parseInt(threshold)) {
                return GRADE_THRESHOLDS[threshold];
            }
        }
        return GRADE_THRESHOLDS[0];
    }

    function calculateRiskLevel(assessment) {
        const criticalMissing = assessment.riskAreas.filter(risk => risk.priority === 'critical').length;
        const highMissing = assessment.riskAreas.filter(risk => risk.priority === 'high').length;
        
        if (criticalMissing > 0) return 'critical';
        if (highMissing > 1) return 'high';
        if (assessment.totalScore < 50) return 'medium';
        return 'low';
    }

    function displayScoreResults(assessment) {
        // Show score display
        elements.scoreResult.style.display = 'block';
        
        // Update main score
        elements.scoreValue.textContent = assessment.totalScore;
        elements.scoreGrade.textContent = assessment.grade.grade;
        elements.scoreGrade.style.color = assessment.grade.color;
        
        // Update category scores
        elements.socialScore.textContent = `${assessment.categories.social.score}/${assessment.categories.social.maxScore}`;
        elements.securityScore.textContent = `${assessment.categories.security.score}/${assessment.categories.security.maxScore}`;
        elements.browsingScore.textContent = `${assessment.categories.browsing.score}/${assessment.categories.browsing.maxScore}`;
        
        // Update score circle color
        const circle = document.querySelector('.score-circle');
        if (circle) {
            circle.style.borderColor = assessment.grade.color;
        }
    }

    function generatePersonalizedRecommendations(assessment) {
        const recommendationsContainer = elements.recommendationsDiv.querySelector('.recommendations-content');
        
        if (!recommendationsContainer) {
            const content = document.createElement('div');
            content.className = 'recommendations-content';
            elements.recommendationsDiv.appendChild(content);
        }
        
        // Sort risk areas by priority and impact
        const prioritizedRisks = assessment.riskAreas.sort((a, b) => {
            const priorityOrder = { critical: 1, high: 2, medium: 3, low: 4 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });

        // Generate recommendations HTML
        let recommendationsHTML = `
            <div class="assessment-summary">
                <div class="summary-stats">
                    <div class="stat-item">
                        <span class="stat-value">${assessment.totalScore}</span>
                        <span class="stat-label">Total Score</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${Math.round(assessment.completionRate)}%</span>
                        <span class="stat-label">Completion</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${assessment.riskAreas.length}</span>
                        <span class="stat-label">Improvements</span>
                    </div>
                </div>
                <div class="grade-description">
                    <h4 style="color: ${assessment.grade.color}">${assessment.grade.description}</h4>
                    <p>Your privacy score indicates ${assessment.grade.description.toLowerCase()}. ${getGradeAdvice(assessment.grade.grade)}</p>
                </div>
            </div>
        `;

        if (prioritizedRisks.length > 0) {
            recommendationsHTML += `
                <div class="priority-recommendations">
                    <h4>📋 Recommended Actions</h4>
                    ${prioritizedRisks.slice(0, 5).map(risk => generateRecommendationCard(risk)).join('')}
                </div>
            `;
        }

        if (assessment.strengths.length > 0) {
            recommendationsHTML += `
                <div class="strengths-section">
                    <h4>✅ Your Privacy Strengths</h4>
                    <div class="strengths-list">
                        ${assessment.strengths.map(strength => `
                            <div class="strength-item">
                                <span class="strength-icon">✓</span>
                                <span class="strength-text">${strength.text}</span>
                                <span class="strength-points">+${strength.points} pts</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // Advanced insights
        recommendationsHTML += generateAdvancedInsights(assessment);

        recommendationsContainer.innerHTML = recommendationsHTML;
        elements.recommendationsDiv.style.display = 'block';
        
        // Add interactivity to recommendation cards
        addRecommendationInteractivity();
    }

    function generateRecommendationCard(risk) {
        const recommendation = RECOMMENDATIONS_DB[risk.id];
        if (!recommendation) return '';

        const riskInfo = RISK_LEVELS[risk.priority];
        
        return `
            <div class="recommendation-card priority-${risk.priority}" data-question-id="${risk.id}">
                <div class="recommendation-header">
                    <div class="recommendation-title">
                        <h5>${recommendation.title}</h5>
                        <span class="priority-badge" style="background-color: ${riskInfo.color}">
                            ${riskInfo.name}
                        </span>
                    </div>
                    <div class="recommendation-meta">
                        <span class="impact">Impact: ${recommendation.impact}</span>
                        <span class="effort">Effort: ${recommendation.effort}</span>
                        <span class="points">+${risk.points} pts</span>
                    </div>
                </div>
                <div class="recommendation-body">
                    <p class="recommendation-description">${recommendation.description}</p>
                    <div class="recommendation-steps">
                        <strong>Quick Steps:</strong>
                        <ol>
                            ${recommendation.steps.slice(0, 3).map(step => `<li>${step}</li>`).join('')}
                        </ol>
                    </div>
                    ${recommendation.timeToComplete ? `<div class="time-estimate">⏱️ Estimated time: ${recommendation.timeToComplete}</div>` : ''}
                </div>
                <div class="recommendation-actions">
                    <button class="btn btn-small btn-primary mark-completed">Mark as Completed</button>
                    <button class="btn btn-small btn-secondary show-details">Show Full Guide</button>
                </div>
            </div>
        `;
    }

    function generateAdvancedInsights(assessment) {
        const insights = [];
        
        // Category analysis
        const weakestCategory = Object.keys(assessment.categories).reduce((a, b) => 
            (assessment.categories[a].score / assessment.categories[a].maxScore) < 
            (assessment.categories[b].score / assessment.categories[b].maxScore) ? a : b
        );
        
        const strongestCategory = Object.keys(assessment.categories).reduce((a, b) => 
            (assessment.categories[a].score / assessment.categories[a].maxScore) > 
            (assessment.categories[b].score / assessment.categories[b].maxScore) ? a : b
        );

        insights.push(`Your strongest area is <strong>${PRIVACY_CATEGORIES[strongestCategory].name}</strong>, while <strong>${PRIVACY_CATEGORIES[weakestCategory].name}</strong> needs the most attention.`);

        // Critical actions needed
        const criticalActions = assessment.riskAreas.filter(risk => risk.priority === 'critical').length;
        if (criticalActions > 0) {
            insights.push(`You have <strong>${criticalActions} critical security gap${criticalActions > 1 ? 's' : ''}</strong> that should be addressed immediately.`);
        }

        // Completion rate insight
        if (assessment.completionRate < 50) {
            insights.push('Consider implementing at least 50% of these privacy measures for a solid foundation.');
        } else if (assessment.completionRate > 80) {
            insights.push('Excellent privacy awareness! You\'re implementing most recommended practices.');
        }

        return `
            <div class="advanced-insights">
                <h4>🔍 Personalized Insights</h4>
                <div class="insights-list">
                    ${insights.map(insight => `<div class="insight-item">💡 ${insight}</div>`).join('')}
                </div>
            </div>
        `;
    }

    function addRecommendationInteractivity() {
        // Mark as completed buttons
        document.querySelectorAll('.mark-completed').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.recommendation-card');
                const questionId = card.dataset.questionId;
                markRecommendationCompleted(questionId, card);
            });
        });

        // Show details buttons
        document.querySelectorAll('.show-details').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.recommendation-card');
                const questionId = card.dataset.questionId;
                showDetailedGuide(questionId);
            });
        });
    }

    function markRecommendationCompleted(questionId, card) {
        const checkbox = document.getElementById(questionId);
        if (checkbox) {
            checkbox.checked = true;
            card.classList.add('completed');
            
            // Recalculate score
            setTimeout(() => {
                calculatePrivacyScore();
                showSuccess('Great! Your privacy score has been updated.');
            }, 500);
        }
    }

    function showDetailedGuide(questionId) {
        const recommendation = RECOMMENDATIONS_DB[questionId];
        if (!recommendation) return;

        // Create modal or detailed view
        const modal = createDetailedGuideModal(recommendation);
        document.body.appendChild(modal);
        
        // Show modal
        setTimeout(() => modal.classList.add('show'), 10);
    }

    function createDetailedGuideModal(recommendation) {
        const modal = document.createElement('div');
        modal.className = 'detailed-guide-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${recommendation.title}</h3>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <p><strong>Description:</strong> ${recommendation.description}</p>
                        <div class="guide-meta">
                            <span><strong>Impact:</strong> ${recommendation.impact}</span>
                            <span><strong>Effort:</strong> ${recommendation.effort}</span>
                            ${recommendation.timeToComplete ? `<span><strong>Time:</strong> ${recommendation.timeToComplete}</span>` : ''}
                        </div>
                        <div class="detailed-steps">
                            <h4>Step-by-Step Guide:</h4>
                            <ol>
                                ${recommendation.steps.map(step => `<li>${step}</li>`).join('')}
                            </ol>
                        </div>
                        ${recommendation.benefits ? `
                            <div class="benefits-section">
                                <h4>Benefits:</h4>
                                <ul>
                                    ${recommendation.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                                </ul>
                            </div>
                        ` : ''}
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary close-modal">Got it!</button>
                    </div>
                </div>
            </div>
        `;

        // Add close functionality
        modal.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                modal.classList.remove('show');
                setTimeout(() => modal.remove(), 300);
            });
        });

        return modal;
    }

    function getGradeAdvice(grade) {
        const advice = {
            'A+': 'You have excellent privacy protection! Consider helping others improve their privacy.',
            'A': 'Very good privacy protection. A few minor improvements could make you even more secure.',
            'B+': 'Good privacy foundation. Focus on the critical recommendations to reach the next level.',
            'B': 'Decent privacy protection, but there\'s room for improvement in key areas.',
            'C+': 'Fair privacy protection. Implementing high-priority recommendations will significantly improve your security.',
            'C': 'Your privacy needs attention. Start with critical security measures immediately.',
            'D': 'Poor privacy protection puts you at significant risk. Immediate action required.',
            'F': 'Critical privacy risk! Please implement basic security measures as soon as possible.'
        };
        return advice[grade] || advice['F'];
    }

    function animateScoreReveal(score) {
        const scoreElement = elements.scoreValue;
        let currentScore = 0;
        const increment = score / 30;
        
        const animation = setInterval(() => {
            currentScore += increment;
            if (currentScore >= score) {
                currentScore = score;
                clearInterval(animation);
            }
            scoreElement.textContent = Math.round(currentScore);
        }, 50);
    }

    function animateScoreIncrease(item) {
        item.style.transform = 'scale(1.05)';
        item.style.backgroundColor = '#f0fdf4';
        setTimeout(() => {
            item.style.transform = 'scale(1)';
            item.style.backgroundColor = '';
        }, 300);
    }

    function animateScoreDecrease(item) {
        item.style.transform = 'scale(0.95)';
        item.style.backgroundColor = '#fef2f2';
        setTimeout(() => {
            item.style.transform = 'scale(1)';
            item.style.backgroundColor = '';
        }, 300);
    }

    function getScoreColor(percentage) {
        if (percentage >= 90) return '#059669';
        if (percentage >= 80) return '#0891b2';
        if (percentage >= 70) return '#0284c7';
        if (percentage >= 60) return '#7c3aed';
        if (percentage >= 50) return '#d97706';
        if (percentage >= 40) return '#ea580c';
        return '#dc2626';
    }

    function findQuestionData(questionId) {
        for (const categoryKey of Object.keys(PRIVACY_CATEGORIES)) {
            const category = PRIVACY_CATEGORIES[categoryKey];
            if (category.questions[questionId]) {
                return category.questions[questionId];
            }
        }
        return null;
    }

    function trackAssessmentCompletion(assessment) {
        // Analytics tracking (if implemented)
        console.log('Privacy Assessment Completed:', {
            score: assessment.totalScore,
            grade: assessment.grade.grade,
            completionRate: assessment.completionRate,
            riskLevel: assessment.riskLevel,
            timestamp: assessment.timestamp
        });
        
        // Store assessment history in localStorage for progress tracking
        try {
            const history = JSON.parse(localStorage.getItem('privacy_assessments') || '[]');
            history.push({
                score: assessment.totalScore,
                grade: assessment.grade.grade,
                date: assessment.timestamp.toISOString().split('T')[0],
                riskAreas: assessment.riskAreas.length
            });
            
            // Keep only last 10 assessments
            const recentHistory = history.slice(-10);
            localStorage.setItem('privacy_assessments', JSON.stringify(recentHistory));
            
            // Show progress if there's improvement
            if (history.length > 1) {
                const previousScore = history[history.length - 2].score;
                if (assessment.totalScore > previousScore) {
                    const improvement = assessment.totalScore - previousScore;
                    showSuccess(`Great progress! Your score improved by ${improvement} points since your last assessment.`);
                }
            }
        } catch (e) {
            console.log('Could not save assessment history:', e);
        }
    }

    function exportAssessmentReport() {
        if (!currentAssessment) {
            showError('No assessment data to export');
            return;
        }

        const report = generateAssessmentReport(currentAssessment);
        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `privacy-assessment-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showSuccess('Assessment report downloaded successfully');
    }

    function generateAssessmentReport(assessment) {
        const date = new Date().toLocaleDateString();
        
        let report = `
PRIVACY ASSESSMENT REPORT
Generated on: ${date}
==================================================

OVERALL SCORE: ${assessment.totalScore}/100 (Grade: ${assessment.grade.grade})
${assessment.grade.description}

CATEGORY BREAKDOWN:
--------------------------------------------------
Social Media Privacy: ${assessment.categories.social.score}/${assessment.categories.social.maxScore} points
Account Security: ${assessment.categories.security.score}/${assessment.categories.security.maxScore} points
Browsing & Communication: ${assessment.categories.browsing.score}/${assessment.categories.browsing.maxScore} points

COMPLETION RATE: ${Math.round(assessment.completionRate)}%
RISK LEVEL: ${assessment.riskLevel.toUpperCase()}

PRIORITY RECOMMENDATIONS:
--------------------------------------------------
`;

        const prioritizedRisks = assessment.riskAreas
            .sort((a, b) => {
                const priorityOrder = { critical: 1, high: 2, medium: 3, low: 4 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            })
            .slice(0, 5);

        prioritizedRisks.forEach((risk, index) => {
            const recommendation = RECOMMENDATIONS_DB[risk.id];
            if (recommendation) {
                report += `
${index + 1}. ${recommendation.title} (${risk.priority.toUpperCase()} PRIORITY)
   ${recommendation.description}
   Estimated time: ${recommendation.timeToComplete || 'Varies'}
   Impact: ${recommendation.impact} | Effort: ${recommendation.effort}
`;
            }
        });

        if (assessment.strengths.length > 0) {
            report += `

CURRENT STRENGTHS:
--------------------------------------------------
`;
            assessment.strengths.forEach(strength => {
                report += `✓ ${strength.text} (+${strength.points} points)\n`;
            });
        }

        report += `

NEXT STEPS:
--------------------------------------------------
1. Focus on ${prioritizedRisks.length > 0 ? 'critical and high priority' : 'remaining'} recommendations first
2. Implement changes gradually over the next 2-4 weeks
3. Retake this assessment to track your progress
4. Consider advanced privacy tools as you become more comfortable

For detailed implementation guides, visit: [Your Website URL]/guides

==================================================
This report was generated by PrivateToolkit Privacy Score Calculator
`;

        return report;
    }

    function showProgressChart() {
        try {
            const history = JSON.parse(localStorage.getItem('privacy_assessments') || '[]');
            if (history.length < 2) {
                showError('Not enough assessment history to show progress');
                return;
            }

            const chartModal = createProgressChartModal(history);
            document.body.appendChild(chartModal);
            setTimeout(() => chartModal.classList.add('show'), 10);
        } catch (e) {
            showError('Could not load assessment history');
        }
    }

    function createProgressChartModal(history) {
        const modal = document.createElement('div');
        modal.className = 'progress-chart-modal';
        
        const chartData = history.map(assessment => ({
            date: new Date(assessment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            score: assessment.score,
            grade: assessment.grade
        }));

        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Your Privacy Progress</h3>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="progress-chart">
                            <svg viewBox="0 0 400 200" class="chart-svg">
                                ${generateChartSVG(chartData)}
                            </svg>
                        </div>
                        <div class="progress-stats">
                            <div class="stat-item">
                                <span class="stat-value">${history[history.length - 1].score - history[0].score}</span>
                                <span class="stat-label">Point Improvement</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-value">${history.length}</span>
                                <span class="stat-label">Assessments</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-value">${history[history.length - 1].grade}</span>
                                <span class="stat-label">Current Grade</span>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary export-report">Export Report</button>
                        <button class="btn btn-primary close-modal">Close</button>
                    </div>
                </div>
            </div>
        `;

        // Add functionality
        modal.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                modal.classList.remove('show');
                setTimeout(() => modal.remove(), 300);
            });
        });

        modal.querySelector('.export-report').addEventListener('click', () => {
            exportAssessmentReport();
        });

        return modal;
    }

    function generateChartSVG(data) {
        const maxScore = 100;
        const chartWidth = 360;
        const chartHeight = 150;
        const padding = 20;
        
        let svg = '';
        
        // Grid lines
        for (let i = 0; i <= 10; i++) {
            const y = padding + (i * (chartHeight - 2 * padding) / 10);
            svg += `<line x1="${padding}" y1="${y}" x2="${chartWidth + padding}" y2="${y}" stroke="#e5e7eb" stroke-width="1"/>`;
        }
        
        // Data line
        let pathData = '';
        data.forEach((point, index) => {
            const x = padding + (index * (chartWidth - 2 * padding) / (data.length - 1));
            const y = chartHeight - padding - ((point.score / maxScore) * (chartHeight - 2 * padding));
            
            if (index === 0) {
                pathData += `M ${x} ${y}`;
            } else {
                pathData += ` L ${x} ${y}`;
            }
            
            // Data points
            svg += `<circle cx="${x}" cy="${y}" r="4" fill="#3b82f6"/>`;
            svg += `<text x="${x}" y="${chartHeight - 5}" text-anchor="middle" font-size="10" fill="#666">${point.date}</text>`;
        });
        
        svg += `<path d="${pathData}" stroke="#3b82f6" stroke-width="2" fill="none"/>`;
        
        // Y-axis labels
        for (let i = 0; i <= 10; i++) {
            const y = padding + (i * (chartHeight - 2 * padding) / 10);
            const score = Math.round((10 - i) * 10);
            svg += `<text x="10" y="${y + 4}" font-size="10" fill="#666">${score}</text>`;
        }
        
        return svg;
    }

    function showError(message) {
        console.error(message);
        if (typeof showNotification === 'function') {
            showNotification(message, 'error');
        } else {
            alert(message);
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
    window.PrivacyScoreCalculator = {
        calculatePrivacyScore,
        exportAssessmentReport,
        showProgressChart,
        PRIVACY_CATEGORIES,
        RECOMMENDATIONS_DB
    };

})();