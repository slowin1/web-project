// navigation clock with blinking colon
const clockEl = document.querySelector(".nav-clock p");
const colonEl = clockEl?.querySelector("span");
let clockInterval = window.__navClockInterval;
let blinkInterval = window.__navBlinkInterval;

function getTimeParts() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const timeZone =
    Intl.DateTimeFormat(undefined, { timeZoneName: "short" })
      .formatToParts(now)
      .find((part) => part.type === "timeZoneName")?.value || "";

  return { hours, minutes, timeZone };
}

function updateClock() {
  if (!clockEl) return;
  const { hours, minutes, timeZone } = getTimeParts();
  clockEl.childNodes[0].textContent = `${hours} `;
  clockEl.childNodes[2].textContent = ` ${minutes} ${timeZone}`;
}

function blinkColon() {
  if (!colonEl) return;
  colonEl.style.visibility =
    colonEl.style.visibility === "hidden" ? "visible" : "hidden";
}

if (clockInterval) clearInterval(clockInterval);
if (blinkInterval) clearInterval(blinkInterval);

updateClock();
window.__navClockInterval = setInterval(updateClock, 1000);
window.__navBlinkInterval = setInterval(blinkColon, 500);
