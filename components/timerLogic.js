/* 
   Z-Timer Pro Logic - منطق المؤقت
   Developed for: Abdallah

   ============================================
   جدول المحتويات:
   1. المتغيرات العامة (Global Variables)
   2. عناصر DOM (DOM Elements)
   3. دالة تحديث الواجهة (Update UI)
   4. مزامنة الوقت من الإدخال (Sync from Input)
   5. دالة البدء (Start Function)
   6. دالة الإيقاف (Pause Function)
   7. دالة إعادة الضبط (Reset Function)
   8. دالة مسح السجل (Clear History)
   9. دالة حفظ الجلسة (Save Session)
   10. دالة حساب الإحصائيات (Get Stats)
   11. دالة حساب الأيام المتتالية (Calculate Streak)
   12. النافذة المنبثقة (Popup)
   ============================================
*/

/* 1. المتغيرات العامة - Global Variables */
let timerInterval = null;           // لتخزين مؤقت التشغيل
let isWorkSession = true;          // لتتبع نوع الجلسة (تركيز/استراحة)
let totalSeconds = 25 * 60;        // الوقت الإجمالي بالثواني
let sessionStartTime = null;       // وقت بداية الجلسة
let pausedTime = 0;               // الوقت المستقطع أثناء الإيقاف
let originalDuration = 25 * 60;    // المدة الأصلية للجلسة

/* 2. عناصر DOM - جلب العناصر من الصفحة */
const hoursDisplay = document.getElementById("hours");        // عرض الساعات
const minDisplay = document.getElementById("minutes");       // عرض الدقائق
const secDisplay = document.getElementById("seconds");         // عرض الثواني
const statusLabel = document.getElementById("status-label"); // حالة المؤقت
const hoursInput = document.getElementById("hours-input");   // إدخال الساعات
const minutesInput = document.getElementById("minutes-input"); // إدخال الدقائق
const secondsInput = document.getElementById("seconds-input"); // إدخال الثواني
const breakHint = document.getElementById("break-hint");     // نص الاستراحة
const colons = document.querySelectorAll(".colon");          // النقطتين

/* 3. دالة تحديث الواجهة - تحديث وقت المؤقت على الشاشة */
function updateUI() {
    // حساب الساعات والدقائق والثواني
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    // تحديث النصوص مع إضافة صفر إذا كان أقل من 10
    hoursDisplay.innerText = hrs < 10 ? "0" + hrs : hrs;
    minDisplay.innerText = mins < 10 ? "0" + mins : mins;
    secDisplay.innerText = secs < 10 ? "0" + secs : secs;

    // إظهار علامة النقطتين
    hoursDisplay.style.display = "inline";
    colons[0].style.display = "inline";
}

/* 4. مزامنة الوقت من الإدخال - قراءة الوقت من الحقول */
function syncFromInput() {
    // لا يمكن تغيير الوقت أثناء تشغيل المؤقت
    if (timerInterval) return;
    
    // قراءة القيم من الحقول
    const hrs = parseInt(hoursInput.value) || 0;
    const mins = parseInt(minutesInput.value) || 0;
    const secs = parseInt(secondsInput.value) || 0;
    
    // تحويل كل شيء إلى ثواني
    totalSeconds = (hrs * 3600) + (mins * 60) + secs;
    
    // تحديث نص الاستراحة
    const bMins = 5;
    breakHint.innerText = `الاستراحة: ${bMins} دقائق`;
    
    // تحديث الواجهة
    updateUI();
}

// إضافة مستمعي الأحداث لحقول الإدخال
hoursInput.addEventListener('input', syncFromInput);
minutesInput.addEventListener('input', syncFromInput);
secondsInput.addEventListener('input', syncFromInput);

/* 5. دالة البدء - بدء المؤقت */
export function start() {
    // منع بدء مؤقت آخر إذا كان يعمل بالفعل
    if (timerInterval) return;

    // تسجيل وقت البدء لأول مرة
    if (!sessionStartTime) {
        sessionStartTime = Date.now();
        pausedTime = 0;
        // حساب المدة الأصلية للجلسة
        originalDuration = isWorkSession ? 
            ((parseInt(hoursInput.value) || 0) * 3600 + (parseInt(minutesInput.value) || 0) * 60) :
            5 * 60;
    }

    // تشغيل المؤقت كل ثانية
    timerInterval = setInterval(() => {
        // التحقق من انتهاء الوقت
        if (totalSeconds <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            
            // تحديد نوع الجلسة المنتهية
            const finishedSession = isWorkSession ? "تركيز" : "استراحة";
            const actualDuration = originalDuration;
            
            // تبديل نوع الجلسة
            isWorkSession = !isWorkSession;
            
            // ضبط الوقت للجلسة التالية
            const hrs = parseInt(hoursInput.value) || 0;
            const mins = parseInt(minutesInput.value) || 0;
            const baseSeconds = (hrs * 3600) + (mins * 60);
            totalSeconds = isWorkSession ? baseSeconds : 5 * 60;

            // تحديث حالة المؤقت
            statusLabel.innerText = isWorkSession ? "وضع التركيز" : "وضع الاستراحة";
            statusLabel.style.color = isWorkSession ? "#00f2ff" : "#00ff88";
            
            // حفظ الجلسة وعرض النافذة المنبثفة
            addSessionToLog(finishedSession, actualDuration);
            sessionStartTime = null;
            pausedTime = 0;
            showPopup(finishedSession);
            updateUI();
            return;
        }
        
        // إنقاص ثانية واحدة
        totalSeconds--;
        updateUI();
    }, 1000);
}

/* 6. دالة الإيقاف - إيقاف المؤقت مؤقتاً */
export function pause() {
    // حساب الوقت المستقطع
    if (sessionStartTime) {
        const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
        pausedTime += elapsed;
    }
    // إيقاف المؤقت
    clearInterval(timerInterval);
    timerInterval = null;
}

/* 7. دالة إعادة الضبط - إعادة المؤقت للبداية */
export function reset() {
    pause();
    isWorkSession = true;
    sessionStartTime = null;
    pausedTime = 0;
    syncFromInput();
    statusLabel.innerText = "وضع التركيز";
    statusLabel.style.color = "#00f2ff";
}

/* 8. دالة مسح السجل - مسح كل الجلسات */
export function clearHistory() {
    document.getElementById("session-list").innerHTML = "";
}

/* 9. دالة حفظ الجلسة - حفظ في localStorage */
function addSessionToLog(type, actualDuration) {
    saveSessionToStorage(type, actualDuration);
}

function saveSessionToStorage(type, actualDuration) {
    // جلب الجلسات السابقة
    let sessions = JSON.parse(localStorage.getItem('pomodoroSessions')) || [];
    
    // إنشاء بيانات الجلسة الجديدة
    const sessionData = {
        type: type,
        date: new Date().toISOString(),
        timestamp: Date.now(),
        duration: actualDuration
    };
    
    // إضافة الجلسة وحفظ
    sessions.push(sessionData);
    localStorage.setItem('pomodoroSessions', JSON.stringify(sessions));
}

/* 10. دالة حساب الإحصائيات - إرجاع stats */
export function getStats() {
    const sessions = JSON.parse(localStorage.getItem('pomodoroSessions')) || [];
    const workSessions = sessions.filter(s => s.type === 'تركيز').length;
    const breakSessions = sessions.filter(s => s.type === 'استراحة').length;
    const totalSeconds = sessions.reduce((acc, s) => acc + (s.duration || 0), 0);
    const totalHours = (totalSeconds / 3600).toFixed(1);
    const streakDays = calculateStreak(sessions);
    
    return { workSessions, breakSessions, totalHours, streakDays };
}

/* 11. دالة حساب الأيام المتتالية - تتبع النشاط */
function calculateStreak(sessions) {
    if (sessions.length === 0) return 0;
    
    // استخراج التواريخ الفريدة
    const dates = [...new Set(sessions.map(s => new Date(s.date).toDateString()))].sort().reverse();
    let streak = 0;
    
    // التحقق من التتابع
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

/* التحديث الأولي عند تحميل الصفحة */
updateUI();

/* 12. النافذة المنبثقة - Popup عند انتهاء الجلسة */
// جلب عناصر النافذة
const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popup-title");
const popupMessage = document.getElementById("popup-message");
const popupBtn = document.getElementById("popup-btn");

// دالة عرض النافذة
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

// حدث زر الإغلاق
popupBtn.addEventListener("click", () => {
    popup.classList.remove("show");
});