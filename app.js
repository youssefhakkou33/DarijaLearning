class DarijaLearningApp {
    constructor() {
        this.sentences = [];
        this.currentIndex = 0;
        this.knownSentences = new Set();
        this.score = 0;
        this.showOnlyUnknown = false;
        this.filteredSentences = [];
        this.isFlipped = false;
        
        this.initializeElements();
        this.loadStoredData();
        this.setupEventListeners();
        this.loadDefaultDataset();
        this.updateUI();
    }

    initializeElements() {
        // File upload
        this.csvFile = document.getElementById('csvFile');
        
        // Sections
        this.uploadSection = document.getElementById('uploadSection');
        this.progressSection = document.getElementById('progressSection');
        this.flashcardSection = document.getElementById('flashcardSection');
        this.emptyState = document.getElementById('emptyState');
        
        // Flashcard elements
        this.flipCard = document.querySelector('.flip-card');
        this.darijaText = document.getElementById('darijaText');
        this.englishText = document.getElementById('englishText');
        this.currentCardSpan = document.getElementById('currentCard');
        this.totalCardsSpan = document.getElementById('totalCards');
        
        // Buttons
        this.flipButton = document.getElementById('flipCard');
        this.markKnownButton = document.getElementById('markKnown');
        this.nextCardButton = document.getElementById('nextCard');
        this.showUnknownButton = document.getElementById('showUnknown');
        this.showAllButton = document.getElementById('showAll');
        this.resetProgressButton = document.getElementById('resetProgress');
        
        // Score and progress elements
        this.scoreElement = document.getElementById('score');
        this.knownCountElement = document.getElementById('knownCount');
        this.progressRing = document.getElementById('progressRing');
        this.progressPercent = document.getElementById('progressPercent');
        this.progressText = document.getElementById('progressText');
        this.progressBar = document.getElementById('progressBar');
        
        // Toast
        this.toast = document.getElementById('toast');
        this.toastMessage = document.getElementById('toastMessage');
    }

    setupEventListeners() {
        // File upload
        this.csvFile.addEventListener('change', (e) => this.handleFileUpload(e));
        
        // Flashcard buttons
        this.flipButton.addEventListener('click', () => this.flipCurrentCard());
        this.markKnownButton.addEventListener('click', () => this.markCurrentAsKnown());
        this.nextCardButton.addEventListener('click', () => this.nextCard());
        
        // Filter buttons
        this.showUnknownButton.addEventListener('click', () => this.setFilterMode(true));
        this.showAllButton.addEventListener('click', () => this.setFilterMode(false));
        
        // Reset button
        this.resetProgressButton.addEventListener('click', () => this.resetProgress());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Touch gestures for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        this.flipCard.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        this.flipCard.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        });
    }

    handleKeyPress(e) {
        if (this.sentences.length === 0) return;
        
        switch(e.key) {
            case ' ':
            case 'Enter':
                e.preventDefault();
                this.flipCurrentCard();
                break;
            case 'ArrowRight':
            case 'n':
                e.preventDefault();
                this.nextCard();
                break;
            case 'ArrowLeft':
            case 'p':
                e.preventDefault();
                this.previousCard();
                break;
            case 'k':
                e.preventDefault();
                this.markCurrentAsKnown();
                break;
        }
    }

    handleSwipe(startX, endX) {
        const threshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                // Swipe left - next card
                this.nextCard();
            } else {
                // Swipe right - previous card
                this.previousCard();
            }
        }
    }

    async handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const text = await this.readFileAsText(file);
            this.parseCsvData(text);
            this.showToast('CSV file loaded successfully!', 'success');
        } catch (error) {
            console.error('Error reading file:', error);
            this.showToast('Error reading file. Please try again.', 'error');
        }
    }

    readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    parseCsvData(csvText) {
        const lines = csvText.split('\n').filter(line => line.trim());
        this.sentences = [];

        // Skip header row if it exists
        const startIndex = lines[0] && (lines[0].toLowerCase().includes('darija') || lines[0].toLowerCase().includes('eng')) ? 1 : 0;

        for (let i = startIndex; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // Simple CSV parsing - handles basic cases
            const columns = this.parseCSVLine(line);
            
            if (columns.length >= 2) {
                const darija = columns[0].trim();
                const english = columns[1].trim();
                
                if (darija && english) {
                    this.sentences.push({
                        id: i,
                        darija: darija,
                        english: english
                    });
                }
            }
        }

        if (this.sentences.length > 0) {
            this.initializeFlashcards();
            this.showToast(`Loaded ${this.sentences.length} sentences successfully!`, 'success');
        } else {
            this.showToast('No valid sentences found in the CSV file.', 'error');
        }
    }

    async loadDefaultDataset() {
        try {
            const response = await fetch('sentences.csv');
            if (response.ok) {
                const csvText = await response.text();
                this.parseCsvData(csvText);
            } else {
                // If the default file doesn't load, show the upload interface
                console.log('Default dataset not found, showing upload interface');
            }
        } catch (error) {
            console.log('Could not load default dataset:', error.message);
            // This is normal if running locally without a server
        }
    }

    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current);
        return result.map(item => item.replace(/^"|"$/g, ''));
    }

    initializeFlashcards() {
        this.currentIndex = 0;
        this.updateFilteredSentences();
        this.updateUI();
        this.showFlashcardSection();
        this.displayCurrentCard();
    }

    updateFilteredSentences() {
        if (this.showOnlyUnknown) {
            this.filteredSentences = this.sentences.filter(
                sentence => !this.knownSentences.has(sentence.id)
            );
        } else {
            this.filteredSentences = [...this.sentences];
        }
        
        // Shuffle the filtered sentences for random order
        this.shuffleArray(this.filteredSentences);
        
        // Reset current index if it's out of bounds
        if (this.currentIndex >= this.filteredSentences.length) {
            this.currentIndex = 0;
        }
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    showFlashcardSection() {
        this.uploadSection.classList.add('hidden');
        this.emptyState.classList.add('hidden');
        this.flashcardSection.classList.remove('hidden');
        this.progressSection.classList.remove('hidden');
    }

    displayCurrentCard() {
        if (this.filteredSentences.length === 0) {
            this.showEmptyFilteredState();
            return;
        }

        const currentSentence = this.filteredSentences[this.currentIndex];
        
        this.darijaText.textContent = currentSentence.darija;
        this.englishText.textContent = currentSentence.english;
        
        // Reset flip state
        this.isFlipped = false;
        this.flipCard.classList.remove('flipped');
        
        // Update card counter
        this.currentCardSpan.textContent = this.currentIndex + 1;
        this.totalCardsSpan.textContent = this.filteredSentences.length;
        
        // Update known button state
        const isKnown = this.knownSentences.has(currentSentence.id);
        this.markKnownButton.textContent = isKnown ? 'Mark Unknown' : 'I Know This';
        this.markKnownButton.className = isKnown 
            ? 'bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2'
            : 'bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2';
        
        // Add animation
        this.flipCard.classList.add('slide-in');
        setTimeout(() => this.flipCard.classList.remove('slide-in'), 500);
    }

    showEmptyFilteredState() {
        this.flashcardSection.classList.add('hidden');
        this.emptyState.classList.remove('hidden');
        this.emptyState.innerHTML = `
            <svg class="mx-auto h-24 w-24 text-green-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="text-xl font-medium text-green-600 mb-2">Congratulations!</h3>
            <p class="text-gray-500 mb-4">You know all the sentences! Click "Show All Cards" to review them again.</p>
            <button onclick="app.setFilterMode(false)" class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Show All Cards
            </button>
        `;
    }

    flipCurrentCard() {
        this.isFlipped = !this.isFlipped;
        this.flipCard.classList.toggle('flipped', this.isFlipped);
    }

    nextCard() {
        if (this.filteredSentences.length === 0) return;
        
        this.currentIndex = (this.currentIndex + 1) % this.filteredSentences.length;
        this.displayCurrentCard();
    }

    previousCard() {
        if (this.filteredSentences.length === 0) return;
        
        this.currentIndex = this.currentIndex === 0 
            ? this.filteredSentences.length - 1 
            : this.currentIndex - 1;
        this.displayCurrentCard();
    }

    markCurrentAsKnown() {
        if (this.filteredSentences.length === 0) return;
        
        const currentSentence = this.filteredSentences[this.currentIndex];
        const wasKnown = this.knownSentences.has(currentSentence.id);
        
        if (wasKnown) {
            this.knownSentences.delete(currentSentence.id);
            this.score = Math.max(0, this.score - 10);
            this.showToast('Marked as unknown. -10 points', 'info');
        } else {
            this.knownSentences.add(currentSentence.id);
            this.score += 10;
            this.showToast('Great job! +10 points', 'success');
        }
        
        this.saveProgress();
        this.updateUI();
        this.displayCurrentCard();
        
        // Auto advance to next card after marking as known (if showing only unknown)
        if (!wasKnown && this.showOnlyUnknown) {
            setTimeout(() => {
                this.updateFilteredSentences();
                if (this.filteredSentences.length === 0) {
                    this.showEmptyFilteredState();
                } else {
                    this.displayCurrentCard();
                }
            }, 1000);
        }
    }

    setFilterMode(showOnlyUnknown) {
        this.showOnlyUnknown = showOnlyUnknown;
        this.updateFilteredSentences();
        
        // Update button states
        this.showUnknownButton.className = showOnlyUnknown
            ? 'bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors mr-2'
            : 'bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors mr-2';
            
        this.showAllButton.className = !showOnlyUnknown
            ? 'bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors'
            : 'bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors';
        
        if (this.filteredSentences.length === 0) {
            this.showEmptyFilteredState();
        } else {
            this.flashcardSection.classList.remove('hidden');
            this.emptyState.classList.add('hidden');
            this.displayCurrentCard();
        }
    }

    resetProgress() {
        if (confirm('Are you sure you want to reset all progress? This action cannot be undone.')) {
            this.knownSentences.clear();
            this.score = 0;
            this.saveProgress();
            this.updateUI();
            this.updateFilteredSentences();
            this.displayCurrentCard();
            this.showToast('Progress reset successfully!', 'info');
        }
    }

    updateUI() {
        // Update score and known count
        this.scoreElement.textContent = this.score;
        this.knownCountElement.textContent = this.knownSentences.size;
        
        // Update progress
        if (this.sentences.length > 0) {
            const percentage = Math.round((this.knownSentences.size / this.sentences.length) * 100);
            const circumference = 2 * Math.PI * 36; // radius is 36
            const strokeDashoffset = circumference - (percentage / 100) * circumference;
            
            this.progressRing.style.strokeDashoffset = strokeDashoffset;
            this.progressPercent.textContent = `${percentage}%`;
            this.progressText.textContent = `${this.knownSentences.size} / ${this.sentences.length}`;
            this.progressBar.style.width = `${percentage}%`;
        }
    }

    showToast(message, type = 'success') {
        this.toastMessage.textContent = message;
        
        // Update toast styling based on type
        const toastDiv = this.toast.querySelector('div');
        toastDiv.className = `px-6 py-3 rounded-lg shadow-lg bounce-in text-white`;
        
        switch (type) {
            case 'success':
                toastDiv.classList.add('bg-green-500');
                break;
            case 'error':
                toastDiv.classList.add('bg-red-500');
                break;
            case 'info':
                toastDiv.classList.add('bg-blue-500');
                break;
        }
        
        this.toast.classList.remove('hidden');
        
        setTimeout(() => {
            this.toast.classList.add('hidden');
        }, 3000);
    }

    saveProgress() {
        const data = {
            knownSentences: Array.from(this.knownSentences),
            score: this.score,
            lastUpdated: new Date().toISOString()
        };
        
        localStorage.setItem('darijaLearningProgress', JSON.stringify(data));
    }

    loadStoredData() {
        try {
            const stored = localStorage.getItem('darijaLearningProgress');
            if (stored) {
                const data = JSON.parse(stored);
                this.knownSentences = new Set(data.knownSentences || []);
                this.score = data.score || 0;
            }
        } catch (error) {
            console.error('Error loading stored data:', error);
        }
    }
}

// Sample data for demonstration
function loadSampleData() {
    const sampleCSV = `"السلام عليكم","Hello / Peace be upon you"
"كيف داير؟","How are you doing?"
"بيخير والحمد لله","I'm fine, praise be to God"
"شكرا بزاف","Thank you very much"
"عفاك","Excuse me / Please"
"لا شكر على واجب","You're welcome"
"بسلامة","Goodbye (to someone leaving)"
"إلى اللقاء","See you later"
"صباح الخير","Good morning"
"تصبح على خير","Good night"
"سمح ليا","Sorry / Excuse me"
"ما فهمتش","I didn't understand"
"عاود تاني عافاك","Please repeat"
"واش كاتهضر العربية؟","Do you speak Arabic?"
"كانهضر شوية د الدارجة","I speak a little Darija"
"وين كاين الحمام؟","Where is the bathroom?"
"بشحال هادشي؟","How much is this?"
"غالي بزاف","Too expensive"
"عندك شي حاجة رخيصة؟","Do you have something cheaper?"
"فين كاين أقرب بنك؟","Where is the nearest bank?"
"واش يمكن ليك تعاونّي؟","Can you help me?"
"ماشي مشكل","No problem"
"زوين","Beautiful / Nice"
"بنين","Delicious"
"كنبغي نمشي لـ...","I want to go to..."
"كنقلب على...","I'm looking for..."
"واش عندكم واي فاي؟","Do you have WiFi?"
"كرهبة قطعات","The electricity is out"
"عندي جوع","I'm hungry"
"عندي عطش","I'm thirsty"
"كنخدم هنا","I work here"
"أنا مسافر","I'm a tourist"
"من وين نتا؟","Where are you from?"
"أنا من أمريكا","I'm from America"
"كتعجبني المغرب","I like Morocco"
"الجو زوين اليوم","The weather is nice today"
"كاين البرد","It's cold"
"كاين الحر","It's hot"
"شنو كاتاكل؟","What do you eat?"
"كنبغي الطاجين","I like tajine"
"الكسكس بنين","Couscous is delicious"
"كتشرب أتاي؟","Do you drink tea?"
"أتاي نعناع عافاك","Mint tea please"
"قهوة بلا سكر","Coffee without sugar"
"الفاتورة عافاك","The bill please"
"تبارك الله عليك","God bless you"
"الله يعطيك الصحة","May God give you health"
"ربي يحفظك","May God protect you"
"بالتوفيق","Good luck"
"عيد مبارك","Happy holiday"
"رمضان كريم","Ramadan Kareem"
"الحمد لله","Praise be to God"
"إن شاء الله","God willing"`;
    
    const event = { target: { files: [new Blob([sampleCSV], { type: 'text/csv' })] } };
    app.handleFileUpload(event);
}

// Initialize the app when the page loads
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new DarijaLearningApp();
    
    // Add load dataset button for demonstration
    const uploadSection = document.getElementById('uploadSection');
    const loadButton = document.createElement('button');
    loadButton.textContent = 'Load Full Dataset (48k+ sentences)';
    loadButton.className = 'mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors';
    loadButton.onclick = async () => {
        try {
            const response = await fetch('sentences.csv');
            if (response.ok) {
                const csvText = await response.text();
                app.parseCsvData(csvText);
            } else {
                app.showToast('Could not load the dataset. Make sure sentences.csv is in the same folder.', 'error');
            }
        } catch (error) {
            app.showToast('Error loading dataset: ' + error.message, 'error');
        }
    };
    
    uploadSection.appendChild(loadButton);
});
