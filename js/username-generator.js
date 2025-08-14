// Username Generator Tool - VersiÃ³n Plus Mejorada
class UsernameGenerator {
    constructor() {
        this.wordLists = this.initializeWordLists();
        this.init();
    }

    initializeWordLists() {
        return {
            adjectives: {
                general: ['Cool', 'Smart', 'Quick', 'Bright', 'Swift', 'Bold', 'Calm', 'Dark', 'Fast', 'Wild', 'Blue', 'Red', 'Gold', 'Wise', 'Keen', 'Pure', 'True', 'Free', 'Nice', 'Kind', 'Strong', 'Smooth', 'Sharp', 'Sleek', 'Solid', 'Stable', 'Super', 'Unique', 'Vivid', 'Warm', 'Young', 'Zesty', 'Active', 'Alert', 'Alive', 'Amazing', 'Awesome', 'Basic', 'Brave', 'Brief', 'Broad', 'Clean', 'Clear', 'Clever', 'Close', 'Cold', 'Crisp', 'Deep', 'Dense', 'Easy', 'Epic', 'Even', 'Exact', 'Fair', 'Fine', 'Firm', 'Fresh', 'Full', 'Great', 'Happy', 'Hard', 'Heavy', 'High', 'Hot', 'Huge'],
                tech: ['Digital', 'Cyber', 'Tech', 'Code', 'Data', 'Web', 'Net', 'Pixel', 'Byte', 'Logic', 'Smart', 'Auto', 'Meta', 'Nano', 'Ultra', 'Binary', 'Circuit', 'Cloud', 'Crypto', 'Database', 'Electric', 'Fiber', 'Grid', 'Hardware', 'Interface', 'Java', 'Kernel', 'Linux', 'Mobile', 'Network', 'Online', 'Protocol', 'Query', 'Robot', 'Server', 'Terminal', 'Unix', 'Virtual', 'Wireless', 'Xml', 'Zero', 'Alpha', 'Beta', 'Cache', 'Debug'],
                nature: ['Green', 'Ocean', 'Forest', 'River', 'Mountain', 'Sky', 'Cloud', 'Storm', 'Rain', 'Snow', 'Wind', 'Earth', 'Stone', 'Solar', 'Lunar', 'Arctic', 'Blossom', 'Coral', 'Desert', 'Evergreen', 'Frost', 'Garden', 'Horizon', 'Ice', 'Jungle', 'Kelp', 'Leaf', 'Marine', 'Natural', 'Organic', 'Prairie', 'Quartz', 'Root', 'Seasonal', 'Tropical', 'Urban', 'Valley', 'Wild', 'Xerophyte', 'Yellow', 'Zen', 'Alpine', 'Beach', 'Canyon'],
                fantasy: ['Magic', 'Mystic', 'Ancient', 'Divine', 'Sacred', 'Royal', 'Noble', 'Cosmic', 'Ethereal', 'Stellar', 'Crystal', 'Silver', 'Golden', 'Shadow', 'Light', 'Arcane', 'Blessed', 'Celestial', 'Dragon', 'Enchanted', 'Fairy', 'Ghost', 'Heroic', 'Immortal', 'Jade', 'Knight', 'Legendary', 'Mythical', 'Necro', 'Oracle', 'Phoenix', 'Quest', 'Rune', 'Spell', 'Titan', 'Unicorn', 'Void', 'Wizard', 'Xenial', 'Yin', 'Zodiac', 'Astral', 'Banshee', 'Crown'],
                modern: ['Urban', 'Neon', 'Electric', 'Atomic', 'Quantum', 'Fusion', 'Matrix', 'Vector', 'Prime', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Omega', 'Apex', 'Blockchain', 'Contemporary', 'Dynamic', 'Edge', 'Future', 'Global', 'Hybrid', 'Innovation', 'Jazz', 'Kinetic', 'Laser', 'Modern', 'Next', 'Optic', 'Progressive', 'Quick', 'Radical', 'Sync', 'Turbo', 'Ultimate', 'Vibe', 'Wave', 'Xenon', 'Youth', 'Zero', 'Abstract', 'Bold', 'Chrome'],
                creative: ['Artistic', 'Creative', 'Vivid', 'Bright', 'Colorful', 'Vibrant', 'Dynamic', 'Fluid', 'Smooth', 'Sharp', 'Bold', 'Soft', 'Gentle', 'Fierce', 'Calm', 'Abstract', 'Beautiful', 'Crafty', 'Detailed', 'Elegant', 'Fancy', 'Graphic', 'Handmade', 'Inspired', 'Jazzy', 'Kinky', 'Lovely', 'Masterful', 'Novel', 'Original', 'Painted', 'Quirky', 'Refined', 'Stylish', 'Textured', 'Unique', 'Visual', 'Whimsical', 'Xtreme', 'Youthful', 'Zany', 'Ambient', 'Balanced', 'Curated'],
                professional: ['Executive', 'Corporate', 'Business', 'Global', 'Strategic', 'Premium', 'Elite', 'Expert', 'Master', 'Senior', 'Chief', 'Lead', 'Prime', 'Core', 'Key', 'Advanced', 'Board', 'Commercial', 'Director', 'Efficient', 'Formal', 'Growth', 'High', 'Industry', 'Junior', 'Knowledge', 'Leader', 'Management', 'Network', 'Official', 'Process', 'Quality', 'Robust', 'Standard', 'Total', 'Ultimate', 'Value', 'World', 'Excellence', 'Year', 'Zone', 'Approved', 'Best', 'Certified']
            },
            nouns: {
                animals: ['Tiger', 'Eagle', 'Wolf', 'Lion', 'Bear', 'Fox', 'Hawk', 'Shark', 'Panther', 'Falcon', 'Raven', 'Phoenix', 'Dragon', 'Cobra', 'Lynx', 'Alpaca', 'Badger', 'Cheetah', 'Dolphin', 'Elephant', 'Flamingo', 'Giraffe', 'Horse', 'Iguana', 'Jaguar', 'Kangaroo', 'Leopard', 'Mongoose', 'Narwhal', 'Octopus', 'Penguin', 'Quail', 'Rhino', 'Salamander', 'Turtle', 'Unicorn', 'Vulture', 'Whale', 'Xerus', 'Yak', 'Zebra', 'Antelope', 'Bison', 'Camel'],
                objects: ['Star', 'Moon', 'Sun', 'Fire', 'Wind', 'Storm', 'Thunder', 'Lightning', 'Flame', 'Spark', 'Blade', 'Shield', 'Crown', 'Gem', 'Crystal', 'Arrow', 'Bolt', 'Comet', 'Diamond', 'Emerald', 'Flare', 'Globe', 'Hammer', 'Ice', 'Jewel', 'Key', 'Lance', 'Mirror', 'Nova', 'Orb', 'Pearl', 'Quiver', 'Ring', 'Sword', 'Torch', 'Universe', 'Vortex', 'Wand', 'Xenon', 'Yarn', 'Zephyr', 'Anchor', 'Bell', 'Cannon'],
                tech: ['Code', 'Data', 'Pixel', 'Byte', 'Logic', 'System', 'Network', 'Server', 'Cloud', 'Stream', 'Link', 'Node', 'Core', 'Hub', 'Port', 'Algorithm', 'Backend', 'Cache', 'Database', 'Engine', 'Framework', 'Gateway', 'Hardware', 'Interface', 'Java', 'Kernel', 'Library', 'Module', 'Nginx', 'Object', 'Protocol', 'Queue', 'Runtime', 'Service', 'Terminal', 'Unity', 'Version', 'Widget', 'Xml', 'Yaml', 'Zone', 'Api', 'Boot', 'Compiler'],
                nature: ['Ocean', 'River', 'Mountain', 'Forest', 'Valley', 'Peak', 'Hill', 'Lake', 'Beach', 'Island', 'Desert', 'Glacier', 'Canyon', 'Meadow', 'Grove', 'Arctic', 'Bamboo', 'Coral', 'Dune', 'Evergreen', 'Field', 'Garden', 'Harbor', 'Ivy', 'Jungle', 'Kelp', 'Lagoon', 'Marsh', 'Oasis', 'Plains', 'Quarry', 'Ridge', 'Savanna', 'Tundra', 'Upland', 'Volcano', 'Wetland', 'Xylem', 'Yard', 'Zone', 'Atoll', 'Basin', 'Creek'],
                gaming: ['Player', 'Gamer', 'Hunter', 'Warrior', 'Legend', 'Hero', 'Champion', 'Master', 'Knight', 'Assassin', 'Ranger', 'Mage', 'Scout', 'Guardian', 'Slayer', 'Archer', 'Berserker', 'Crusader', 'Defender', 'Elite', 'Fighter', 'Gladiator', 'Hybrid', 'Infiltrator', 'Juggernaut', 'Killer', 'Lancer', 'Marksman', 'Ninja', 'Operative', 'Paladin', 'Quest', 'Raider', 'Sniper', 'Tactician', 'Unit', 'Veteran', 'Warden', 'Xenomorph', 'Yeoman', 'Zealot', 'Agent', 'Blade', 'Commander'],
                abstract: ['Dream', 'Vision', 'Hope', 'Quest', 'Journey', 'Path', 'Destiny', 'Future', 'Spirit', 'Soul', 'Mind', 'Heart', 'Will', 'Force', 'Energy', 'Ambition', 'Belief', 'Concept', 'Desire', 'Echo', 'Faith', 'Glory', 'Honor', 'Idea', 'Justice', 'Knowledge', 'Love', 'Memory', 'Notion', 'Oath', 'Purpose', 'Quality', 'Reason', 'Sense', 'Truth', 'Unity', 'Value', 'Wisdom', 'Xtasy', 'Yearning', 'Zeal', 'Aspect', 'Balance', 'Clarity']
            },
            verbs: ['Create', 'Build', 'Make', 'Code', 'Design', 'Craft', 'Shape', 'Form', 'Write', 'Draw', 'Paint', 'Play', 'Run', 'Jump', 'Fly', 'Achieve', 'Boost', 'Climb', 'Dance', 'Earn', 'Fight', 'Grow', 'Hunt', 'Inspire', 'Join', 'Keep', 'Launch', 'Move', 'Navigate', 'Open', 'Push', 'Quest', 'Race', 'Strike', 'Train', 'Unite', 'Venture', 'Win', 'Xerox', 'Yield', 'Zoom', 'Adapt', 'Bounce', 'Capture', 'Develop'],
            professions: ['Developer', 'Designer', 'Artist', 'Writer', 'Creator', 'Builder', 'Maker', 'Coder', 'Hacker', 'Geek', 'Ninja', 'Guru', 'Expert', 'Pro', 'Ace', 'Analyst', 'Brand', 'Consultant', 'Director', 'Engineer', 'Freelancer', 'Graphic', 'Handler', 'Innovator', 'Judge', 'Knowledge', 'Leader', 'Manager', 'Operator', 'Producer', 'Quality', 'Researcher', 'Specialist', 'Technician', 'User', 'Validator', 'Worker', 'Xpert', 'Younger', 'Zone', 'Admin', 'Boss', 'Chief', 'Developer'],
            firstName: ['Alex', 'Jordan', 'Taylor', 'Casey', 'Morgan', 'Riley', 'Cameron', 'Drew', 'Sage', 'Quinn', 'Avery', 'Blake', 'Charlie', 'Dana', 'Emery', 'Finley', 'Gray', 'Hayden', 'Indigo', 'Jamie', 'Austin', 'Brooklyn', 'Carson', 'Dallas', 'Eden', 'Frankie', 'Genesis', 'Harper', 'Iris', 'Jessie', 'Kendall', 'Logan', 'Marley', 'Nova', 'Ocean', 'Parker', 'River', 'Skyler', 'Trinity', 'Unity', 'Vale', 'Winter', 'Zion', 'Angel', 'Bay', 'Cedar', 'Devon', 'Ellis', 'Flynn', 'Hunter', 'Jaden', 'Kai', 'Lane', 'Max', 'Nico', 'Onyx', 'Phoenix', 'Rowan', 'Storm', 'True'],
            lastName: ['Smith', 'Johnson', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez', 'Adams', 'Baker', 'Collins', 'Edwards', 'Evans', 'Foster', 'Green', 'Hall', 'Howard', 'Jenkins', 'King', 'Lee', 'Morgan', 'Nelson', 'Parker', 'Reed', 'Scott', 'Turner', 'Walker', 'Young', 'Allen', 'Bell', 'Campbell', 'Cooper', 'Cruz', 'Flores', 'Gray', 'Hayes', 'Hill', 'Hughes', 'James', 'Kelly', 'Lewis', 'Long', 'Mitchell', 'Murphy', 'Phillips', 'Powell', 'Price', 'Richardson']
        };
    }

    init() {
        this.bindEvents();
        this.updateLengthDisplay();
    }

    bindEvents() {
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

    getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    addNumbersToUsername(username, maxLength, maxNumbers = 4) {
        if (username.length >= maxLength) return username;
        
        const availableSpace = maxLength - username.length;
        const numbersToAdd = Math.min(maxNumbers, availableSpace, Math.floor(Math.random() * 3) + 1);
        
        for (let i = 0; i < numbersToAdd && username.length < maxLength; i++) {
            username += Math.floor(Math.random() * 10);
        }
        
        return username;
    }

    addSymbolsToUsername(username, maxLength, includeNumbers = false) {
        if (username.length >= maxLength) return username;
        
        const symbols = ['.', '-'];
        const symbol = this.getRandomElement(symbols);
        
        if (username.length + 1 <= maxLength) {
            if (Math.random() < 0.7) { // 70% probabilidad de agregar sÃ­mbolo
                username += symbol;
            }
        }
        
        return username;
    }

    adjustUsernameLength(username, targetLength, options) {
        if (username.length > targetLength) {
            return username.substring(0, targetLength);
        }
        
        if (username.length < targetLength) {
            const remainingSpace = targetLength - username.length;
            
            // Priorizar palabras sobre nÃºmeros/sÃ­mbolos
            if (remainingSpace >= 3) {
                const fillers = ['dev', 'pro', 'user', 'the', 'one', 'top', 'max', 'new', 'web', 'app'];
                const filler = this.getRandomElement(fillers);
                if (username.length + filler.length <= targetLength) {
                    username += filler;
                }
            }
            
            // Si aÃºn necesitamos mÃ¡s caracteres, agregar nÃºmeros (mÃ¡ximo 4)
            if (options.includeNumbers && username.length < targetLength) {
                username = this.addNumbersToUsername(username, targetLength, 4);
            }
            
            // Si aÃºn falta espacio, completar con letras
            while (username.length < targetLength) {
                const chars = 'abcdefghijklmnopqrstuvwxyz';
                username += chars.charAt(Math.floor(Math.random() * chars.length));
            }
        }
        
        return username;
    }

    // Estilo 1: Random Characters
    generateRandomCharacters(options) {
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        const symbols = '.-';

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

    // Estilo 2: Readable (Adjective + Noun)
    generateReadableUsername(options) {
        const adjective = this.getRandomElement(this.wordLists.adjectives.general);
        const noun = this.getRandomElement(this.wordLists.nouns.animals);

        let username = adjective + noun;

        if (!options.includeUppercase) {
            username = username.toLowerCase();
        }

        if (options.includeSymbols) {
            username = this.addSymbolsToUsername(username, options.length);
        }

        if (options.includeNumbers) {
            username = this.addNumbersToUsername(username, options.length);
        }

        return this.adjustUsernameLength(username, options.length, options);
    }

    // Estilo 3: Gaming
    generateGamingUsername(options) {
        const prefixes = ['Shadow', 'Dark', 'Pro', 'Elite', 'Master', 'Ninja', 'Cyber', 'Neon', 'Storm', 'Blaze'];
        const suffixes = this.wordLists.nouns.gaming;

        let username = this.getRandomElement(prefixes) + this.getRandomElement(suffixes);

        if (!options.includeUppercase) {
            username = username.toLowerCase();
        }

        if (options.includeSymbols) {
            username = this.addSymbolsToUsername(username, options.length);
        }

        if (options.includeNumbers) {
            username = this.addNumbersToUsername(username, options.length, 3);
        }

        return this.adjustUsernameLength(username, options.length, options);
    }

    // Estilo 4: Professional
    generateProfessionalUsername(options) {
        const firstName = this.getRandomElement(this.wordLists.firstName);
        const lastName = this.getRandomElement(this.wordLists.lastName);

        let username = firstName + lastName;

        if (options.includeUppercase) {
            username = username.charAt(0).toUpperCase() + username.slice(1);
        } else {
            username = username.toLowerCase();
        }

        if (options.includeSymbols) {
            username = this.addSymbolsToUsername(username, options.length);
        }

        if (options.includeNumbers) {
            username = this.addNumbersToUsername(username, options.length, 2);
        }

        return this.adjustUsernameLength(username, options.length, options);
    }

    // Estilo 5: Tech Style
    generateTechUsername(options) {
        const techAdj = this.getRandomElement(this.wordLists.adjectives.tech);
        const techNoun = this.getRandomElement(this.wordLists.nouns.tech);

        let username = techAdj + techNoun;

        if (!options.includeUppercase) {
            username = username.toLowerCase();
        }

        if (options.includeSymbols) {
            username = this.addSymbolsToUsername(username, options.length);
        }

        if (options.includeNumbers) {
            username = this.addNumbersToUsername(username, options.length, 3);
        }

        return this.adjustUsernameLength(username, options.length, options);
    }

    // Estilo 6: Nature Inspired
    generateNatureUsername(options) {
        const natureAdj = this.getRandomElement(this.wordLists.adjectives.nature);
        const natureNoun = this.getRandomElement(this.wordLists.nouns.nature);

        let username = natureAdj + natureNoun;

        if (!options.includeUppercase) {
            username = username.toLowerCase();
        }

        if (options.includeSymbols) {
            username = this.addSymbolsToUsername(username, options.length);
        }

        if (options.includeNumbers) {
            username = this.addNumbersToUsername(username, options.length, 2);
        }

        return this.adjustUsernameLength(username, options.length, options);
    }

    // Estilo 7: Fantasy Style
    generateFantasyUsername(options) {
        const fantasyAdj = this.getRandomElement(this.wordLists.adjectives.fantasy);
        const fantasyNoun = this.getRandomElement(this.wordLists.nouns.objects);

        let username = fantasyAdj + fantasyNoun;

        if (!options.includeUppercase) {
            username = username.toLowerCase();
        }

        if (options.includeSymbols) {
            username = this.addSymbolsToUsername(username, options.length);
        }

        if (options.includeNumbers) {
            username = this.addNumbersToUsername(username, options.length, 2);
        }

        return this.adjustUsernameLength(username, options.length, options);
    }

    // Estilo 8: Modern Style
    generateModernUsername(options) {
        const modernAdj = this.getRandomElement(this.wordLists.adjectives.modern);
        const verb = this.getRandomElement(this.wordLists.verbs);

        let username = modernAdj + verb;

        if (!options.includeUppercase) {
            username = username.toLowerCase();
        }

        if (options.includeSymbols) {
            username = this.addSymbolsToUsername(username, options.length);
        }

        if (options.includeNumbers) {
            username = this.addNumbersToUsername(username, options.length, 3);
        }

        return this.adjustUsernameLength(username, options.length, options);
    }

    // Estilo 9: Creative Artist
    generateCreativeUsername(options) {
        const creativeAdj = this.getRandomElement(this.wordLists.adjectives.creative);
        const profession = this.getRandomElement(this.wordLists.professions);

        let username = creativeAdj + profession;

        if (!options.includeUppercase) {
            username = username.toLowerCase();
        }

        if (options.includeSymbols) {
            username = this.addSymbolsToUsername(username, options.length);
        }

        if (options.includeNumbers) {
            username = this.addNumbersToUsername(username, options.length, 2);
        }

        return this.adjustUsernameLength(username, options.length, options);
    }

    // Estilo 10: Minimalist
    generateMinimalistUsername(options) {
        const shortWords = ['zen', 'art', 'ink', 'dot', 'web', 'app', 'dev', 'pro', 'one', 'top', 'new', 'max', 'min', 'now', 'sky'];
        const word1 = this.getRandomElement(shortWords);
        const word2 = this.getRandomElement(shortWords);

        let username = word1 + word2;

        if (options.includeUppercase) {
            username = username.charAt(0).toUpperCase() + username.slice(1);
        }

        if (options.includeSymbols) {
            username = this.addSymbolsToUsername(username, options.length);
        }

        if (options.includeNumbers) {
            username = this.addNumbersToUsername(username, options.length, 4);
        }

        return this.adjustUsernameLength(username, options.length, options);
    }

    // Estilo 11: Verb + Noun
    generateVerbNounUsername(options) {
        const verb = this.getRandomElement(this.wordLists.verbs);
        const noun = this.getRandomElement(this.wordLists.nouns.objects);

        let username = verb + noun;

        if (!options.includeUppercase) {
            username = username.toLowerCase();
        }

        if (options.includeSymbols) {
            username = this.addSymbolsToUsername(username, options.length);
        }

        if (options.includeNumbers) {
            username = this.addNumbersToUsername(username, options.length, 3);
        }

        return this.adjustUsernameLength(username, options.length, options);
    }

    // Estilo 12: Double Adjective
    generateDoubleAdjectiveUsername(options) {
        const adj1 = this.getRandomElement(this.wordLists.adjectives.general);
        const adj2 = this.getRandomElement(this.wordLists.adjectives.modern);

        let username = adj1 + adj2;

        if (!options.includeUppercase) {
            username = username.toLowerCase();
        }

        if (options.includeSymbols) {
            username = this.addSymbolsToUsername(username, options.length);
        }

        if (options.includeNumbers) {
            username = this.addNumbersToUsername(username, options.length, 2);
        }

        return this.adjustUsernameLength(username, options.length, options);
    }

    // Estilo 13: Corporate Style
    generateCorporateUsername(options) {
        const corpAdj = this.getRandomElement(this.wordLists.adjectives.professional);
        const firstName = this.getRandomElement(this.wordLists.firstName);

        let username = corpAdj + firstName;

        if (options.includeUppercase) {
            username = username.charAt(0).toUpperCase() + username.slice(1);
        } else {
            username = username.toLowerCase();
        }

        if (options.includeSymbols) {
            username = this.addSymbolsToUsername(username, options.length);
        }

        if (options.includeNumbers) {
            username = this.addNumbersToUsername(username, options.length, 2);
        }

        return this.adjustUsernameLength(username, options.length, options);
    }

    // Estilo 14: Animal + Action
    generateAnimalActionUsername(options) {
        const animal = this.getRandomElement(this.wordLists.nouns.animals);
        const verb = this.getRandomElement(this.wordLists.verbs);

        let username = animal + verb;

        if (!options.includeUppercase) {
            username = username.toLowerCase();
        }

        if (options.includeSymbols) {
            username = this.addSymbolsToUsername(username, options.length);
        }

        if (options.includeNumbers) {
            username = this.addNumbersToUsername(username, options.length, 3);
        }

        return this.adjustUsernameLength(username, options.length, options);
    }

    // Estilo 15: Abstract Concept
    generateAbstractUsername(options) {
        const abstract = this.getRandomElement(this.wordLists.nouns.abstract);
        const adj = this.getRandomElement(this.wordLists.adjectives.general);

        let username = abstract + adj;

        if (!options.includeUppercase) {
            username = username.toLowerCase();
        }

        if (options.includeSymbols) {
            username = this.addSymbolsToUsername(username, options.length);
        }

        if (options.includeNumbers) {
            username = this.addNumbersToUsername(username, options.length, 2);
        }

        return this.adjustUsernameLength(username, options.length, options);
    }

    // Estilo 16: Three Word Combo
    generateThreeWordUsername(options) {
        const shortAdj = ['new', 'old', 'big', 'top', 'pro', 'max', 'red', 'hot', 'ice', 'web', 'raw', 'dry', 'low', 'fun', 'odd', 'shy', 'fat', 'sad', 'mad', 'bad', 'far', 'car', 'bar', 'war', 'tax', 'wax', 'box', 'fox', 'six', 'mix'];
        const shortNoun = ['app', 'dev', 'art', 'web', 'net', 'bot', 'fox', 'cat', 'dog', 'bee', 'box', 'car', 'bar', 'jar', 'tar', 'war', 'day', 'way', 'bay', 'ray', 'say', 'pay', 'may', 'key', 'eye', 'sky', 'fly', 'try', 'dry', 'buy'];
        const shortVerb = ['run', 'fly', 'win', 'try', 'use', 'get', 'set', 'fix', 'mix', 'add', 'cut', 'hit', 'sit', 'fit', 'put', 'eat', 'see', 'buy', 'pay', 'say', 'lay', 'may', 'way', 'day', 'play', 'stay', 'pray', 'gray', 'sway', 'clay'];
		const shortVerb = ['run', 'fly', 'win', 'try', 'use', 'get', 'set', 'fix', 'mix', 'add', 'cut', 'hit', 'sit', 'fit', 'put', 'eat', 'see', 'buy', 'pay', 'say', 'lay', 'may', 'way', 'day', 'play', 'stay', 'pray', 'gray', 'sway', 'clay'];

        let username = this.getRandomElement(shortAdj) + 
                      this.getRandomElement(shortNoun) + 
                      this.getRandomElement(shortVerb);

        if (options.includeUppercase) {
            username = username.charAt(0).toUpperCase() + username.slice(1);
        }

        if (options.includeSymbols) {
            username = this.addSymbolsToUsername(username, options.length);
        }

        if (options.includeNumbers) {
            username = this.addNumbersToUsername(username, options.length, 4);
        }

        return this.adjustUsernameLength(username, options.length, options);
    }

    generateAlternatives(baseUsername, options) {
        const alternatives = [];
        const generators = [
            () => this.generateRandomCharacters(options),
            () => this.generateReadableUsername(options),
            () => this.generateGamingUsername(options),
            () => this.generateProfessionalUsername(options),
            () => this.generateTechUsername(options),
            () => this.generateNatureUsername(options),
            () => this.generateFantasyUsername(options),
            () => this.generateModernUsername(options),
            () => this.generateCreativeUsername(options),
            () => this.generateMinimalistUsername(options),
            () => this.generateVerbNounUsername(options),
            () => this.generateDoubleAdjectiveUsername(options),
            () => this.generateCorporateUsername(options),
            () => this.generateAnimalActionUsername(options),
            () => this.generateAbstractUsername(options),
            () => this.generateThreeWordUsername(options)
        ];

        const usedGenerators = new Set();
        let attempts = 0;
        const maxAttempts = 50;

        while (alternatives.length < 6 && attempts < maxAttempts) {
            const generatorIndex = Math.floor(Math.random() * generators.length);
            
            if (!usedGenerators.has(generatorIndex)) {
                const alternative = generators[generatorIndex]();
                
                if (alternative !== baseUsername && !alternatives.includes(alternative)) {
                    alternatives.push(alternative);
                    usedGenerators.add(generatorIndex);
                }
            }
            attempts++;
        }

        return alternatives.slice(0, 6);
    }

    generateUsername() {
        const options = this.getSelectedOptions();
        let username = '';

        const generators = {
            'random': () => this.generateRandomCharacters(options),
            'readable': () => this.generateReadableUsername(options),
            'gaming': () => this.generateGamingUsername(options),
            'professional': () => this.generateProfessionalUsername(options),
            'tech': () => this.generateTechUsername(options),
            'nature': () => this.generateNatureUsername(options),
            'fantasy': () => this.generateFantasyUsername(options),
            'modern': () => this.generateModernUsername(options),
            'creative': () => this.generateCreativeUsername(options),
            'minimalist': () => this.generateMinimalistUsername(options),
            'verbnoun': () => this.generateVerbNounUsername(options),
            'doubleadj': () => this.generateDoubleAdjectiveUsername(options),
            'corporate': () => this.generateCorporateUsername(options),
            'animalaction': () => this.generateAnimalActionUsername(options),
            'abstract': () => this.generateAbstractUsername(options),
            'threeword': () => this.generateThreeWordUsername(options)
        };

        const generator = generators[options.style] || generators['readable'];
        username = generator();

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

        if (suggestionsContainer) {
            const alternatives = this.generateAlternatives(username, options);
            this.displaySuggestions(alternatives);
            suggestionsContainer.style.display = 'block';
        }

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
