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
    const bMins = Math.floor(workMinutes / 5) || 1;
    breakHint.innerText = `الاستراحة: ${bMins} دقائق (تلقائي)`;
    
    updateUI();
}

hoursInput.addEventListener('input', syncFromInput);
minutesInput.addEventListener('input', syncFromInput);
secondsInput.addEventListener('input', syncFromInput);

export function start() {
    if (timerInterval) return;

    timerInterval = setInterval(() => {
        if (totalSeconds <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            
            isWorkSession = !isWorkSession;
            const hrs = parseInt(hoursInput.value) || 0;
            const mins = parseInt(minutesInput.value) || 0;
            const baseMinutes = (hrs * 60) + mins;
            const baseSeconds = (hrs * 3600) + (mins * 60);
            totalSeconds = isWorkSession ? baseSeconds : Math.floor(baseMinutes / 5) * 60;
            
            statusLabel.innerText = isWorkSession ? "وضع التركيز" : "وضع الاستراحة";
            statusLabel.style.color = isWorkSession ? "#00f2ff" : "#00ff88";
            
            addSessionToLog(isWorkSession ? "استراحة" : "تركيز");
            alert("انتهت الجلسة!");
            updateUI();
            return;
        }
        totalSeconds--;
        updateUI();
    }, 1000);
}

export function pause() {
    clearInterval(timerInterval);
    timerInterval = null;
}

export function reset() {
    pause();
    isWorkSession = true;
    syncFromInput();
    statusLabel.innerText = "وضع التركيز";
    statusLabel.style.color = "#00f2ff";
}

export function clearHistory() {
    document.getElementById("session-list").innerHTML = "";
}

function addSessionToLog(type) {
    const list = document.getElementById("session-list");
    const li = document.createElement("li");
    li.className = "session-item";
    li.innerHTML = `
        <span>جلسة ${type} مكتملة</span>
        <i class="fas fa-check-circle"></i>
        <i class="fas fa-trash delete-btn"></i>
    `;
    li.querySelector(".delete-btn").addEventListener("click", () => li.remove());
    list.prepend(li);
}

// تحديث أولي عند التشغيل
updateUI();