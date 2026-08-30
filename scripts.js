const startBtn = document.querySelector(".start-btn");
const timer = document.querySelector("#timer");
let timeSec = 1500;
let timerInterval = null;
let isRunning = false;

function showTime() {
    const minutes = Math.floor(timeSec/60);
    const seconds = timeSec % 60;
    const minutesFormatted = String(minutes).padStart(2, '0');
    const secondsFormatted = String(seconds).padStart(2, '0');
    timer.textContent = `${minutesFormatted}:${secondsFormatted}`;
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        startBtn.textContent = "pause";
        timerInterval = setInterval(() => {
            if (timeSec > 0) {
                timeSec --;
                showTime();
            } else {
                clearInterval(timerInterval);
                isRunning = false;
                startBtn.textContent = "start";
            }
        }, 1000);

    } else {
        isRunning = false;
        clearInterval(timerInterval);
        startBtn.textContent = "start";
    }
}
startBtn.addEventListener("click", startTimer);