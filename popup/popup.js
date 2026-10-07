const DEFAULT_SETTINGS = {
  enabled: true,
  intervalMinutes: 3,
  displaySeconds: 10,
  position: "bottom-right"
};

const enabled = document.getElementById("enabled");
const intervalMinutes = document.getElementById("intervalMinutes");
const displaySeconds = document.getElementById("displaySeconds");
const position = document.getElementById("position");
const statusText = document.getElementById("statusText");
const saveStatus = document.getElementById("saveStatus");
const testReminder = document.getElementById("testReminder");

function updateStatus() {
  const value = Number(intervalMinutes.value);
  statusText.textContent = enabled.checked
    ? `Every ${value} minute${value === 1 ? "" : "s"}`
    : "Reminders paused";
}

async function loadSettings() {
  const { settings } = await chrome.storage.local.get("settings");
  const data = { ...DEFAULT_SETTINGS, ...(settings || {}) };

  enabled.checked = Boolean(data.enabled);
  intervalMinutes.value = String(data.intervalMinutes);
  displaySeconds.value = String(data.displaySeconds);
  position.value = data.position || "bottom-right";

  updateStatus();
}

async function saveSettings() {
  const { settings } = await chrome.storage.local.get("settings");

  const next = {
    ...(settings || {}),
    enabled: enabled.checked,
    intervalMinutes: Number(intervalMinutes.value),
    displaySeconds: Number(displaySeconds.value),
    position: position.value
  };

  await chrome.storage.local.set({ settings: next });

  updateStatus();
  saveStatus.textContent = "Settings saved";
  setTimeout(() => { saveStatus.textContent = ""; }, 1200);
}

[enabled, intervalMinutes, displaySeconds, position].forEach((element) => {
  element.addEventListener("change", saveSettings);
});

testReminder.addEventListener("click", async () => {
  await chrome.runtime.sendMessage({ type: "TEST_REMINDER" });
  saveStatus.textContent = "Test reminder sent";
  setTimeout(() => { saveStatus.textContent = ""; }, 1200);
});

loadSettings();