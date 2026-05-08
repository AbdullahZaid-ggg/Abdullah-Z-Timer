# 🍅 Abdullah Z Timer - Pomodoro Application

A modern Pomodoro timer built with pure HTML, CSS, and JavaScript featuring a stunning dark glass-morphism design with Arabic RTL support.

> **Note**: This is a pure vanilla project with no external frameworks - just HTML, CSS, and JavaScript!

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| ⏱️ **Timer** | Hours, minutes, and seconds inputs (left to right), supports up to 24 hours |
| 🎮 **Controls** | Start, Pause, and Reset buttons with smooth hover animations |
| 🔄 **Auto-Switch** | Automatically switches between work sessions (25 min default) and breaks (5 min fixed) |
| 📋 **History** | Session log with individual delete buttons for each entry |
|popup **Modal** | Custom popup notification when session ends (not browser alert) |
| 🎨 **Design** | Dark glass-morphism theme with cyan/purple gradient |
| 🌐 **RTL** | Full Arabic RTL language support |
| 📱 **Responsive** | Mobile-friendly with responsive breakpoints |
| 🔗 **Footer** | GitHub credit with icon link |
| 🍅 **Header** | Tomato icon in the header |

---

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/AbdullahZaid-ggg/Abdullah-Z-Timer.git

# Open the project
cd Abdullah-Z-Timer
# Open index.html in your browser
```

### Alternative
Simply open `index.html` file in any modern web browser.

---

## 📖 Usage Guide

### Setting the Timer
1. Use the input fields to set hours, minutes, and seconds
2. Maximum allowed time is 24 hours
3. Default work session is 25 minutes

### Running the Timer
1. Click **ابدأ** (Start) to begin the countdown
2. Click **إيقاف** (Pause) to pause at any time
3. Click **إعادة** (Reset) to reset to the original time

### Session Flow
- **Work Session**: Default 25 minutes (configurable)
- **Break Session**: Fixed 5 minutes
- Timer automatically switches between work and break
- Popup modal appears when each session ends
- Completed sessions are logged in the history

### History Management
- View all completed sessions in the history section
- Delete individual sessions using the trash icon
- Clear all history with the "مسح" button

---

## 🎨 Design System

### Color Palette

| Color | Hex Code | Usage |
|-------|----------|-------|
| Primary Cyan | `#00f2ff` | Buttons, accents, gradients |
| Accent Purple | `#7000ff` | Gradients, highlights |
| Break Green | `#00ff88` | Break mode indicator |
| Background | `#020617` | Main background |
| Glass | `rgba(15, 23, 42, 0.9)` | Card background |

### Typography
- **Font Family**: Inter (fallback to system fonts)
- **Direction**: RTL (Arabic)
- **Timer Display**: Tabular nums for consistent width

### Effects
- Glass-morphism with backdrop-filter blur
- Smooth hover transitions (0.3s)
- Gradient text on headings
- Box shadows for depth

---

## 📂 Project Structure

```
Abdullah-Z-Timer/
├── index.html          # Main HTML structure
├── style.css           # CSS styling and responsive design
└── components/
    ├── script.js       # DOM event handlers
    └── timerLogic.js   # Core timer logic and state management
```

---

## 🔧 Technical Details

### Input Validation
- Hours: 0-24
- Minutes: 0-59
- Seconds: 0-59

### Timer Logic
- Uses `setInterval` with 1000ms (1 second) intervals
- Calculates hours, minutes, seconds from total seconds
- Updates UI on each tick and on session switch

### Session Management
- Boolean flag tracks work/break state
- Auto-switches to opposite session on timer completion
- Logs completed session to history before switching
- Shows appropriate popup message based on session type

### Responsive Breakpoints
- Desktop: 420px card width
- Mobile (<480px): 95% width, stacked controls
- Small mobile (<360px): Reduced font sizes

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Author

**Abdullah Zaid** - [GitHub](https://github.com/AbdullahZaid-ggg)

Built with ❤️ and lots of ☕

---

## 🙏 Acknowledgments

- Inspired by the Pomodoro Technique
- Glass-morphism design inspiration from modern UI trends
- Font Awesome for icons