# Darija Learning - Moroccan Arabic Flashcard App 🇲🇦

A responsive web application for learning Moroccan Arabic (Darija) using interactive flashcards. Built with HTML, CSS, JavaScript, and Tailwind CSS.

## Features ✨

- **📱 Mobile & Desktop Compatible**: Responsive design that works on all devices
- **🃏 Interactive Flashcards**: Flip cards to reveal translations with smooth animations
- **📊 Progress Tracking**: Track your learning progress with visual indicators
- **🎯 Smart Filtering**: Option to show only unknown sentences for focused learning
- **💾 Local Storage**: Your progress is automatically saved in your browser
- **🎮 Multiple Input Methods**: 
  - Click/tap buttons
  - Keyboard shortcuts (Space/Enter to flip, Arrow keys to navigate, K to mark known)
  - Touch gestures (swipe left/right on mobile)
- **🌟 Scoring System**: Earn points for sentences you know
- **🔄 Randomization**: Cards are shuffled for effective learning
- **📂 CSV Import**: Easy import of your own sentence collections

## How to Use 🚀

1. **Open the App**: Open `index.html` in your web browser
2. **Load Data**: 
   - Click "Load Full Dataset (48k+ sentences)" to use the complete Darija-English sentence collection
   - Or upload your own CSV file with additional sentences
3. **Start Learning**:
   - Read the Darija sentence on the front of the card
   - Click "Flip Card" or press Space/Enter to see the English translation
   - Click "I Know This" or press K if you understand the sentence
   - Click "Next Card" or use arrow keys to move to the next sentence

## Dataset 📚

The app comes with a comprehensive dataset containing **48,838 Darija-English sentence pairs** covering:
- Everyday conversations and expressions
- Common phrases and idioms
- Various topics and contexts
- Real-world usage examples

### CSV Format 📋

Your CSV file should have this structure:
```csv
darija,eng
"homa mkhbbyin chi haja, ana mti99en!","They're hiding something, I'm sure!"
"bayna homa tay7awlo ib9aw mbrrdin.","It's obvious they're trying to keep their cool."
```

- Column A: Darija sentences (using Latin script transliteration)
- Column B: English translations
- Use quotes around sentences to handle commas properly

## Controls 🎮

### Keyboard Shortcuts
- **Space/Enter**: Flip card
- **Right Arrow/N**: Next card
- **Left Arrow/P**: Previous card
- **K**: Mark as known/unknown

### Touch Gestures (Mobile)
- **Swipe Left**: Next card
- **Swipe Right**: Previous card
- **Tap**: Flip card

## Features in Detail 📖

### Progress Tracking
- **Score**: Earn 10 points for each sentence you know
- **Progress Ring**: Visual indicator of learning completion
- **Progress Bar**: Shows percentage of known sentences

### Filtering Options
- **Show All Cards**: Practice all sentences (including known ones)
- **Show Only Unknown**: Focus on sentences you haven't mastered

### Smart Learning
- Cards are automatically shuffled for better retention
- Known sentences are excluded from random rotation when using "Show Only Unknown"
- Progress is saved automatically and persists between sessions

### Sample Phrases Included 🗣️

The app includes a comprehensive dataset with 48,838+ essential Moroccan Arabic phrases covering:
- Everyday conversations and expressions
- Common phrases and idioms
- Various topics and real-world contexts
- Transliterated Darija with English translations

## Technical Details 🛠️

### Built With
- **HTML5**: Semantic structure
- **CSS3**: Custom animations and responsive design
- **JavaScript ES6+**: Modern JavaScript features
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Local Storage**: Browser-based progress persistence

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## File Structure 📁

```
DarijaLearning/
├── index.html              # Main HTML file
├── app.js                  # JavaScript application logic
├── sample-sentences.csv    # Sample Darija sentences
└── README.md              # This documentation
```

## Getting Started 🏁

1. **Clone or download** this repository
2. **Open** `index.html` in any modern web browser
3. **Click** "Load Full Dataset (48k+ sentences)" to start learning immediately
4. **Or upload** your own CSV file with additional Darija sentences

**Important**: If you want to use the full dataset automatically, make sure to serve the files through a web server (not just opening the HTML file directly) for the CSV loading to work properly. Alternatively, you can always click the "Load Full Dataset" button to manually load the data.

## Tips for Effective Learning 📚

1. **Start with basics**: Begin with greetings and common phrases
2. **Practice daily**: Consistent daily practice is more effective than long sessions
3. **Use filtering**: Start with "Show All", then switch to "Show Only Unknown"
4. **Review regularly**: Periodically review known sentences to maintain retention
5. **Listen and repeat**: Try to pronounce the Darija phrases as you learn

## Contributing 🤝

Feel free to contribute by:
- Adding more sample sentences
- Improving the UI/UX
- Adding new features
- Reporting bugs or issues

## License 📄

This project is open source and available under the MIT License.

---

**Happy Learning! بالتوفيق (Good luck!)** 🌟