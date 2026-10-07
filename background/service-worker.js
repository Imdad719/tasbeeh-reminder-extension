const ALARM_NAME = "tasbeeh-reminder-reminder";

const DEFAULT_SETTINGS = {
  enabled: true,
  intervalMinutes: 3,
  displaySeconds: 10,
  position: "bottom-right",
  messages: [
    {
      arabic: "أَسْتَغْفِرُ اللَّهَ",
      transliteration: "Astaghfirullah",
      meaning: "I seek forgiveness from Allah."
    },
    {
      arabic: "سُبْحَانَ اللَّهِ",
      transliteration: "SubhanAllah",
      meaning: "Glory be to Allah."
    },
    {
      arabic: "الْحَمْدُ لِلَّهِ",
      transliteration: "Alhamdulillah",
      meaning: "All praise belongs to Allah."
    },
    {
      arabic: "اللَّهُ أَكْبَرُ",
      transliteration: "Allahu Akbar",
      meaning: "Allah is the Greatest."
    },
    {
      arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ",
      transliteration: "La ilaha illallah",
      meaning: "There is no deity worthy of worship except Allah."
    },
    {
      arabic: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَىٰ مُحَمَّدٍ",
      transliteration: "Allahumma salli wa sallim ala Muhammad",
      meaning: "O Allah, send blessings and peace upon Muhammad."
    }
  ]
};

async function getSettings() {
  const stored = await chrome.storage.local.get("settings");
  return { ...DEFAULT_SETTINGS, ...(stored.settings || {}) };
}

async function createOrUpdateAlarm() {
  const settings = await getSettings();

  await chrome.alarms.clear(ALARM_NAME);

  if (!settings.enabled) {
    console.log("Tasbeeh Reminder is disabled.");
    return;
  }

  const interval = Math.max(
    1,
    Number(settings.intervalMinutes) || 3
  );

  await chrome.alarms.create(ALARM_NAME, {
    delayInMinutes: interval,
    periodInMinutes: interval
  });

  console.log(
    `Tasbeeh Reminder will appear every ${interval} minute(s).`
  );
}

async function ensureDefaults() {
  const { settings } = await chrome.storage.local.get("settings");

  if (!settings) {
    await chrome.storage.local.set({ settings: DEFAULT_SETTINGS });
  }
}

async function showReminderOnTabs() {
  const settings = await getSettings();

  if (!settings.enabled) {
    return;
  }

  const tabs = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  const tab = tabs[0];

  if (!tab?.id) {
    return;
  }

  try {
    await chrome.tabs.sendMessage(tab.id, {
      type: "SHOW_REMINDER",
      settings
    });

    console.log("Tasbeeh reminder displayed.");

  } catch (error) {
    console.log(
      "Could not send reminder to the active tab.",
      error
    );
  }
}

chrome.runtime.onInstalled.addListener(async () => {
  await ensureDefaults();
  await createOrUpdateAlarm();
});

chrome.runtime.onStartup.addListener(async () => {
  await ensureDefaults();
  await createOrUpdateAlarm();
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === ALARM_NAME) {
    await showReminderOnTabs();
  }
});

chrome.storage.onChanged.addListener(async (changes, areaName) => {
  if (areaName === "local" && changes.settings) {
    await createOrUpdateAlarm();
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === "TEST_REMINDER") {
    getSettings().then(async (settings) => {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      const tab = tabs[0];

      if (tab?.id) {
        try {
          await chrome.tabs.sendMessage(tab.id, {
            type: "SHOW_REMINDER",
            settings,
            forceTest: true
          });
          sendResponse({ ok: true });
        } catch {
          sendResponse({ ok: false });
        }
      } else {
        sendResponse({ ok: false });
      }
    });
    return true;
  }
});