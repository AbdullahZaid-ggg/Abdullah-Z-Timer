import { start, pause, reset, clearHistory } from './timerLogic.js';

document.getElementById("start").addEventListener("click", start);
document.getElementById("pause").addEventListener("click", pause);
document.getElementById("reset").addEventListener("click", reset);
document.getElementById("clear-history").addEventListener("click", clearHistory);