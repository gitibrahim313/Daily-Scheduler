# 📅 Daily Scheduler & Digital Weekly Planner

A responsive, zero-dependency, client-side digital weekly planner and productivity suite built with vanilla HTML5, CSS3, and modern ES6+ JavaScript.

---

## ✨ Features

- **7-Day Interactive Task Grid**: Mon–Sun day-split layout with smooth carousel navigation, animated circular SVG progress rings, and real-time task completion tracking.
- **Gym & Workout Guide**: Complete 7-day push/pull/legs exercise split with video & GIF demonstrations, sets/reps logging, and interval countdown timer.
- **Money Flow & Expense Tracker (INR)**: Full income/expense transaction tracker with automatic net balance, monthly budget limits, savings targets, and Indian numbering format (`₹` / `en-IN`).
- **Good Habits Matrix**: Weekly habit grid tracking consistency across days with interactive checkmarks and progress metrics.
- **Daily Routine & Notes**: Structured morning/evening routine checklists and rich markdown-style note cards.
- **SaaS Analytics Dashboard**: Central hub displaying real-time productivity stats, quick-action shortcuts, upcoming schedules, and performance graphs.
- **Offline LocalStorage Persistence**: Multi-week rolling data persistence stored completely in the browser with zero cloud dependencies required.
- **Mobile-First Responsive Design**: Optimized for smartphones, tablets, laptops, and ultra-wide desktop screens with touch swipe support.

---

## 🚀 Getting Started

No build tools, bundlers, or `npm install` needed! Simply open `index.html` in any modern web browser:

```bash
# Clone the repository
git clone https://github.com/<your-username>/Daily-Scheduler.git

# Open the project folder
cd Daily-Scheduler

# Open in browser (Windows PowerShell)
Start-Process index.html
```

Or double-click **`index.html`** in your file manager.

---

## 📁 Project Structure

```
Daily-Scheduler/
├── index.html           # Main Daily Planner & Task Carousel
├── app.js               # Core logic, date calculations & localStorage state
├── styles.css           # Comprehensive unified stylesheet & responsive CSS
├── dashboard.html       # SaaS Productivity Analytics Dashboard
├── dashboard.js         # Dashboard statistics & activity feeds
├── gym.html             # Workout Split & Exercise Log
├── gym.js               # Exercise checklist, demo player & timer
├── money.html           # Money Flow & INR Expense Tracker
├── money.js             # Financial transactions & budget calculations
├── habits.html          # Habit Tracking Matrix
├── habits.js            # Habit rows & weekly streak tracking
├── routine.html         # Daily Routine & Rich Notes Panel
├── routine.js           # Routine checklist & note management
├── assets/              # Icons, badges, and vector assets
└── README.md            # Project documentation
```

---

## 🛠️ Tech Stack

- **Markup**: Semantic HTML5 (ARIA accessible)
- **Styling**: Modern CSS3 (CSS Grid, Flexbox, Custom Properties, Responsive Media Queries)
- **Scripting**: Pure Vanilla JavaScript (ES6+ IIFE modules, Web Audio API, Web Storage API)
- **Dependencies**: 0 external runtime dependencies

---

## 📄 License

MIT License — Feel free to use and adapt for your personal or commercial productivity workflows.
