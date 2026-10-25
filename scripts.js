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

const settingsBtn = document.querySelector(".settings-btn");
const modalOverlay = document.querySelector("#modal-overlay");
const closeModalBtn = document.querySelector(".close-modal-btn");
const saveSettingsBtn = document.querySelector(".save-settings-btn");

const pomodoroInput = document.querySelector("#pomodoro-time");
const shortInput = document.querySelector("#short-time");
const longInput = document.querySelector("#long-time");
const soundSelect = document.querySelector("#sound-select");
const alarmSounds = {
    bell: new Audio('./sounds/Bell-ring.mp3'),
    digital: new Audio('./sounds/Digital-alarm.mp3'),
    fastBell: new Audio('./sounds/Fast-bell-ring.mp3'),
    piano: new Audio('./sounds/Piano-ringtone.mp3'),
    soft: new Audio('./sounds/Soft-ringtone.mp3')
};

function loadStorage(key, fallback) {
    try {
        const value = JSON.parse(localStorage.getItem(key));
        return value ?? fallback;
    } catch {
        return fallback;
    }
}

let settings = {
    pomodoro: 25,
    short: 5,
    long: 15,
    sound: "piano",
    ...loadStorage("pomodoroSettings", {})
};
const storedTasks = loadStorage("tasks", []);
let tasks = Array.isArray(storedTasks) ? storedTasks : [];

let currentSound = alarmSounds.piano;
let currentMode = "pomodoro";
let timeSec = 1500;
let timerInterval = null;
let isRunning = false;
let endTime = null;
let completedPomodoros = 0;
let activeTaskId = tasks.length > 0 ? tasks[0].id : null;

function selectActiveTask(id) {
    activeTaskId = id;
    renderTasks();
}

function updateActiveTaskDisplay() {
    const activeTask = tasks.find(task => task.id === activeTaskId);
    if (currentMode === "pomodoro") {
        taskText.textContent = activeTask ? activeTask.text : "Time to focus!";
    }
}

function fillSettingsInputs() {
    pomodoroInput.value = settings.pomodoro;
    shortInput.value = settings.short;
    longInput.value = settings.long;
    soundSelect.value = settings.sound;
}

function applySettings() {
    currentSound = alarmSounds[settings.sound] || alarmSounds.piano;
    currentSound.volume = 0.6;

    fillSettingsInputs();

    if (!isRunning) {
        if (currentMode === "pomodoro") timeSec = settings.pomodoro * 60;
        if (currentMode === "short") timeSec = settings.short * 60;
        if (currentMode === "long") timeSec = settings.long * 60;
        showTime();
    }
}

settingsBtn.addEventListener("click", () => {
    fillSettingsInputs();
    modalOverlay.classList.remove("hidden");
});
closeModalBtn.addEventListener("click", () => modalOverlay.classList.add("hidden"));
modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) modalOverlay.classList.add("hidden");
});

saveSettingsBtn.addEventListener("click", () => {
    const clamp = (val, min, max, fallback) => {
        let num = parseInt(val, 10);
        if (isNaN(num)) return fallback;
        return Math.min(Math.max(num, min), max);
    };

    settings.pomodoro = clamp(pomodoroInput.value, 1, 90, 25);
    settings.short = clamp(shortInput.value, 1, 30, 5);
    settings.long = clamp(longInput.value, 1, 45, 15);
    settings.sound = soundSelect.value;

    localStorage.setItem("pomodoroSettings", JSON.stringify(settings));
    applySettings();
    modalOverlay.classList.add("hidden");
});

function handleNextMode() {
    if (currentMode === "pomodoro") {
        if (activeTaskId) {
            const activeTask = tasks.find(task => task.id === activeTaskId);

            if (activeTask) {
                activeTask.actPomodoros =
                    (activeTask.actPomodoros || 0) + 1;
            }
        }

        completedPomodoros++;

        if (completedPomodoros % 2 === 0) {
            sendNotification(
                "Pomodoro concluído!",
                "Você completou 4 sessões. Hora de uma pausa longa!"
            );

            setTimerMode(
                settings.long * 60,
                "long-mode",
                longBreakBtn,
                "long"
            );
        } else {
            sendNotification(
                "Pomodoro concluído!",
                "Hora de fazer uma pausa curta."
            );

            setTimerMode(
                settings.short * 60,
                "short-mode",
                shortBreakBtn,
                "short"
            );
        }

        startTimer();

    } else {
        sendNotification(
            "Pausa finalizada!",
            "Hora de focar novamente!"
        );

        setTimerMode(
            settings.pomodoro * 60,
            "",
            pomodoroBtn,
            "pomodoro"
        );
    }
    renderTasks();
}

applySettings();

function showTime() {
    const minutes = Math.floor(timeSec / 60);
    const seconds = timeSec % 60;
    const minutesFormatted = String(minutes).padStart(2, '0');
    const secondsFormatted = String(seconds).padStart(2, '0');
    const formattedTime = `${minutesFormatted}:${secondsFormatted}`;

    timer.textContent = formattedTime;
    document.title = `${formattedTime} - ${taskText ? taskText.textContent : 'Pomodoro'}`;
}

function startTimer() {
    if (!isRunning) {
        requestNotificationPermission();
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

function playAlarm() {
    currentSound.currentTime = 0;
    currentSound.play().catch(err => console.warn("Não foi possível tocar o alarme:", err));
}

function setTimerMode(seconds, modeClass, clickedBtn, mode) {
    clearInterval(timerInterval);
    isRunning = false;

    startBtn.textContent = "start";
    startBtn.classList.remove("pressed");

    timeSec = seconds;
    currentMode = mode;

    document.body.classList.remove("short-mode", "long-mode");

    if (modeClass) {
        document.body.classList.add(modeClass);
    }

    setActiveButton(clickedBtn);

    if (mode === "short" || mode === "long") {
        taskText.textContent = "Time for a break!";
    } else {
        updateActiveTaskDisplay();
    }

    showTime();
}

pomodoroBtn.addEventListener("click", () => setTimerMode(settings.pomodoro * 60, "", pomodoroBtn, "pomodoro"));
shortBreakBtn.addEventListener("click", () => setTimerMode(settings.short * 60, "short-mode", shortBreakBtn, "short"));
longBreakBtn.addEventListener("click", () => setTimerMode(settings.long * 60, "long-mode", longBreakBtn, "long"));

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
});

cancelBtn.addEventListener("click", () => {
    addTaskForm.classList.add("hidden");
    addTaskBtn.classList.remove("hidden");
    taskInput.value = "";
});

saveBtn.addEventListener("click", createNewTask);

taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        createNewTask();
    }
});

function createNewTask() {
    let taskContent = taskInput.value.trim();
    if (taskContent !== "") {
        const newTask = {
            id: Date.now(),
            text: taskContent,
            completed: false,
            actPomodoros: 0
        };

        tasks.push(newTask);

        if (!activeTaskId) {
            activeTaskId = newTask.id;
        }

        renderTasks();
        addTaskForm.classList.add("hidden");
        addTaskBtn.classList.remove("hidden");
        taskInput.value = "";
    }
}

function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach(task => {
        const taskItem = document.createElement("div");
        taskItem.classList.add("task-item");

        if (task.id === activeTaskId) {
            taskItem.classList.add("active-task");
        }

        if (task.completed) {
            taskItem.classList.add("completed");
        }

        const taskInfo = document.createElement("div");
        taskInfo.classList.add("task-info");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        const taskName = document.createElement("span");
        taskName.textContent = task.text;

        taskInfo.appendChild(checkbox);
        taskInfo.appendChild(taskName);

        const taskRight = document.createElement("div");
        taskRight.classList.add("task-right");

        const pomodoroCount = document.createElement("span");
        pomodoroCount.classList.add("pomodoro-count");
        pomodoroCount.textContent = task.actPomodoros || 0;

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-task-btn");
        deleteBtn.textContent = "✕";

        taskRight.appendChild(pomodoroCount);
        taskRight.appendChild(deleteBtn);

        taskItem.appendChild(taskInfo);
        taskItem.appendChild(taskRight);

        taskItem.addEventListener("click", () => {
            selectActiveTask(task.id);
        });

        checkbox.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleTask(task.id);
        });

        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            deleteTask(task.id);
        });

        taskList.appendChild(taskItem);
    });

    updateActiveTaskDisplay();
    saveTasks();
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

    if (activeTaskId === id) {
        activeTaskId = tasks.length > 0 ? tasks[0].id : null;
    }

    renderTasks();
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function requestNotificationPermission() {
    if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
    }
}

function sendNotification(title, bodyText) {
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification(title, {
            body: bodyText
        });
    }
}

showTime();
renderTasks();
