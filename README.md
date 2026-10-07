# 🌙 Tasbeeh Reminder

**Tasbeeh Reminder** is an open-source Chrome/Chromium browser extension that gently reminds you to remember Allah while you browse.

The default behavior is intentionally simple:

- ⏱️ Show a reminder every **3 minutes**
- 👁️ Keep the reminder visible for **10 seconds**
- 🔀 Select a message randomly from the built-in Zikr/Istighfar collection
- 📍 Choose a default corner of the screen
- 🖱️ Drag the reminder to another position while it is visible
- ⏸️ Enable or pause reminders at any time
- 💾 Store user preferences locally in the browser

## Features

### Current — v1.0.0

- Manifest V3
- Background service worker
- `chrome.alarms` recurring reminder timer
- `chrome.storage.local` settings persistence
- Random Zikr selection
- Arabic + transliteration + meaning
- 3-minute default interval
- 10-second default display duration
- Top-left, top-right, bottom-left and bottom-right positions
- Drag-and-move reminder card
- Test reminder button
- No external API
- No account
- No analytics
- No remote code

## Project structure

```text
tasbeeh-reminder-extension/
│
├── assets/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
│
├── background/
│   └── service-worker.js
│
├── content/
│   ├── content.js
│   └── content.css
│
├── popup/
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
│
├── tests/
│   └── README.md
│
├── .gitignore
├── LICENSE
├── README.md
└── REQUIREMENTS.md
```

## Requirements

See [`REQUIREMENTS.md`](REQUIREMENTS.md).

There are **no npm or Python dependencies** for v1.0.0. The extension uses built-in browser APIs.

Recommended environment:

- Google Chrome or another Chromium-based browser
- Manifest V3 support
- A code editor such as VS Code
- Git

## Installation for development

1. Download or clone this repository.
2. Open Chrome.
3. Go to:

```text
chrome://extensions
```

4. Enable **Developer mode**.
5. Click **Load unpacked**.
6. Select the `tasbeeh-reminder-extension` folder.
7. Pin Tasbeeh Reminder to the browser toolbar.

## Testing

After loading the extension:

1. Open a normal website.
2. Click the Tasbeeh Reminder toolbar icon.
3. Confirm the default settings:
   - Every 3 minutes
   - 10 seconds
   - Bottom right
4. Click **Show test reminder**.
5. Drag the reminder card around the screen.
6. Wait for the automatic 3-minute reminder.

### Important

Chrome internal pages such as `chrome://extensions` do not allow normal content scripts. Test on a regular HTTPS website.

## How it works

```text
                    Tasbeeh Reminder
                       │
          ┌────────────┴────────────┐
          │                         │
     Popup UI                 Service Worker
          │                         │
      Settings                 chrome.alarms
          │                         │
          └──────────┬──────────────┘
                     │
               chrome.storage
                     │
                     ▼
              Content Script
                     │
                     ▼
              Reminder Card
```

The service worker schedules a repeating Chrome alarm. When the alarm fires, it sends a message to browser tabs where the content script is available. The content script selects a random Zikr and renders the reminder card.

## Privacy

Tasbeeh Reminder is designed to work without collecting browsing history or personal information.

The extension:

- Does not send browsing data to a server.
- Does not require an account.
- Does not use analytics.
- Does not call an external API.
- Stores settings locally using Chrome extension storage.

## Open-source roadmap

### v1.1
- Custom Zikr messages
- Add/delete/edit messages
- Better accessibility
- Remember custom dragged position
- Import/export settings

### v1.2
- Zikr categories
- Istighfar category
- Salawat category
- Morning/evening reminders
- Daily reminder counter

### v2.0
- Optional browser notifications
- Optional sound
- Streaks
- Daily goals
- Multiple reminder schedules

### v3.0
- Optional sync
- Multi-language interface
- Firefox support
- Microsoft Edge support
- Community translations

## Contributing

Pull requests are welcome.

For a new feature:

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test the extension locally.
5. Update documentation where necessary.
6. Open a pull request.

## License

MIT License. See [`LICENSE`](LICENSE).

## Disclaimer

Tasbeeh Reminder is a software reminder tool. Users should verify religious text and translations before adding or publishing custom content.
