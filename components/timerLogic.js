/* 
   Z-Timer Pro Logic - Fixed Hours Logic
   Developed for: Abdallah
*/

let timerInterval = null;
let isWorkSession = true;
let totalSeconds = 25 * 60; // القيمة الافتراضية

// جلب العناصر
const hoursDisplay = document.getElementById("hours");
const minDisplay = document.getElementById("minutes");
const secDisplay = document.getElementById("seconds");
const statusLabel = document.getElementById("status-label");
const hoursInput = document.getElementById("hours-input");
const minutesInput = document.getElementById("minutes-input");
const secondsInput = document.getElementById("seconds-input");
const breakHint = document.getElementById("break-hint");
const colons = document.querySelectorAll(".colon");

// دالة تحديث الواجهة (The Engine)
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

// مزامنة الوقت من مربع الإدخال
function syncFromInput() {
    if (timerInterval) return;
    
    const hrs = parseInt(hoursInput.value) || 0;
    const mins = parseInt(minutesInput.value) || 0;
    const secs = parseInt(secondsInput.value) || 0;
    
    totalSeconds = (hrs * 3600) + (mins * 60) + secs;
    
    const workMinutes = (hrs * 60) + mins;
    const bMins = 5;
    breakHint.innerText = `الاستراحة: ${bMins} دقائق`;
    
    updateUI();
}

hoursInput.addEventListener('input', syncFromInput);
minutesInput.addEventListener('input', syncFromInput);
secondsInput.addEventListener('input', syncFromInput);

let originalDuration = 25 * 60;

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
            
            const finishedSession = isWorkSession ? "تركيز" : "استراحة";
            const actualDuration = originalDuration;
            
            isWorkSession = !isWorkSession;
            const hrs = parseInt(hoursInput.value) || 0;
            const mins = parseInt(minutesInput.value) || 0;
            const baseSeconds = (hrs * 3600) + (mins * 60);
            totalSeconds = isWorkSession ? baseSeconds : 5 * 60;

            statusLabel.innerText = isWorkSession ? "وضع التركيز" : "وضع الاستراحة";
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

export function pause() {
    if (sessionStartTime) {
        const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
        pausedTime += elapsed;
    }
    clearInterval(timerInterval);
    timerInterval = null;
}

export function reset() {
    pause();
    isWorkSession = true;
    sessionStartTime = null;
    pausedTime = 0;
    syncFromInput();
    statusLabel.innerText = "وضع التركيز";
    statusLabel.style.color = "#00f2ff";
}

export function clearHistory() {
    document.getElementById("session-list").innerHTML = "";
}

function addSessionToLog(type, actualDuration) {
    saveSessionToStorage(type, actualDuration);
}

let sessionStartTime = null;
let pausedTime = 0;

function saveSessionToStorage(type, actualDuration) {
    let sessions = JSON.parse(localStorage.getItem('pomodoroSessions')) || [];
    const sessionData = {
        type: type,
        date: new Date().toISOString(),
        timestamp: Date.now(),
        duration: actualDuration
    };
    sessions.push(sessionData);
    localStorage.setItem('pomodoroSessions', JSON.stringify(sessions));
}

export function getStats() {
    const sessions = JSON.parse(localStorage.getItem('pomodoroSessions')) || [];
    const workSessions = sessions.filter(s => s.type === 'تركيز').length;
    const breakSessions = sessions.filter(s => s.type === 'استراحة').length;
    const totalSeconds = sessions.reduce((acc, s) => acc + (s.duration || 0), 0);
    const totalHours = (totalSeconds / 3600).toFixed(1);
    
    const today = new Date().toDateString();
    const streakDays = calculateStreak(sessions);
    
    return { workSessions, breakSessions, totalHours, streakDays };
}

function calculateStreak(sessions) {
    if (sessions.length === 0) return 0;
    
    const dates = [...new Set(sessions.map(s => new Date(s.date).toDateString()))].sort().reverse();
    let streak = 0;
    const today = new Date().toDateString();
    
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

// تحديث أولي عند التشغيل
updateUI();

// Popup functionality
const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popup-title");
const popupMessage = document.getElementById("popup-message");
const popupBtn = document.getElementById("popup-btn");

function showPopup(type) {
    if (type === "تركيز") {
        popupTitle.innerText = "انتهت الجلسة!";
        popupMessage.innerText = "حان وقت الاستراحة";
    } else {
        popupTitle.innerText = "انتهت الاستراحة!";
        popupMessage.innerText = "حان وقت التركيز";
    }
    popup.classList.add("show");
}

popupBtn.addEventListener("click", () => {
    popup.classList.remove("show");
});