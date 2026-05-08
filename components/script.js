/* 
   script.js - معالجة أحداث الصفحة
   ============================================
   هذا الملف يتعامل مع أحداث الأزرار والتفاعل مع المستخدم
   ============================================
*/

/* استيراد الدوال من ملف timerLogic.js */
import { start, pause, reset, clearHistory } from './timerLogic.js';

/* ربط الأزرار بالدوال المناسبة */

/* زر البدء - تشغيل المؤقت */
document.getElementById("start").addEventListener("click", start);

/* زر الإيقاف - إيقاف المؤقت مؤقتاً */
document.getElementById("pause").addEventListener("click", pause);

/* زر إعادة الضبط - إعادة المؤقت للبداية */
document.getElementById("reset").addEventListener("click", reset);

/* زر مسح السجل - مسح كل الجلسات المخزنة */
document.getElementById("clear-history").addEventListener("click", clearHistory);