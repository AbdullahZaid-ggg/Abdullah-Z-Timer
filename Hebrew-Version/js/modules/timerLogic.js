/* 
   Z-Timer Pro Logic - לוגיקת הטיימר
   Developed for: Abdallah

   ============================================
   תוכן עניינים:
   1. משתנים גלובליים (Global Variables)
   2. אלמנטי DOM (DOM Elements)
   3. פונקציית עדכון הממשק (Update UI)
   4. סנכרון זמן מהקלט (Sync from Input)
   5. פונקציית התחלה (Start Function)
   6. פונקציית עצירה (Pause Function)
   7. פונקציית איפוס (Reset Function)
   8. פונקציית ניקוי היסטוריה (Clear History)
   9. פונקציית שמירת סשן (Save Session)
   10. פונקציית חישוב סטטיסטיקות (Get Stats)
   11. פונקציית חישוב ימים רצופים (Calculate Streak)
   12. חלון קופץ (Popup)
   ============================================
*/

/* 1. משתנים גלובליים - Global Variables */
let timerInterval = null;           // לאחסון הטיימר
let isWorkSession = true;          // לעקוב אחר סוג הסשן (ריכוז/הפסקה)
let totalSeconds = 25 * 60;        // הזמן הכולל בשניות
let sessionStartTime = null;       // זמן התחלת הסשן
let pausedTime = 0;               // הזמן שהושהה בעת עצירה
let originalDuration = 25 * 60;    // המשך המקורי של הסשן

/* 2. אלמנטי DOM - קבלת אלמנטים מהדף */
const hoursDisplay = document.getElementById("hours");        // הצגת שעות
const minDisplay = document.getElementById("minutes");       // הצגת דקות
const secDisplay = document.getElementById("seconds");         // הצגת שניות
const statusLabel = document.getElementById("status-label"); // מצב הטיימר
const hoursInput = document.getElementById("hours-input");   // קלט שעות
const minutesInput = document.getElementById("minutes-input"); // קלט דקות
const secondsInput = document.getElementById("seconds-input"); // קלט שניות
const breakHint = document.getElementById("break-hint");     // טקסט הפסקה
const colons = document.querySelectorAll(".colon");          // הנקודותיים

/* 3. פונקציית עדכון הממשק - עדכון זמן הטיימר על המסך */
function updateUI() {
    // חישוב שעות, דקות ושניות
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    // עדכון טקסטים עם הוספת אפס אם קטן מ-10
    hoursDisplay.innerText = hrs < 10 ? "0" + hrs : hrs;
    minDisplay.innerText = mins < 10 ? "0" + mins : mins;
    secDisplay.innerText = secs < 10 ? "0" + secs : secs;

    // הצגת סימן הנקודותיים
    hoursDisplay.style.display = "inline";
    colons[0].style.display = "inline";
}

/* 4. סנכרון זמן מהקלט - קריאת זמן מהשדות */
function syncFromInput() {
    // לא ניתן לשנות זמן במהלך פעולת הטיימר
    if (timerInterval) return;
    
    // קריאת ערכים מהשדות
    const hrs = parseInt(hoursInput.value) || 0;
    const mins = parseInt(minutesInput.value) || 0;
    const secs = parseInt(secondsInput.value) || 0;
    
    // המרת הכל לשניות
    totalSeconds = (hrs * 3600) + (mins * 60) + secs;
    
    // עדכון טקסט ההפסקה
    const bMins = 5;
    breakHint.innerText = `הפסקה: ${bMins} דקות`;
    
    // עדכון הממשק
    updateUI();
}

// הוספת מאזיני אירוע לשדות הקלט
hoursInput.addEventListener('input', syncFromInput);
minutesInput.addEventListener('input', syncFromInput);
secondsInput.addEventListener('input', syncFromInput);

/* 5. פונקציית התחלה - התחלת הטיימר */
export function start() {
    // מניעת הפעלת טיימר נוסף אם כבר פועל
    if (timerInterval) return;

    // רישום זמן התחלה בפעם הראשונה
    if (!sessionStartTime) {
        sessionStartTime = Date.now();
        pausedTime = 0;
        // חישוב המשך המקורי של הסשן
        originalDuration = isWorkSession ? 
            ((parseInt(hoursInput.value) || 0) * 3600 + (parseInt(minutesInput.value) || 0) * 60) :
            5 * 60;
    }

    // הפעלת הטיימר כל שנייה
    timerInterval = setInterval(() => {
        // בדיקת סיום הזמן
        if (totalSeconds <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            
            // קביעת סוג הסשן שהסתיים
            const finishedSession = isWorkSession ? "ריכוז" : "הפסקה";
            const actualDuration = originalDuration;
            
            // החלפת סוג הסשן
            isWorkSession = !isWorkSession;
            
            // הגדרת זמן לסשן הבא
            const hrs = parseInt(hoursInput.value) || 0;
            const mins = parseInt(minutesInput.value) || 0;
            const baseSeconds = (hrs * 3600) + (mins * 60);
            totalSeconds = isWorkSession ? baseSeconds : 5 * 60;

            // עדכון מצב הטיימר
            statusLabel.innerText = isWorkSession ? "מצב ריכוז" : "מצב הפסקה";
            statusLabel.style.color = isWorkSession ? "#00f2ff" : "#00ff88";
            
            // שמירת הסשן והצגת החלון הקופץ
            addSessionToLog(finishedSession, actualDuration);
            sessionStartTime = null;
            pausedTime = 0;
            showPopup(finishedSession);
            updateUI();
            return;
        }
        
        // הפחתת שנייה אחת
        totalSeconds--;
        updateUI();
    }, 1000);
}

/* 6. פונקציית עצירה - עצירת הטיימר זמנית */
export function pause() {
    // חישוב הזמן שהושהה
    if (sessionStartTime) {
        const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
        pausedTime += elapsed;
    }
    // עצירת הטיימר
    clearInterval(timerInterval);
    timerInterval = null;
}

/* 7. פונקציית איפוס - איפוס הטיימר להתחלה */
export function reset() {
    pause();
    isWorkSession = true;
    sessionStartTime = null;
    pausedTime = 0;
    syncFromInput();
    statusLabel.innerText = "מצב ריכוז";
    statusLabel.style.color = "#00f2ff";
}

export function clearHistory() {
    document.getElementById("session-list").innerHTML = "";
}

/* 9. פונקציית שמירת סשן - שמירה ב-localStorage */
function addSessionToLog(type, actualDuration) {
    saveSessionToStorage(type, actualDuration);
}

function saveSessionToStorage(type, actualDuration) {
    // קבלת סשנים קודמים
    let sessions = JSON.parse(localStorage.getItem('pomodoroSessions')) || [];
    
    // יצירת נתוני הסשן החדש
    const sessionData = {
        type: type,
        date: new Date().toISOString(),
        timestamp: Date.now(),
        duration: actualDuration
    };
    
    // הוספת הסשן ושמירה
    sessions.push(sessionData);
    localStorage.setItem('pomodoroSessions', JSON.stringify(sessions));
}

/* 10. פונקציית חישוב סטטיסטיקות - החזרת stats */
export function getStats() {
    const sessions = JSON.parse(localStorage.getItem('pomodoroSessions')) || [];
    const workSessions = sessions.filter(s => s.type === 'ריכוז').length;
    const breakSessions = sessions.filter(s => s.type === 'הפסקה').length;
    const totalSeconds = sessions.reduce((acc, s) => acc + (s.duration || 0), 0);
    const totalHours = (totalSeconds / 3600).toFixed(1);
    const streakDays = calculateStreak(sessions);
    
    return { workSessions, breakSessions, totalHours, streakDays };
}

/* 11. פונקציית חישוב ימים רצופים - מעקב אחר פעילות */
function calculateStreak(sessions) {
    if (sessions.length === 0) return 0;
    
    // חילוץ תאריכים ייחודיים
    const dates = [...new Set(sessions.map(s => new Date(s.date).toDateString()))].sort().reverse();
    let streak = 0;
    
    // בדיקת רציפות
    for (let i = 0; i < dates.length; i++) {
        const expectedDate = new Date();
        expectedDate.setDate(expectedDate.getDate() - i);
        if (dates[i] === expectedDate.toDateString()) {
            streak++;
        } else {
            break;
        }
    }
    return streak;
}

/* עדכון ראשוני בעת טעינת הדף */
updateUI();

/* 12. חלון קופץ - Popup בסיום הסשן */
// קבלת אלמנטי החלון
const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popup-title");
const popupMessage = document.getElementById("popup-message");
const popupBtn = document.getElementById("popup-btn");

// פונקציית הצגת החלון
function showPopup(type) {
    if (type === "ריכוז") {
        popupTitle.innerText = "הסשן הסתיים!";
        popupMessage.innerText = "הגיע זמן ההפסקה";
    } else {
        popupTitle.innerText = "ההפסקה הסתיימה!";
        popupMessage.innerText = "הגיע זמן הריכוז";
    }
    popup.classList.add("show");
}

// אירוע כפתור סגירה
popupBtn.addEventListener("click", () => {
    popup.classList.remove("show");
});