# 🍅 Abdullah Z Timer - مؤقت بومودورو

<div align="center">

![GitHub stars](https://img.shields.io/github/stars/AbdullahZaid-ggg/Abdullah-Z-Timer)
![GitHub forks](https://img.shields.io/github/forks/AbdullahZaid-ggg/Abdullah-Z-Timer)
![GitHub issues](https://img.shields.io/github/issues/AbdullahZaid-ggg/Abdullah-Z-Timer)
![License](https://img.shields.io/github/license/AbdullahZaid-ggg/Abdullah-Z-Timer)

</div>

---

## 📋 فهرس المحتويات | תוכן עניינים | Table of Contents

- [حول المشروع | על הפרויקט | About the Project](#about)
- [المميزات | תכונות | Features](#features)
- [البدء السريع | התחלה מהירה | Quick Start](#quick-start)
- [هيكل المشروع | מבנה הפרויקט | Project Structure](#structure)
- [كيفية العمل | איך זה עובד | How It Works](#how-it-works)
- [الصفحات | דפים | Pages](#pages)
- [التقنيات المستخدمة | טכנולוגיות | Technologies](#technologies)
- [المساهمة | תרומה | Contributing](#contributing)
- [الرخصة | רישיון | License](#license)

---

## 🍎حول المشروع | על הפרויקט | About the Project

**Abdullah Z Timer** هو تطبيق ويب حديث لمؤقت بومودورو (Pomodoro Timer) مصمم لمساعدتك على زيادة إنتاجيتك وتحسين إدارة وقتك. يعتمد على تقنية بومودورو المعروفة التي تستخدم فترات عمل قصيرة متقطعة لفترات استراحة قصيرة.

هذا المشروع يدعم **ثلاث لغات**: العربية، العبرية، والإنجليزية، مما يجعله متاحاً لمستخدمين متنوعة في المنطقة.

---

## ⭐ المميزات | התכונות | Features

### 🎯 المؤقت الأساسي | הטיימר הבסיסי | Core Timer
- ⏱️ مؤقت قابل للتخصيص (ساعات، دقائق، ثوانٍ)
- 🔄 تبديل تلقائي بين وضع التركيز والاستراحة
- ⏯️ أزرار بدء، إيقاف، وإعادة الضبط
- 🔔 إشعارات عند انتهاء كل جلسة

### 📊 صفحة الإحصائيات | דף הסטטיסטיקות | Analytics Page
- 📈 أربعة بطاقات إحصائية: جلسات العمل، جلسات الاستراحة، إجمالي الدقائق، الأيام المتتالية
- 📊 ثلاثة أنواع من الرسوم البيانية:
  - 📊 شريطي أسبوعي (أخر 7 أيام)
  - 📈 خطي للإنتاجية (أخر 14 يوماً)
  - 🥧 دائري للنسبة بين الجلسات
- 📋 سجل تفصيلي للجلسات مع إمكانية الحذف

### 💾 التخزين المحلي | אחסון מקומי | Local Storage
- ✅ حفظ جميع الجلسات في localStorage
- ✅ الاحتفاظ بالبيانات حتى بعد إغلاق المتصفح
- ✅ إمكانية مسح السجل بالكامل

### 🎨 التصميم | העיצוב | Design
- 🌙 وضع ليلي داكن بالكامل
- ✨ تأثيرات زجاجية (Glassmorphism)
- 📱 تصميم متجاوب يعمل على جميع الأجهزة
- 🎯 ألوان متوهجة (أزرق سيان + بنفسجي)

### 🌐 دعم اللغات | תמיכה בשפות | Language Support
- 🇸🇦 العربية (RTL)
- 🇮🇱 العبرية (RTL)
- 🇺🇸 الإنجليزية (LTR)

---

## 🚀البدء السريع | התחלה מהירה | Quick Start

### الطريقة الأولى: تشغيل مباشر | דרך ראשונה: הרצה ישירה | Method 1: Direct Run

فقط افتح ملف `index.html` في متصفحك المفضل:

```bash
# مجلد الإصدار العربي
Arabic-Version/index.html

# مجلد الإصدار الإنجليزي
English-Version/index.html

# مجلد الإصدار العبري
Hebrew-Version/index.html
```

### الطريقة الثانية: استخدام خادم محلي | דרך שנייה: שרת מקומי | Method 2: Local Server

```bash
# باستخدام Python
python -m http.server 8000

# باستخدام Node.js
npx serve

# باستخدام PHP
php -S localhost:8000
```

ثم افتح `http://localhost:8000/Arabic-Version/index.html`

---

## 📁 هيكل المشروع | מבנה הפרויקט | Project Structure

```
Pomodoro Timer/
├── Arabic-Version/           # الإصدار العربي
│   ├── index.html           # الصفحة الرئيسية (المؤقت)
│   ├── analytics.html       # صفحة الإحصائيات
│   ├── about.html           # صفحة من نحن
│   ├── contact.html         # صفحة تواصل معنا
│   ├── css/
│   │   └── style.css        # ملف التنسيقات
│   └── js/
│       ├── main.js          # نقطة الدخول
│       └── modules/
│           └── timerLogic.js # منطق المؤقت
│
├── English-Version/          # الإصدار الإنجليزي (نفس البنية)
│   └── ...
│
├── Hebrew-Version/           # الإصدار العبري (نفس البنية)
│   └── ...
│
└── README.md                 # هذا الملف
```

---

## ⚙️كيفية العمل | איך זה עובד | How It Works

### 1. المؤقت | הטיימר | The Timer

```javascript
// في timerLogic.js
let timerInterval = null;      // تخزين المؤقت
let isWorkSession = true;      // نوع الجلسة الحالية
let totalSeconds = 25 * 60;    // الوقت الافتراضي (25 دقيقة)
```

**دوال التحكم الرئيسية:**
- `start()` - بدء المؤقت
- `pause()` - إيقاف المؤقت مؤقتاً
- `reset()` - إعادة ضبط المؤقت

### 2. حفظ البيانات | שמירת נתונים | Data Storage

```javascript
// عند انتهاء كل جلسة
const sessionData = {
    type: "تركيز",             // نوع الجلسة
    date: new Date().toISOString(),
    duration: 1500,           // المدة بالثواني
    timestamp: Date.now()
};

// الحفظ في localStorage
localStorage.setItem('pomodoroSessions', JSON.stringify(sessions));
```

### 3. الإحصائيات | סטטיסטיקות | Analytics

- يتم حساب الإحصائيات من البيانات المخزنة
- Streak (الأيام المتتالية) يحسب بتتبع التواريخ الفريدة
- الرسوم البيانية تستخدم مكتبة Chart.js

---

## 📄الصفحات | דפים | Pages

### 1. الصفحة الرئيسية (المؤقت) | הדף הראשי | Main Timer Page
- إعدادات الوقت (ساعات، دقائق، ثوانٍ)
- عرض المؤقت الكبير
- أزرار التحكم (ابدأ، إيقاف، إعادة)
- إشعار منبثق عند انتهاء الجلسة

### 2. صفحة الإحصائيات | דף הסטטיסטיקות | Analytics Page
- بطاقات الإحصائيات
- ثلاثة رسوم بيانية
- سجل الجلسات

### 3. صفحة من نحن | דף אודות | About Page
- معلومات عن المشروع
- قائمة المميزات
- معلومات عن المطور

### 4. صفحة تواصل معنا | דף צור קשר | Contact Page
- رابط GitHub
- البريد الإلكتروني
- لينكد إن

---

## 🛠️ التقنيات المستخدمة | טכנולוגיות | Technologies

| التقنية | הטכנולוגיה | Technology | الاستخدام | השימוש | Usage |
|--------|------------|-------------|-----------|--------|-------|
| HTML5 | HTML5 | HTML | بناء الصفحات | בניית הדפים | Structure |
| CSS3 | CSS3 | CSS | التنسيق والتصميم | עיצוב וסגנון | Styling |
| JavaScript (ES6+) | JavaScript | JavaScript | المنطق والتفاعل | לוגיקה ואינטראקציה | Logic |
| Chart.js | Chart.js | Chart.js | الرسوم البيانية | גרפים | Charts |
| Font Awesome | Font Awesome | Font Awesome | الأيقونات | אייקונים | Icons |
| LocalStorage | LocalStorage | LocalStorage | تخزين البيانات | אחסון נתונים | Data |
| ES6 Modules | ES6 Modules | ES6 Modules | تنظيم الكود | ארגון קוד | Code organization |

---

## 🎨 لوحة الألوان | פלטת הצבעים | Color Palette

```css
:root {
    --primary: #00f2ff;      /* Cyan - التركيز */
    --accent: #7000ff;       /* Purple - التميز */
    --break: #00ff88;        /* Green - الاستراحة */
    --bg: #020617;           /* Dark Blue - الخلفية */
    --glass: rgba(15, 23, 42, 0.9); /* الزجاج */
}
```

---

## 🤝 المساهمة | תרומה | Contributing

المساهمات مرحب بها! اتبع هذه الخطوات:

1. 🍴 انسخ المشروع (Fork)
2. 🌿 أنشئ فرعاً جديداً (`git checkout -b feature/amazing`)
3. ✓ أجري التغييرات
4. 📝 اثبت التغييرات (`git commit -m 'Add amazing feature'`)
5. ⬆️ ارفع التغييرات (`git push origin feature/amazing`)
6. 🔄 أنشئ طلب سحب (Pull Request)

---

## 📝 التاريخ | היסטוריית שינויים | Changelog

### الإصدار 1.0.0 (الحالي)
- ✅ إنشاء المشروع
- ✅ دعم ثلاث لغات (عربي، عبري، إنجليزي)
- ✅ مؤقت بومودورو مع إشعارات
- ✅ صفحة إحصائيات مع 3 رسوم بيانية
- ✅ تخزين محلي للجلسات
- ✅ تصميم زجاجي داكن متجاوب

---

## 📄 الرخصة | רישיון | License

هذا المشروع مرخص تحت [MIT License](LICENSE).

---

## 👨‍💻 المطور | המפתח | Developer

تم تطوير هذا المشروع بـ ❤️ بواسطة:

- **عبد الله زيد** | **Abdullah Zaid**
- GitHub: [AbdullahZaid-ggg](https://github.com/AbdullahZaid-ggg)
- Email: abdallazeed3@gmail.com
- LinkedIn: [Abdullah Zaid](https://www.linkedin.com/in/abdalla-zaid-81926439b)

---

<div align="center">

⭐ إذا أعجبك المشروع، لا تنس إعطاءه نجمة! ⭐

</div>

---

*ملاحظة: هذا الملف متوفر أيضاً بـ [English](README.md) و [עברית](Hebrew-Version/README.md)*