/*
  Star firework customization:
  - Change STAR_COLORS to control the burst colors.
  - Change starCount or the Stars input to add/remove stars per click.
  - Change burstSpeedMs or the Speed input to make the animation faster or slower.
  - Change MIN_DISTANCE and maxDistance or the Spread input to control how far stars travel.
*/
const STAR_COLORS = ["#f0abfc", "#93c5fd", "#67e8f9", "#fde68a", "#86efac", "#fda4af"];
let starCount = 22;
let burstSpeedMs = 2000;
const MIN_DISTANCE = 50;
let maxDistance = 150;

const hoursInput = document.getElementById("hours");
const minutesInput = document.getElementById("minutes");
const secondsInput = document.getElementById("seconds");
const timeDisplay = document.getElementById("timeDisplay");
const modeLabel = document.getElementById("modeLabel");
const timerRing = document.getElementById("timerRing");
const startPauseBtn = document.getElementById("startPauseBtn");
const resetBtn = document.getElementById("resetBtn");
const clearBtn = document.getElementById("clearBtn");
const presetButtons = document.querySelectorAll(".preset");
const starCountInput = document.getElementById("starCountInput");
const burstSpeedInput = document.getElementById("burstSpeedInput");
const spreadInput = document.getElementById("spreadInput");
const colorPreview = document.getElementById("colorPreview");

let totalSeconds = 25 * 60;
let remainingSeconds = totalSeconds;
let timerId = null;
let isRunning = false;

function clamp(value, min, max) {
  const number = Number(value);
  if (Number.isNaN(number)) return min;
  return Math.min(Math.max(Math.floor(number), min), max);
}

function createStarBurst(x, y) {
  for (let i = 0; i < starCount; i += 1) {
    const star = document.createElement("span");
    const angle = Math.random() * Math.PI * 2;
    const distance = MIN_DISTANCE + Math.random() * (maxDistance - MIN_DISTANCE);
    const starX = Math.cos(angle) * distance;
    const starY = Math.sin(angle) * distance;
    const color = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
    const size = 9 + Math.random() * 10;

    star.className = "star-particle";
    star.style.left = `${x}px`;
    star.style.top = `${y}px`;
    star.style.setProperty("--x", `${starX}px`);
    star.style.setProperty("--y", `${starY}px`);
    star.style.setProperty("--star-color", color);
    star.style.setProperty("--star-size", `${size}px`);
    star.style.setProperty("--burst-speed", `${burstSpeedMs}ms`);

    document.body.appendChild(star);

    window.setTimeout(() => {
      star.remove();
    }, burstSpeedMs);
  }
}

function getInputSeconds() {
  const hours = Math.max(0, Number(hoursInput.value) || 0);
  const minutes = Math.max(0, Number(minutesInput.value) || 0);
  const seconds = Math.max(0, Number(secondsInput.value) || 0);

  return Math.floor(hours * 3600 + minutes * 60 + seconds);
}

function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function updateProgressRing() {
  const progress = totalSeconds === 0 ? 0 : (remainingSeconds / totalSeconds) * 360;
  timerRing.style.background = `conic-gradient(var(--primary) ${progress}deg, rgba(255, 255, 255, 0.13) ${progress}deg)`;
}

function updateDisplay() {
  timeDisplay.textContent = formatTime(remainingSeconds);
  updateProgressRing();
}

function setInputsFromSeconds(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  hoursInput.value = hrs;
  minutesInput.value = mins;
  secondsInput.value = secs;
}

function syncTimerFromInputs() {
  totalSeconds = getInputSeconds();
  remainingSeconds = totalSeconds;
  updateDisplay();
  clearBtn.classList.toggle("hidden", totalSeconds === 0);
}

function setRunningState(running) {
  isRunning = running;
  startPauseBtn.textContent = running ? "Pause" : "Start";
  modeLabel.textContent = running ? "Running" : "Ready";

  [hoursInput, minutesInput, secondsInput, ...presetButtons].forEach((element) => {
    element.disabled = running;
    element.style.opacity = running ? "0.55" : "1";
    element.style.cursor = running ? "not-allowed" : "pointer";
  });
}

function startTimer() {
  if (isRunning) return;

  if (remainingSeconds <= 0) {
    syncTimerFromInputs();
  }

  if (remainingSeconds <= 0) {
    modeLabel.textContent = "Needs Time";
    return;
  }

  setRunningState(true);

  timerId = setInterval(() => {
    remainingSeconds -= 1;
    updateDisplay();

    if (remainingSeconds <= 0) {
      clearInterval(timerId);
      timerId = null;
      setRunningState(false);
      modeLabel.textContent = "Complete";
      startPauseBtn.textContent = "Start Again";
      timerRing.style.background = "conic-gradient(var(--success) 360deg, rgba(255, 255, 255, 0.13) 360deg)";
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerId);
  timerId = null;
  setRunningState(false);
  modeLabel.textContent = "Paused";
}

function resetTimer() {
  clearInterval(timerId);
  timerId = null;
  remainingSeconds = totalSeconds;
  updateDisplay();
  setRunningState(false);
  modeLabel.textContent = "Ready";
}

function clearTimer() {
  clearInterval(timerId);
  timerId = null;
  totalSeconds = 0;
  remainingSeconds = 0;
  setInputsFromSeconds(0);
  updateDisplay();
  setRunningState(false);
  modeLabel.textContent = "Ready";
  clearBtn.classList.add("hidden");
}

function renderColorPreview() {
  colorPreview.innerHTML = "";

  STAR_COLORS.forEach((color) => {
    const dot = document.createElement("span");
    dot.className = "color-dot";
    dot.style.background = color;
    dot.style.color = color;
    colorPreview.appendChild(dot);
  });
}

function updateFireworkOptions() {
  starCount = clamp(starCountInput.value, 5, 80);
  burstSpeedMs = clamp(burstSpeedInput.value, 300, 5000);
  maxDistance = clamp(spreadInput.value, 40, 300);
}

document.addEventListener("click", (event) => {
  createStarBurst(event.clientX, event.clientY);
});

startPauseBtn.addEventListener("click", () => {
  if (isRunning) {
    pauseTimer();
  } else {
    startTimer();
  }
});

resetBtn.addEventListener("click", resetTimer);
clearBtn.addEventListener("click", clearTimer);

[hoursInput, minutesInput, secondsInput].forEach((input) => {
  input.addEventListener("input", () => {
    if (!isRunning) {
      syncTimerFromInputs();
      modeLabel.textContent = "Ready";
    }
  });
});

presetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const minutes = Number(button.dataset.minutes);
    totalSeconds = minutes * 60;
    remainingSeconds = totalSeconds;
    setInputsFromSeconds(totalSeconds);
    updateDisplay();
    clearBtn.classList.remove("hidden");
    modeLabel.textContent = "Ready";
  });
});

[starCountInput, burstSpeedInput, spreadInput].forEach((input) => {
  input.addEventListener("input", updateFireworkOptions);
});

renderColorPreview();
updateFireworkOptions();
syncTimerFromInputs();
