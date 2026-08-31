const startBtn = document.querySelector(".start-btn");
const timer = document.querySelector("#timer");
const pomodoroBtn = document.querySelector(".pomodoro-btn");
const shortBreakBtn = document.querySelector(".short-btn");
const longBreakBtn = document.querySelector(".long-btn");
const taskText = document.querySelector(".task-text");
let timeSec = 1500;
let timerInterval = null;
let isRunning = false;

//Função para mostrar o tempo no formato mm:ss
function showTime() {
    const minutes = Math.floor(timeSec/60);
    const seconds = timeSec % 60;
    const minutesFormatted = String(minutes).padStart(2, '0');
    const secondsFormatted = String(seconds).padStart(2, '0');
    timer.textContent = `${minutesFormatted}:${secondsFormatted}`;
    const formattedTime = `${minutesFormatted}:${secondsFormatted}`;
    timer.textContent = formattedTime;
    document.title = `${formattedTime} - ${taskText ? taskText.textContent : 'Pomodoro'}`;
}

//Funcão para iniciar e pausar o timer
function startTimer() {
    if (!isRunning) {
        isRunning = true;
        startBtn.textContent = "pause";
        startBtn.classList.add("pressed");
        timerInterval = setInterval(() => {
            if (timeSec > 0) {
                timeSec --;
                showTime();
            } else {
                clearInterval(timerInterval);
                isRunning = false;
                startBtn.textContent = "start";
                startBtn.classList.remove("pressed");
            }
        }, 1000);

    } else {
        isRunning = false;
        clearInterval(timerInterval);
        startBtn.textContent = "start";
        startBtn.classList.remove("pressed");
    }
}
startBtn.addEventListener("click", startTimer);

// function setPomodoro() {
//     clearInterval(timerInterval);
//     isRunning = false;
//     startBtn.textContent = "start";
//     timeSec = 1500;
//     showTime();
// }
// pomodoroBtn.addEventListener("click", setPomodoro);

// function setShortBreak() {
//     clearInterval(timerInterval);
//     isRunning = false
//     startBtn.textContent = "start";
//     timeSec = 300;
//     showTime();
// }
// shortBreakBtn.addEventListener("click", setShortBreak);

// function setLongBreak() {
//     clearInterval(timerInterval);
//     isRunning = false;
//     startBtn.textContent = "start";
//     timeSec = 900;
//     showTime();
// }
// longBreakBtn.addEventListener("click", setLongBreak);

function setTimerMode(seconds, modeClass, clickedBtn) {
    clearInterval(timerInterval);
    isRunning = false;
    startBtn.textContent = "start";
    timeSec = seconds;
    showTime();
    document.body.classList.remove("short-mode", "long-mode");
    if (modeClass) {
        document.body.classList.add(modeClass);
    }
    setActiveButton(clickedBtn);
    if (clickedBtn === shortBreakBtn || clickedBtn === longBreakBtn) {
        taskText.textContent = "Time for a break!";
    } else {
        taskText.textContent = "Time to focus!";
    }
    showTime();
}
pomodoroBtn.addEventListener("click", () => setTimerMode(1500, "", pomodoroBtn));
shortBreakBtn.addEventListener("click", () => setTimerMode(300, "short-mode", shortBreakBtn));
longBreakBtn.addEventListener("click", () => setTimerMode(900, "long-mode", longBreakBtn));

function setActiveButton(clickedBtn) {
    pomodoroBtn.classList.remove("active");
    shortBreakBtn.classList.remove("active");
    longBreakBtn.classList.remove("active");
    clickedBtn.classList.add("active");
}
pomodoroBtn.classList.add("active");