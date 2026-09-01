const startBtn = document.querySelector(".start-btn");
const timer = document.querySelector("#timer");
const pomodoroBtn = document.querySelector(".pomodoro-btn");
const shortBreakBtn = document.querySelector(".short-btn");
const longBreakBtn = document.querySelector(".long-btn");
const taskText = document.querySelector(".task-text");
const addTaskBtn = document.querySelector(".add-task-btn");
const addTaskForm = document.querySelector(".add-task-form");
const cancelBtn = document.querySelector(".cancel-btn");
const saveBtn = document.querySelector(".save-btn");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector(".tasks-list");
const alarmSounds = {
    bell: new Audio('./sounds/Bell-ring.mp3'),
    digital: new Audio('./sounds/Digital-alarm.mp3'),
    fastBell: new Audio('./sounds/Fast-bell-ring.mp3'),
    piano: new Audio('./sounds/Piano-ringtone.mp3'),
    soft: new Audio('./sounds/Soft-ringtone.mp3')
};
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentSound = alarmSounds.piano;
let currentMode = "pomodoro";
let timeSec = 1500;
let timerInterval = null;
let isRunning = false;
let endTime = null;

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

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        startBtn.textContent = "pause";
        startBtn.classList.add("pressed");
        endTime = Date.now() + (timeSec * 1000);

        timerInterval = setInterval(() => {
            const remainingMs = endTime - Date.now();
            timeSec = Math.ceil(remainingMs / 1000);

            if (timeSec > 0) {
                showTime();
            } else {
                timeSec = 0;
                showTime();
                clearInterval(timerInterval);
                isRunning = false;
                startBtn.textContent = "start";
                startBtn.classList.remove("pressed");
                playAlarm();
                handleNextMode();
            }
        }, 1000);

    } else {
        clearInterval(timerInterval);
        isRunning = false;
        startBtn.textContent = "start";
        startBtn.classList.remove("pressed");
    }
}
startBtn.addEventListener("click", startTimer);

currentSound.volume = 0.6;
function playAlarm() {
    currentSound.currentTime = 0;
    currentSound.play();
}

function handleNextMode() {
    if (currentMode === "pomodoro") {
        setTimerMode(300, "short-mode", shortBreakBtn, "short");
        startTimer(); // Inicia o tempo de pausa automaticamente
    } else if (currentMode === "short") {
        setTimerMode(1500, "", pomodoroBtn, "pomodoro");
    } else {
        setTimerMode(1500, "", pomodoroBtn, "pomodoro");
    }
}

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

function setTimerMode(seconds, modeClass, clickedBtn, mode) {
    clearInterval(timerInterval);
    isRunning = false;
    startBtn.textContent = "start";
    timeSec = seconds;
    currentMode = mode;
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
pomodoroBtn.addEventListener("click", () => setTimerMode(1500, "", pomodoroBtn, "pomodoro"));
shortBreakBtn.addEventListener("click", () => setTimerMode(300, "short-mode", shortBreakBtn, "short"));
longBreakBtn.addEventListener("click", () => setTimerMode(900, "long-mode", longBreakBtn, "long"));

function setActiveButton(clickedBtn) {
    pomodoroBtn.classList.remove("active");
    shortBreakBtn.classList.remove("active");
    longBreakBtn.classList.remove("active");
    clickedBtn.classList.add("active");
}
pomodoroBtn.classList.add("active");

addTaskBtn.addEventListener("click", () => {
    addTaskForm.classList.remove("hidden");
    addTaskBtn.classList.add("hidden");
    taskInput.focus();
})

cancelBtn.addEventListener("click", () => {
    addTaskForm.classList.add("hidden");
    addTaskBtn.classList.remove("hidden");
    taskInput.value = "";
})

saveBtn.addEventListener("click", createNewTask);

function createNewTask() {
    let taskContent = taskInput.value.trim();
    if (taskContent !== "") {
        const newTask = {
            id: Date.now(),
            text: taskContent,
            completed: false
        }
        tasks.push(newTask);
        renderTasks();
        addTaskForm.classList.add("hidden");
        addTaskBtn.classList.remove("hidden");
        taskInput.value = "";
    } else {

    }
}

function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach(task => {
        const taskItem = document.createElement("div");
        taskItem.classList.add("task-item");

        taskItem.innerHTML = `
            <div class="task-info">
                <input type="checkbox" ${task.completed ? "checked" : ""}>
                <span>${task.text}</span>
            </div>
            <button class="delete-task-btn">✕</button>
        `;
        if(task.completed) {
            taskItem.classList.add("completed");
        };

        taskItem.querySelector(".task-info").addEventListener("click", () => {
            toggleTask(task.id);
        });

        taskItem.querySelector(".delete-task-btn").addEventListener("click", (e) => {
            e.stopPropagation();
            deleteTask(task.id);
        });
        taskList.appendChild(taskItem);
    });
    saveTask();
}

function toggleTask(id) {
    tasks.forEach(task => {
        if (task.id === id) {
            task.completed = !task.completed;
        }
    });
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
}

function saveTask() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}