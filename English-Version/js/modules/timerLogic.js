/* 
   Z-Timer Pro Logic - English Version
   Developed for: Abdallah

   ============================================
   Table of Contents:
   1. Global Variables
   2. DOM Elements
   3. Update UI Function
   4. Sync from Input
   5. Start Function
   6. Pause Function
   7. Reset Function
   8. Save Session
   9. Get Stats
   10. Calculate Streak
   11. Popup
   ============================================
*/

/* 1. Global Variables */
let timerInterval = null;
let isWorkSession = true;
let totalSeconds = 25 * 60;
let sessionStartTime = null;
let pausedTime = 0;
let originalDuration = 25 * 60;

/* 2. DOM Elements */
const hoursDisplay = document.getElementById("hours");
const minDisplay = document.getElementById("minutes");
const secDisplay = document.getElementById("seconds");
const statusLabel = document.getElementById("status-label");
const hoursInput = document.getElementById("hours-input");
const minutesInput = document.getElementById("minutes-input");
const secondsInput = document.getElementById("seconds-input");
const breakHint = document.getElementById("break-hint");
const colons = document.querySelectorAll(".colon");

/* 3. Update UI Function */
function updateUI() {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    hoursDisplay.innerText = hrs < 10 ? "0" + hrs : hrs;
    minDisplay.innerText = mins < 10 ? "0" + mins : mins;
    secDisplay.innerText = secs < 10 ? "0" + secs : secs;

    hoursDisplay.style.display = "inline";
    colons[0].style.display = "inline";
}

/* 4. Sync from Input */
function syncFromInput() {
    if (timerInterval) return;
    
    const hrs = parseInt(hoursInput.value) || 0;
    const mins = parseInt(minutesInput.value) || 0;
    const secs = parseInt(secondsInput.value) || 0;
    
    totalSeconds = (hrs * 3600) + (mins * 60) + secs;
    
    const bMins = 5;
    breakHint.innerText = `Break: ${bMins} minutes`;
    
    updateUI();
}

hoursInput.addEventListener('input', syncFromInput);
minutesInput.addEventListener('input', syncFromInput);
secondsInput.addEventListener('input', syncFromInput);

/* 5. Start Function */
export function start() {
    if (timerInterval) return;

    if (!sessionStartTime) {
        sessionStartTime = Date.now();
        pausedTime = 0;
        originalDuration = isWorkSession ? 
            ((parseInt(hoursInput.value) || 0) * 3600 + (parseInt(minutesInput.value) || 0) * 60) :
            5 * 60;
    }

    timerInterval = setInterval(() => {
        if (totalSeconds <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            
            const finishedSession = isWorkSession ? "focus" : "break";
            const actualDuration = originalDuration;
            
            isWorkSession = !isWorkSession;
            
            const hrs = parseInt(hoursInput.value) || 0;
            const mins = parseInt(minutesInput.value) || 0;
            const baseSeconds = (hrs * 3600) + (mins * 60);
            totalSeconds = isWorkSession ? baseSeconds : 5 * 60;

            statusLabel.innerText = isWorkSession ? "Focus Mode" : "Break Mode";
            statusLabel.style.color = isWorkSession ? "#00f2ff" : "#00ff88";
            
            addSessionToLog(finishedSession, actualDuration);
            sessionStartTime = null;
            pausedTime = 0;
            showPopup(finishedSession);
            updateUI();
            return;
        }
        
        totalSeconds--;
        updateUI();
    }, 1000);
}

/* 6. Pause Function */
export function pause() {
    if (sessionStartTime) {
        const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
        pausedTime += elapsed;
    }
    clearInterval(timerInterval);
    timerInterval = null;
}

/* 7. Reset Function */
export function reset() {
    pause();
    isWorkSession = true;
    sessionStartTime = null;
    pausedTime = 0;
    syncFromInput();
    statusLabel.innerText = "Focus Mode";
    statusLabel.style.color = "#00f2ff";
}

export function clearHistory() {
    document.getElementById("session-list").innerHTML = "";
}

/* 8. Save Session */
function addSessionToLog(type, actualDuration) {
    saveSessionToStorage(type, actualDuration);
}

function saveSessionToStorage(type, actualDuration) {
    let sessions = JSON.parse(localStorage.getItem('pomodoroSessionsEn')) || [];
    
    const sessionData = {
        type: type,
        date: new Date().toISOString(),
        timestamp: Date.now(),
        duration: actualDuration
    };
    
    sessions.push(sessionData);
    localStorage.setItem('pomodoroSessionsEn', JSON.stringify(sessions));
}

/* 9. Get Stats */
export function getStats() {
    const sessions = JSON.parse(localStorage.getItem('pomodoroSessionsEn')) || [];
    const workSessions = sessions.filter(s => s.type === 'focus').length;
    const breakSessions = sessions.filter(s => s.type === 'break').length;
    const totalSeconds = sessions.reduce((acc, s) => acc + (s.duration || 0), 0);
    const totalHours = (totalSeconds / 3600).toFixed(1);
    const streakDays = calculateStreak(sessions);
    
    return { workSessions, breakSessions, totalHours, streakDays };
}

/* 10. Calculate Streak */
function calculateStreak(sessions) {
    if (sessions.length === 0) return 0;
    
    const dates = [...new Set(sessions.map(s => new Date(s.date).toDateString()))].sort().reverse();
    let streak = 0;
    
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

/* Initial Update */
updateUI();

/* 11. Popup */
const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popup-title");
const popupMessage = document.getElementById("popup-message");
const popupBtn = document.getElementById("popup-btn");

function showPopup(type) {
    if (type === "focus") {
        popupTitle.innerText = "Session Complete!";
        popupMessage.innerText = "Time for a break";
    } else {
        popupTitle.innerText = "Break Over!";
        popupMessage.innerText = "Time to focus";
    }
    popup.classList.add("show");
}

popupBtn.addEventListener("click", () => {
    popup.classList.remove("show");
});