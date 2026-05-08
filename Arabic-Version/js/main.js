/* 
    main.js - Entry point for the application
    Loads modules and handles navigation
*/

import { start, pause, reset } from './modules/timerLogic.js';

document.getElementById("start")?.addEventListener("click", start);
document.getElementById("pause")?.addEventListener("click", pause);
document.getElementById("reset")?.addEventListener("click", reset);

document.getElementById('nav-toggle')?.addEventListener('click', function() {
    document.querySelector('.nav-links')?.classList.toggle('show');
});